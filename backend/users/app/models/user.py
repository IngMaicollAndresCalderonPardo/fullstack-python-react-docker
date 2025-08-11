from sqlalchemy import Column, Integer, String, Boolean, DateTime, func, Date
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    username = Column(String, unique=True, index=True, nullable=True)
    phone_number = Column(String, nullable=True)
    birth_date = Column(Date, nullable=True)
    address = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
