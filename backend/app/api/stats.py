from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import datetime

from backend.app.core.database import get_db
from backend.app.schemas.stats import CityStatsResponse
from backend.app.models.complaint import Complaint

router = APIRouter(prefix="/stats", tags=["Stats & Transparency"])

@router.get("", response_model=CityStatsResponse)
def get_city_statistics(db: Session = Depends(get_db)):
    """Computes municipal aggregate analytics and SLA metrics."""
    complaints = db.query(Complaint).all()
    now = datetime.datetime.utcnow()

    total = len(complaints)
    resolved = sum(1 for c in complaints if c.status in ["RESOLVED", "CLOSED"])
    pending = total - resolved

    breached = sum(1 for c in complaints if c.status not in ["RESOLVED", "CLOSED"] and c.sla_due_at < now)
    compliant_resolutions = sum(1 for c in complaints if c.status in ["RESOLVED", "CLOSED"] and (c.resolved_at or c.sla_due_at) <= c.sla_due_at)

    sla_compliance_rate = round(compliant_resolutions / max(1, resolved), 2)
    auto_triaged = sum(1 for c in complaints if c.confidence >= 0.75 and not c.is_critical_override)
    auto_rate = round(auto_triaged / max(1, total), 2)

    cat_dist = {}
    ward_dist = {}
    for c in complaints:
        cat_dist[c.category] = cat_dist.get(c.category, 0) + 1
        ward_dist[c.ward_id] = ward_dist.get(c.ward_id, 0) + 1

    return CityStatsResponse(
        total_complaints=total,
        resolved_count=resolved,
        pending_count=pending,
        breached_count=breached,
        sla_compliance_rate=sla_compliance_rate,
        auto_triage_rate=auto_rate,
        category_distribution=cat_dist,
        ward_distribution=ward_dist
    )
