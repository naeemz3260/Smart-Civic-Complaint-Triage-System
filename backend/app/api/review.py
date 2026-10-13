import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.core.roles import Role, require_role
from backend.app.schemas.workflow import HumanReviewDecision
from backend.app.models.review_item import ReviewItem
from backend.app.models.complaint import Complaint
from backend.app.services.audit_service import AuditService

router = APIRouter(prefix="/review", tags=["Review Queue"])

@router.get("/queue")
def get_review_queue(db: Session = Depends(get_db)):
    """Retrieves unreviewed low-confidence tickets for admin human triage."""
    items = db.query(ReviewItem).filter(ReviewItem.reviewed == False).all()
    out = []
    for item in items:
        cmp = db.query(Complaint).filter(Complaint.id == item.complaint_id).first()
        out.append({
            "review_id": item.id,
            "complaint_id": item.complaint_id,
            "title": cmp.title if cmp else "N/A",
            "description": cmp.description if cmp else "N/A",
            "predicted_category": item.predicted_category,
            "confidence": item.confidence,
            "reason": item.reason,
            "ward_id": cmp.ward_id if cmp else "N/A",
            "created_at": item.created_at
        })
    return out

@router.post("/decide")
def submit_review_decision(
    payload: HumanReviewDecision,
    x_role: str = Header("admin"),
    x_actor_name: str = Header("Admin Reviewer"),
    db: Session = Depends(get_db)
):
    """Admin confirms or reassigns complaint category from review queue."""
    item = db.query(ReviewItem).filter(ReviewItem.id == payload.review_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Review item not found")

    cmp = db.query(Complaint).filter(Complaint.id == item.complaint_id).first()
    if cmp:
        prev_cat = cmp.category
        cmp.category = payload.confirmed_category
        cmp.status = "TRIAGED"
        cmp.confidence = 1.0  # Human validated

        AuditService.log_event(
            db,
            complaint_id=cmp.id,
            from_status="NEEDS_REVIEW",
            to_status="TRIAGED",
            actor_role="admin",
            actor_name=x_actor_name,
            comment=payload.comment or f"Category confirmed as '{payload.confirmed_category}' by municipal admin"
        )

    item.reviewed = True
    item.reviewed_by = x_actor_name
    item.reviewed_at = datetime.datetime.utcnow()
    db.commit()

    return {"status": "SUCCESS", "complaint_id": item.complaint_id, "confirmed_category": payload.confirmed_category}
