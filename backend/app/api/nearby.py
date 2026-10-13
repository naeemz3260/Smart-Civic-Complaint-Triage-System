from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.schemas.complaint import NearbyCheckRequest, NearbyComplaintItem
from backend.app.models.complaint import Complaint
from backend.app.pipeline.geo import haversine_meters

router = APIRouter(prefix="/nearby", tags=["Nearby / Duplicate Check"])

@router.post("", response_model=List[NearbyComplaintItem])
def check_nearby_complaints(payload: NearbyCheckRequest, db: Session = Depends(get_db)):
    """
    Finds active complaints within a given radius (default 60m)
    to alert residents before submitting duplicates.
    """
    active_complaints = db.query(Complaint).filter(
        Complaint.status.in_(["SUBMITTED", "TRIAGED", "ASSIGNED", "IN_PROGRESS", "NEEDS_REVIEW"])
    ).all()

    radius = payload.radius_meters or 60.0
    results = []

    for c in active_complaints:
        if payload.category and c.category != payload.category:
            continue

        dist = haversine_meters(payload.latitude, payload.longitude, c.latitude, c.longitude)
        if dist <= radius:
            results.append(NearbyComplaintItem(
                id=c.id,
                title=c.title,
                category=c.category,
                status=c.status,
                distance_meters=round(dist, 1),
                created_at=c.created_at
            ))

    # Nearest first
    results.sort(key=lambda x: x.distance_meters)
    return results
