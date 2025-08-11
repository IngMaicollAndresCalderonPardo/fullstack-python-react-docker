# app/core/config.py
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Config DB
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "users_db"  # Default seguro para dev
    DATABASE_URL: str  # Obligatorio 

    # Auth
    JWT_SECRET: str  # Obligatorio
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 30

    # Inter-service communication
    USERS_SERVICE_URL: str = "http://users:8000"  # Default local

    # Opcional (puede estar vacío)
    USE_LOCALHOST_FOR_SWAGGER: Optional[bool] = False

    class Config:
        env_file = ".env"

settings = Settings()
