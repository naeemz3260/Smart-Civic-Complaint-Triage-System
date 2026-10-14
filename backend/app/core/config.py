import os
import yaml
from pydantic_settings import BaseSettings

# Resolve base directory (project root is two levels up from backend/app/core)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

class Settings(BaseSettings):
    ENV_MODE: str = os.getenv("ENV_MODE", "lite")
    SQLITE_DB_PATH: str = os.getenv("SQLITE_DB_PATH", os.path.join(BASE_DIR, "data", "civic_complaints.db"))
    CITY_CONFIG_PATH: str = os.getenv("CITY_CONFIG_PATH", os.path.join(BASE_DIR, "config", "city.yaml"))
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "civic-secret-key-change-in-production-2026")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.join(BASE_DIR, "uploads"))

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

def load_city_config() -> dict:
    candidates = [
        settings.CITY_CONFIG_PATH,
        os.path.join(BASE_DIR, "config", "city.yaml"),
        "config/city.yaml",
        "../config/city.yaml"
    ]
    for path in candidates:
        if path and os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return yaml.safe_load(f) or {}
    return {}

city_config = load_city_config()
