from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./votequest.db"
    SECRET_KEY: str = "your-secret-key-min-32-chars-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:8000"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    GEMINI_API_KEY: str = "your-gemini-api-key"

    class Config:
        env_file = ".env"

settings = Settings()
