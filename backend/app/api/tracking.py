from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.schemas.complaint import ComplaintRead
from backend.app.models.complaint import Complaint

router = APIRouter(prefix="/tracking", tags=["Public Tracking"])

@router.get("/{tracking_code}", response_model=ComplaintRead)
def track_complaint(tracking_code: str, db: Session = Depends(get_db)):
    """
    Public lookup by 8-character citizen tracking token.
    Provides complete progress and audit timeline without login.
    """
    code = tracking_code.strip().upper()
    cmp = db.query(Complaint).filter(Complaint.tracking_code == code).first()
    if not cmp:
        raise HTTPException(status_code=404, detail="Complaint tracking code not found")
    return cmp
