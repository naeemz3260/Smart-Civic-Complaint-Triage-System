from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.schemas.cluster import ClusterRead, ClusterMergeRequest
from backend.app.models.cluster import Cluster
from backend.app.services.cluster_service import ClusterService

router = APIRouter(prefix="/clusters", tags=["Clusters"])

@router.get("", response_model=List[ClusterRead])
def list_clusters(db: Session = Depends(get_db)):
    """Lists active complaint clusters for spatial management."""
    return db.query(Cluster).filter(Cluster.status == "ACTIVE").all()

@router.post("/merge", response_model=ClusterRead)
def merge_clusters_endpoint(payload: ClusterMergeRequest, db: Session = Depends(get_db)):
    """Merges two complaint clusters into a single work order."""
    target = ClusterService.merge_clusters(db, payload.cluster_id, payload.target_cluster_id)
    if not target:
        raise HTTPException(status_code=400, detail="Invalid cluster IDs")
    return target
