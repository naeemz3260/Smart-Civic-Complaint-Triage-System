import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional

from backend.app.core.database import get_db
from backend.app.core.roles import Role, verify_role
from backend.app.schemas.workflow import StatusTransitionRequest, ClosureVerificationRequest
from backend.app.schemas.complaint import ComplaintRead
from backend.app.models.complaint import Complaint
from backend.app.models.closure_check import ClosureCheck
from backend.app.services.audit_service import AuditService
from backend.app.services.closure_service import ClosureService
from backend.app.workflow.state_machine import can_transition

router = APIRouter(prefix="/workflow", tags=["Workflow"])

@router.post("/{complaint_id}/transition", response_model=ComplaintRead)
def transition_complaint_status(
    complaint_id: str,
    payload: StatusTransitionRequest,
    x_role: Optional[str] = Header("admin"),
    x_actor_name: Optional[str] = Header("Municipal User"),
    db: Session = Depends(get_db)
):
    """
    Executes validated status machine transition according to caller role.
    """
    role = verify_role(x_role)
    cmp = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not cmp:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if not can_transition(cmp.status, payload.to_status, role):
        raise HTTPException(
            status_code=400,
            detail=f"Unauthorized or invalid transition: Cannot change from '{cmp.status}' to '{payload.to_status}' as '{role.value}'"
        )

    prev_status = cmp.status
    cmp.status = payload.to_status

    if payload.assigned_to:
        cmp.assigned_to = payload.assigned_to

    now = datetime.datetime.utcnow()
    if payload.to_status == "RESOLVED":
        cmp.resolved_at = now
    elif payload.to_status == "CLOSED":
        cmp.closed_at = now

    db.commit()
    db.refresh(cmp)

    # Log audit event
    AuditService.log_event(
        db,
        complaint_id=cmp.id,
        from_status=prev_status,
        to_status=payload.to_status,
        actor_role=role.value,
        actor_name=x_actor_name,
        comment=payload.comment or f"Status changed to {payload.to_status}"
    )

    return cmp

@router.post("/{complaint_id}/verify-closure")
def submit_and_verify_closure(
    complaint_id: str,
    payload: ClosureVerificationRequest,
    x_role: Optional[str] = Header("staff"),
    db: Session = Depends(get_db)
):
    """
    Field staff submits after-photo for automated comparison and ticket resolution.
    """
    cmp = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not cmp:
        raise HTTPException(status_code=404, detail="Complaint not found")

    before_url = cmp.photo_url or "/photos/default_civic.jpg"
    after_url = f"/uploads/{payload.after_photo_filename}"

    # Verify visual difference & persistent landmark
    result = ClosureService.verify_closure(before_url, after_url)

    check = ClosureCheck(
        complaint_id=cmp.id,
        before_photo_url=before_url,
        after_photo_url=after_url,
        visual_difference_score=result["visual_difference_score"],
        landmark_match_score=result["landmark_match_score"],
        verified_pass=result["verified_pass"],
        verifier_comment=payload.comment
    )
    db.add(check)

    # Auto transition to RESOLVED
    cmp.after_photo_url = after_url
    cmp.status = "RESOLVED"
    cmp.resolved_at = datetime.datetime.utcnow()
    db.commit()

    AuditService.log_event(
        db,
        complaint_id=cmp.id,
        from_status="IN_PROGRESS",
        to_status="RESOLVED",
        actor_role="staff",
        actor_name="Field Staff",
        comment=f"Closure evidence verified (Match: {int(result['landmark_match_score']*100)}%)"
    )

    return {
        "status": "RESOLVED",
        "verification": result,
        "complaint_id": cmp.id
    }
