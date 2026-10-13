import os
import yaml
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ENV_MODE: str = os.getenv("ENV_MODE", "lite")
    SQLITE_DB_PATH: str = os.getenv("SQLITE_DB_PATH", "data/civic_complaints.db")
    CITY_CONFIG_PATH: str = os.getenv("CITY_CONFIG_PATH", "config/city.yaml")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "civic-secret-key-change-in-production-2026")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

def load_city_config() -> dict:
    config_path = settings.CITY_CONFIG_PATH
    if os.path.exists(config_path):
        with open(config_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    return {}

city_config = load_city_config()
