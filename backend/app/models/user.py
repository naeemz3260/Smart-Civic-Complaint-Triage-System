import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, default="resident")
    department = Column(String, nullable=True)
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
