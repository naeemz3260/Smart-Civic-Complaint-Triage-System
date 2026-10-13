import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class StatusEvent(Base):
    __tablename__ = "status_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    complaint_id = Column(String, ForeignKey("complaints.id"), nullable=False, index=True)
    from_status = Column(String, nullable=True)
    to_status = Column(String, nullable=False)
    actor_role = Column(String, nullable=False)
    actor_name = Column(String, default="System")
    comment = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="status_events")
