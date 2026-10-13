import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from backend.app.core.database import Base

class ReviewItem(Base):
    __tablename__ = "review_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    complaint_id = Column(String, index=True, nullable=False)
    predicted_category = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    reason = Column(String, default="Low confidence ML score")
    reviewed = Column(Boolean, default=False)
    reviewed_by = Column(String, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
