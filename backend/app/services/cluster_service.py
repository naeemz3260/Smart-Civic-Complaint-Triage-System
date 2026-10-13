import uuid
from typing import Optional, List
from sqlalchemy.orm import Session
from backend.app.models.cluster import Cluster
from backend.app.models.complaint import Complaint
from backend.app.pipeline.geo import haversine_meters
from backend.app.core.config import city_config

class ClusterService:
    @staticmethod
    def find_or_create_cluster(
        db: Session,
        category: str,
        ward_id: str,
        lat: float,
        lng: float
    ) -> Optional[Cluster]:
        """
        Groups complaints within clustering radius into a unified municipal cluster.
        """
        cluster_radius = city_config.get("clustering", {}).get("cluster_grouping_radius_m", 120)

        # Check existing active clusters in the same ward & category
        existing_clusters = db.query(Cluster).filter(
            Cluster.category == category,
            Cluster.ward_id == ward_id,
            Cluster.status == "ACTIVE"
        ).all()

        for clu in existing_clusters:
            dist = haversine_meters(lat, lng, clu.center_lat, clu.center_lng)
            if dist <= cluster_radius:
                # Merge into cluster
                clu.ticket_count += 1
                # Update center dynamically
                clu.center_lat = (clu.center_lat + lat) / 2.0
                clu.center_lng = (clu.center_lng + lng) / 2.0
                db.commit()
                db.refresh(clu)
                return clu

        # Check if there are other single complaints nearby to form a new cluster
        return None

    @staticmethod
    def merge_clusters(db: Session, source_id: str, target_id: str) -> Optional[Cluster]:
        source = db.query(Cluster).filter(Cluster.id == source_id).first()
        target = db.query(Cluster).filter(Cluster.id == target_id).first()
        if not source or not target:
            return None

        # Reassign complaints
        db.query(Complaint).filter(Complaint.cluster_id == source_id).update({"cluster_id": target_id})
        target.ticket_count += source.ticket_count
        target.center_lat = (target.center_lat + source.center_lat) / 2.0
        target.center_lng = (target.center_lng + source.center_lng) / 2.0
        source.status = "MERGED"
        db.commit()
        db.refresh(target)
        return target
