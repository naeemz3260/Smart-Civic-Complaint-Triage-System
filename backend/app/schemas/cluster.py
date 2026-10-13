from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ClusterRead(BaseModel):
    id: str
    category: str
    ward_id: str
    center_lat: float
    center_lng: float
    ticket_count: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ClusterMergeRequest(BaseModel):
    cluster_id: str
    target_cluster_id: str
