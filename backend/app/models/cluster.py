import datetime
from sqlalchemy import Column, String, Float, DateTime, Integer
from backend.app.core.database import Base

class Cluster(Base):
    __tablename__ = "clusters"

    id = Column(String, primary_key=True, index=True)
    category = Column(String, nullable=False)
    ward_id = Column(String, nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    ticket_count = Column(Integer, default=1)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
