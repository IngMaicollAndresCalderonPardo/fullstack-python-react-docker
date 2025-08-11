from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from app.db.base_class import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, nullable=False) 
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
