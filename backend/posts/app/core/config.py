# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL_SYNC: str
    USERS_SERVICE_URL: str

    class Config:
        env_file = ".env"

settings = Settings()
