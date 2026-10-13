import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.core.database import Base, engine
from backend.app.api.health import router as health_router
from backend.app.api.complaints import router as complaints_router
from backend.app.api.nearby import router as nearby_router
from backend.app.api.workflow import router as workflow_router
from backend.app.api.review import router as review_router
from backend.app.api.clusters import router as clusters_router
from backend.app.api.tracking import router as tracking_router
from backend.app.api.stats import router as stats_router
from backend.app.api.hotspots import router as hotspots_router
from backend.app.api.model_report import router as model_report_router
from backend.app.api.whatif import router as whatif_router

# Ensure tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Civic Complaint Triage System API",
    description="Multilingual civic triage, explainable scoring, spatio-temporal clustering & verified dispatch workflows.",
    version="1.0.0"
)

# CORS Setup
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload directory
upload_dir = settings.UPLOAD_DIR
os.makedirs(upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

# Include Routers
app.include_router(health_router, prefix="/api")
app.include_router(complaints_router, prefix="/api")
app.include_router(nearby_router, prefix="/api")
app.include_router(workflow_router, prefix="/api")
app.include_router(review_router, prefix="/api")
app.include_router(clusters_router, prefix="/api")
app.include_router(tracking_router, prefix="/api")
app.include_router(stats_router, prefix="/api")
app.include_router(hotspots_router, prefix="/api")
app.include_router(model_report_router, prefix="/api")
app.include_router(whatif_router, prefix="/api")

@app.get("/")
def root():
    return {
        "system": "Smart Civic Complaint Triage System",
        "documentation": "/docs",
        "status": "operational"
    }
