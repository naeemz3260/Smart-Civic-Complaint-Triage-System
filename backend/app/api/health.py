from fastapi import APIRouter
from backend.app.core.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Smart Civic Complaint Triage System",
        "env_mode": settings.ENV_MODE,
        "database": "sqlite",
        "version": "1.0.0"
    }
