from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from backend.app.core.database import get_db
from backend.app.schemas.complaint import ComplaintCreate, ComplaintRead
from backend.app.services.complaint_service import ComplaintService
from backend.app.services.media_service import MediaService
from backend.app.models.complaint import Complaint

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.post("", response_model=ComplaintRead)
def submit_complaint(data: ComplaintCreate, db: Session = Depends(get_db)):
    """Submit a civic complaint with auto-triage and scoring."""
    complaint = ComplaintService.create_complaint(db, data)
    return complaint

@router.get("", response_model=List[ComplaintRead])
def list_complaints(
    category: Optional[str] = None,
    ward_id: Optional[str] = None,
    status: Optional[str] = None,
    min_priority: Optional[float] = None,
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    """Lists complaints with optional filtering by ward, category, status, or priority."""
    query = db.query(Complaint)
    if category:
        query = query.filter(Complaint.category == category)
    if ward_id:
        query = query.filter(Complaint.ward_id == ward_id)
    if status:
        query = query.filter(Complaint.status == status)
    if min_priority:
        query = query.filter(Complaint.priority_score >= min_priority)

    # High priority tickets first
    return query.order_by(Complaint.priority_score.desc()).limit(limit).all()

@router.get("/{complaint_id}", response_model=ComplaintRead)
def get_complaint(complaint_id: str, db: Session = Depends(get_db)):
    """Fetches full details and audit timeline for a specific complaint."""
    cmp = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not cmp:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return cmp

@router.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    """Uploads photo and strips sensitive EXIF metadata."""
    content = await file.read()
    dest = os.path.join("uploads", file.filename)
    saved_path, sha256 = MediaService.strip_exif_and_save(content, dest)
    return {
        "filename": file.filename,
        "saved_path": saved_path,
        "sha256": sha256
    }
