from typing import List, Dict, Any
from sqlalchemy.orm import Session
import datetime
from backend.app.models.complaint import Complaint

def get_escalation_candidates(db: Session) -> List[Dict[str, Any]]:
    """
    Finds unresolved complaints nearing or exceeding their SLA deadlines
    to trigger priority escalation or supervisor alerts.
    """
    now = datetime.datetime.utcnow()
    # Query non-terminal tickets
    active_tickets = db.query(Complaint).filter(
        Complaint.status.in_(["SUBMITTED", "TRIAGED", "ASSIGNED", "IN_PROGRESS", "NEEDS_REVIEW"])
    ).all()

    escalations = []
    for ticket in active_tickets:
        if ticket.sla_due_at <= now:
            escalations.append({
                "complaint_id": ticket.id,
                "tracking_code": ticket.tracking_code,
                "ward_id": ticket.ward_id,
                "category": ticket.category,
                "priority_score": ticket.priority_score,
                "hours_overdue": round((now - ticket.sla_due_at).total_seconds() / 3600.0, 1),
                "action": "ESCALATE_TO_WARD_HEAD"
            })
    return escalations
