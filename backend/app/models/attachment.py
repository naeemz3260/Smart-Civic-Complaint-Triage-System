import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    complaint_id = Column(String, ForeignKey("complaints.id"), nullable=False, index=True)
    file_path = Column(String, nullable=False)
    file_type = Column(String, default="image/jpeg")
    sha256_hash = Column(String, nullable=True)
    is_after_photo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="attachments")
