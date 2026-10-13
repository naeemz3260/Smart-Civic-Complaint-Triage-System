from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.schemas.stats import HotspotPoint
from backend.app.models.complaint import Complaint

router = APIRouter(prefix="/hotspots", tags=["Hotspots"])

@router.get("", response_model=List[HotspotPoint])
def get_hotspots_data(db: Session = Depends(get_db)):
    """
    Returns coordinate points with intensity and density values
    for rendering on 2D maps and 3D Three.js volumetric columns.
    """
    complaints = db.query(Complaint).all()
    points = []
    for c in complaints:
        # Intensity driven by priority score & status urgency
        intensity = c.priority_score
        if c.status in ["RESOLVED", "CLOSED"]:
            intensity *= 0.4  # Diminished visual weight for completed items

        points.append(HotspotPoint(
            id=c.id,
            latitude=c.latitude,
            longitude=c.longitude,
            intensity=round(intensity, 2),
            category=c.category,
            ward_id=c.ward_id,
            count=1
        ))
    return points
