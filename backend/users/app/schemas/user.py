# app/schemas/user.py
from datetime import datetime, date
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
import re

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    username: Optional[str] = None          # Nuevo campo opcional
    phone_number: Optional[str] = None      # Nuevo campo opcional
    birth_date: Optional[date] = None       # Nuevo campo opcional
    address: Optional[str] = None            # Nuevo campo opcional

class UserCreate(UserBase):
    password: str = Field(
        ...,
        min_length=8,
        description="Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&-_)."
    )

    @field_validator("password")
    def validate_password(cls, value: str) -> str:
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-\_])[A-Za-z\d@$!%*?&\-\_]{8,}$'
        if not re.match(pattern, value):
            raise ValueError(
                "La contraseña debe tener al menos 8 caracteres, "
                "una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&-_)."
            )
        return value

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    username: Optional[str] = None          # Añadido
    phone_number: Optional[str] = None      # Añadido
    birth_date: Optional[date] = None       # Añadido
    address: Optional[str] = None            # Añadido

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

