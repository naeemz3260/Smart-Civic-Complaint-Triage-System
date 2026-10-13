from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class PriorityFactors(BaseModel):
    severity: float = Field(..., ge=0.0, le=1.0)
    impact: float = Field(..., ge=0.0, le=1.0)
    urgency: float = Field(..., ge=0.0, le=1.0)
    vulnerability: float = Field(..., ge=0.0, le=1.0)

class ComplaintCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=5)
    latitude: float
    longitude: float
    photo_filename: Optional[str] = None

class StatusEventRead(BaseModel):
    id: int
    from_status: Optional[str]
    to_status: str
    actor_role: str
    actor_name: Optional[str]
    comment: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True

class ComplaintRead(BaseModel):
    id: str
    tracking_code: str
    title: str
    description: str
    language: str
    category: str
    department: str
    latitude: float
    longitude: float
    ward_id: str
    status: str
    priority_score: float
    severity_factor: float
    impact_factor: float
    urgency_factor: float
    vulnerability_factor: float
    confidence: float
    is_critical_override: bool
    photo_url: Optional[str] = None
    after_photo_url: Optional[str] = None
    cluster_id: Optional[str] = None
    assigned_to: Optional[str] = None
    created_at: datetime
    sla_due_at: datetime
    resolved_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    status_events: Optional[List[StatusEventRead]] = []

    class Config:
        from_attributes = True

class NearbyCheckRequest(BaseModel):
    latitude: float
    longitude: float
    radius_meters: Optional[float] = 60.0
    category: Optional[str] = None

class NearbyComplaintItem(BaseModel):
    id: str
    title: str
    category: str
    status: str
    distance_meters: float
    created_at: datetime
