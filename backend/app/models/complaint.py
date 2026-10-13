import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, index=True)
    tracking_code = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    language = Column(String, default="en")
    
    category = Column(String, index=True, nullable=False)
    department = Column(String, nullable=False)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    ward_id = Column(String, index=True, nullable=False)
    
    status = Column(String, default="SUBMITTED", index=True)
    priority_score = Column(Float, default=0.5)
    severity_factor = Column(Float, default=0.5)
    impact_factor = Column(Float, default=0.5)
    urgency_factor = Column(Float, default=0.5)
    vulnerability_factor = Column(Float, default=0.5)
    
    confidence = Column(Float, default=0.5)
    is_critical_override = Column(Boolean, default=False)
    
    photo_url = Column(String, nullable=True)
    after_photo_url = Column(String, nullable=True)
    
    cluster_id = Column(String, ForeignKey("clusters.id"), nullable=True)
    assigned_to = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    sla_due_at = Column(DateTime, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
    closed_at = Column(DateTime, nullable=True)

    status_events = relationship("StatusEvent", back_populates="complaint", cascade="all, delete-orphan")
    attachments = relationship("Attachment", back_populates="complaint", cascade="all, delete-orphan")
    closure_check = relationship("ClosureCheck", back_populates="complaint", uselist=False, cascade="all, delete-orphan")
