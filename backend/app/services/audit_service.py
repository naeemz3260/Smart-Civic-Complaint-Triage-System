import datetime
from sqlalchemy.orm import Session
from backend.app.models.status_event import StatusEvent

class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        complaint_id: str,
        from_status: str,
        to_status: str,
        actor_role: str,
        actor_name: str = "System",
        comment: str = None
    ) -> StatusEvent:
        event = StatusEvent(
            complaint_id=complaint_id,
            from_status=from_status,
            to_status=to_status,
            actor_role=actor_role,
            actor_name=actor_name,
            comment=comment,
            timestamp=datetime.datetime.utcnow()
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event
