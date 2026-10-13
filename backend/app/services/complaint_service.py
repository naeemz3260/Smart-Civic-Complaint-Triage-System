import uuid
import datetime
from sqlalchemy.orm import Session
from backend.app.models.complaint import Complaint
from backend.app.models.review_item import ReviewItem
from backend.app.schemas.complaint import ComplaintCreate
from backend.app.pipeline.fusion import FusionEngine
from backend.app.pipeline.geo import GeoService
from backend.app.priority.engine import PriorityEngine
from backend.app.services.cluster_service import ClusterService
from backend.app.services.audit_service import AuditService
from backend.app.core.config import city_config

fusion_engine = FusionEngine()
geo_service = GeoService()
priority_engine = PriorityEngine()

class ComplaintService:
    @staticmethod
    def create_complaint(db: Session, data: ComplaintCreate, actor_name: str = "Resident Web") -> Complaint:
        # 1. Run Multimodal & NLP Fusion
        fusion_result = fusion_engine.fuse(
            text=f"{data.title}. {data.description}",
            image_filename=data.photo_filename
        )
        category = fusion_result["category"]
        confidence = fusion_result["confidence"]
        language = fusion_result["language"]
        is_critical = fusion_result["is_critical"]

        # 2. Geo & Ward Lookup
        ward_info = geo_service.find_ward(data.latitude, data.longitude)
        ward_id = ward_info.get("ward_id", "WARD-01")
        ward_density = ward_info.get("population_density", 0.70)
        vulnerability = geo_service.compute_vulnerability(data.latitude, data.longitude)

        # 3. Department & SLA from city.yaml
        dept_map = {c["id"]: c.get("department", "Public Works") for c in city_config.get("categories", [])}
        sla_hours_map = {c["id"]: c.get("default_sla_hours", 48) for c in city_config.get("categories", [])}
        base_sev_map = {c["id"]: c.get("base_severity", 0.5) for c in city_config.get("categories", [])}

        department = dept_map.get(category, "Municipal Maintenance")
        sla_hours = sla_hours_map.get(category, 48)
        base_severity = base_sev_map.get(category, 0.5)

        # 4. Spatio-temporal cluster lookup
        cluster = ClusterService.find_or_create_cluster(db, category, ward_id, data.latitude, data.longitude)
        cluster_count = cluster.ticket_count if cluster else 1
        cluster_id = cluster.id if cluster else None

        # 5. Calculate Priority Score
        p_res = priority_engine.compute_priority(
            category=category,
            base_severity=base_severity,
            is_critical_override=is_critical,
            ward_density=ward_density,
            cluster_count=cluster_count,
            elapsed_hours=0.0,
            default_sla_hours=sla_hours,
            geo_vulnerability=vulnerability
        )

        now = datetime.datetime.utcnow()
        sla_due_at = now + datetime.timedelta(hours=sla_hours)
        ticket_id = f"MCC-2026-{uuid.uuid4().hex[:6].upper()}"
        tracking_code = f"TRK-{uuid.uuid4().hex[:5].upper()}"

        # 6. Initial Status: Auto-triaged vs Low-confidence review
        initial_status = "SUBMITTED"
        if is_critical:
            initial_status = "ASSIGNED"
        elif fusion_result["needs_human_review"]:
            initial_status = "NEEDS_REVIEW"
        else:
            initial_status = "TRIAGED"

        complaint = Complaint(
            id=ticket_id,
            tracking_code=tracking_code,
            title=data.title,
            description=data.description,
            language=language,
            category=category,
            department=department,
            latitude=data.latitude,
            longitude=data.longitude,
            ward_id=ward_id,
            status=initial_status,
            priority_score=p_res["priority_score"],
            severity_factor=p_res["factors"]["severity"],
            impact_factor=p_res["factors"]["impact"],
            urgency_factor=p_res["factors"]["urgency"],
            vulnerability_factor=p_res["factors"]["vulnerability"],
            confidence=confidence,
            is_critical_override=is_critical,
            photo_url=f"/uploads/{data.photo_filename}" if data.photo_filename else None,
            cluster_id=cluster_id,
            created_at=now,
            sla_due_at=sla_due_at
        )
        db.add(complaint)
        db.commit()
        db.refresh(complaint)

        # Audit event
        AuditService.log_event(
            db, complaint.id, from_status=None, to_status=initial_status,
            actor_role="resident", actor_name=actor_name,
            comment="Complaint received and triaged by multimodal pipeline"
        )

        # If low confidence, record in ReviewItem queue
        if initial_status == "NEEDS_REVIEW":
            r_item = ReviewItem(
                complaint_id=complaint.id,
                predicted_category=category,
                confidence=confidence,
                reason=f"Model confidence ({int(confidence*100)}%) below auto-triage threshold"
            )
            db.add(r_item)
            db.commit()

        return complaint
