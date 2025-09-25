from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days

    # Server Configuration
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    ALLOWED_HOSTS: List[str] = ["*"]

    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:8081",  # Expo default port
        "http://localhost:3000",  # React default port
        "http://localhost:8080",  # Alternative port
        "http://192.168.1.27:8081",  # Expo on physical device
        "*",  # Allow all origins in development (remove in production)
    ]

    # Database Configuration
    DATABASE_URL: str = "sqlite:///./citizen_engagement.db"

    # File Upload Configuration
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB

    # Security
    ALGORITHM: str = "HS256"

    # Optional: Email configuration (for future features)
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None

    # Logging
    LOG_LEVEL: str = "info"

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
