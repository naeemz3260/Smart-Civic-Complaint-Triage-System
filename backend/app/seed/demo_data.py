import uuid
import random
import datetime
from backend.app.core.database import SessionLocal, engine, Base
from backend.app.models.complaint import Complaint
from backend.app.models.status_event import StatusEvent
from backend.app.models.review_item import ReviewItem
from backend.app.models.closure_check import ClosureCheck
from backend.app.models.cluster import Cluster
from backend.app.models.user import User

def seed_demo():
    print("[INFO] Initializing SQLite database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if complaints already exist
    if db.query(Complaint).count() > 0:
        print("[INFO] Database already contains records. Skipping seed.")
        db.close()
        return

    print("[INFO] Seeding users, complaints, status events, and demo clusters...")

    # Users
    users = [
        User(username="citizen_ali", role="resident", full_name="Ali Resident"),
        User(username="staff_imran", role="staff", department="Road Maintenance Dept", full_name="Engr. Imran Staff"),
        User(username="admin_fatima", role="admin", department="Municipal HQ", full_name="Director Fatima Admin"),
    ]
    db.add_all(users)

    # Cluster
    c1 = Cluster(
        id="CLU-101",
        category="pothole",
        ward_id="WARD-02",
        center_lat=24.8562,
        center_lng=67.0261,
        ticket_count=2,
        status="ACTIVE"
    )
    db.add(c1)

    now = datetime.datetime.utcnow()

    # 1. High Priority Road Hazard (In Progress)
    cmp1 = Complaint(
        id="MCC-2026-0001",
        tracking_code="TRK-91823",
        title="Severe road cavity on Main Boulevard near Hospital",
        description="Massive deep pothole on main road causing serious traffic jams and motorcycle slips near General Teaching Hospital.",
        language="en",
        category="pothole",
        department="Road Maintenance Dept",
        latitude=24.8562,
        longitude=67.0261,
        ward_id="WARD-02",
        status="IN_PROGRESS",
        priority_score=0.88,
        severity_factor=0.75,
        impact_factor=0.90,
        urgency_factor=0.85,
        vulnerability_factor=1.00,
        confidence=0.94,
        is_critical_override=False,
        photo_url="/photos/pothole_before.jpg",
        cluster_id="CLU-101",
        assigned_to="staff_imran",
        created_at=now - datetime.timedelta(hours=20),
        sla_due_at=now + datetime.timedelta(hours=28)
    )
    db.add(cmp1)

    # Status events for cmp1
    db.add(StatusEvent(complaint_id="MCC-2026-0001", from_status=None, to_status="SUBMITTED", actor_role="resident", actor_name="citizen_ali", comment="Complaint submitted"))
    db.add(StatusEvent(complaint_id="MCC-2026-0001", from_status="SUBMITTED", to_status="TRIAGED", actor_role="system", actor_name="AI Triage Engine", comment="Auto-triaged: High Priority Pothole"))
    db.add(StatusEvent(complaint_id="MCC-2026-0001", from_status="TRIAGED", to_status="ASSIGNED", actor_role="admin", actor_name="admin_fatima", comment="Assigned to Field Unit 3"))
    db.add(StatusEvent(complaint_id="MCC-2026-0001", from_status="ASSIGNED", to_status="IN_PROGRESS", actor_role="staff", actor_name="staff_imran", comment="Crew deployed on-site"))

    # 2. Critical Safety Override: Live Wire (Assigned)
    cmp2 = Complaint(
        id="MCC-2026-0002",
        tracking_code="TRK-44021",
        title="Dangerous Live Electric Wire Snapped on Street",
        description="Bijli ka taar toot kar zameen pe gir gaya hai current lagne ka khatra. Sparking happening right near bus stop.",
        language="roman_ur",
        category="electricity",
        department="Power Distribution Corp",
        latitude=24.8320,
        longitude=67.0345,
        ward_id="WARD-01",
        status="ASSIGNED",
        priority_score=0.98,
        severity_factor=1.00,
        impact_factor=0.95,
        urgency_factor=1.00,
        vulnerability_factor=0.85,
        confidence=0.99,
        is_critical_override=True,
        photo_url="/photos/live_wire.jpg",
        assigned_to="Emergency Electrical Crew",
        created_at=now - datetime.timedelta(hours=2),
        sla_due_at=now + datetime.timedelta(hours=10)
    )
    db.add(cmp2)
    db.add(StatusEvent(complaint_id="MCC-2026-0002", from_status=None, to_status="SUBMITTED", actor_role="resident", actor_name="Resident Mobile", comment="Submitted with critical safety keyword"))
    db.add(StatusEvent(complaint_id="MCC-2026-0002", from_status="SUBMITTED", to_status="ASSIGNED", actor_role="system", actor_name="AI Safety Guardian", comment="Instant emergency override triggered"))

    # 3. Resolved Sewage Overflow with Before/After Verification
    cmp3 = Complaint(
        id="MCC-2026-0003",
        tracking_code="TRK-10824",
        title="Sewage Manhole Overflowing into Primary School Gate",
        description="سیوریج کا گندا پانی اسکول کے دروازے پر ابل رہا ہے اور بچے گزر نہیں پا رہے",
        language="ur",
        category="sewage",
        department="Water & Sanitation Authority",
        latitude=24.8285,
        longitude=67.0315,
        ward_id="WARD-01",
        status="RESOLVED",
        priority_score=0.92,
        severity_factor=0.90,
        impact_factor=0.85,
        urgency_factor=0.95,
        vulnerability_factor=0.98,
        confidence=0.93,
        photo_url="/photos/sewage_before.jpg",
        after_photo_url="/photos/sewage_after.jpg",
        assigned_to="staff_imran",
        created_at=now - datetime.timedelta(hours=30),
        sla_due_at=now - datetime.timedelta(hours=6),
        resolved_at=now - datetime.timedelta(hours=2)
    )
    db.add(cmp3)
    db.add(ClosureCheck(
        complaint_id="MCC-2026-0003",
        before_photo_url="/photos/sewage_before.jpg",
        after_photo_url="/photos/sewage_after.jpg",
        visual_difference_score=0.82,
        landmark_match_score=0.91,
        verified_pass=True,
        verifier_comment="Drain cleared, manhole sealed cleanly."
    ))

    # 4. Low Confidence Complaint requiring Human Review
    cmp4 = Complaint(
        id="MCC-2026-0004",
        tracking_code="TRK-58190",
        title="Ambiguous complaint regarding neighborhood smell",
        description="Something is bad in the corner please check it as soon as possible",
        language="en",
        category="garbage",
        department="Solid Waste Management",
        latitude=24.9100,
        longitude=67.0650,
        ward_id="WARD-03",
        status="NEEDS_REVIEW",
        priority_score=0.48,
        severity_factor=0.50,
        impact_factor=0.45,
        urgency_factor=0.40,
        vulnerability_factor=0.55,
        confidence=0.56,
        created_at=now - datetime.timedelta(hours=4),
        sla_due_at=now + datetime.timedelta(hours=44)
    )
    db.add(cmp4)
    db.add(ReviewItem(
        complaint_id="MCC-2026-0004",
        predicted_category="garbage",
        confidence=0.56,
        reason="Low NLP confidence (56%) - Text ambiguous",
        reviewed=False
    ))

    # 5. Closed Streetlight Ticket
    cmp5 = Complaint(
        id="MCC-2026-0005",
        tracking_code="TRK-77291",
        title="Streetlight failure in residential block 7",
        description="All streetlights non functional on lane leading to darkness and safety issues.",
        language="en",
        category="streetlight",
        department="Municipal Electrical Services",
        latitude=24.9530,
        longitude=67.0505,
        ward_id="WARD-04",
        status="CLOSED",
        priority_score=0.52,
        severity_factor=0.45,
        impact_factor=0.50,
        urgency_factor=0.45,
        vulnerability_factor=0.70,
        confidence=0.89,
        photo_url="/photos/light_before.jpg",
        after_photo_url="/photos/light_after.jpg",
        assigned_to="Lighting Maintenance Unit",
        created_at=now - datetime.timedelta(days=3),
        sla_due_at=now - datetime.timedelta(days=1),
        resolved_at=now - datetime.timedelta(days=1, hours=2),
        closed_at=now - datetime.timedelta(hours=18)
    )
    db.add(cmp5)

    db.commit()
    db.close()
    print("[SUCCESS] Database successfully seeded with 5 multi-lifecycle complaints.")

if __name__ == "__main__":
    seed_demo()
