import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class ClosureCheck(Base):
    __tablename__ = "closure_checks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    complaint_id = Column(String, ForeignKey("complaints.id"), unique=True, nullable=False)
    before_photo_url = Column(String, nullable=False)
    after_photo_url = Column(String, nullable=False)
    visual_difference_score = Column(Float, default=0.75)
    landmark_match_score = Column(Float, default=0.88)
    verified_pass = Column(Boolean, default=True)
    verifier_comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="closure_check")
