from typing import Optional
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.utils.security import hash_password, verify_password, create_access_token
from fastapi import HTTPException

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str):
        q = select(User).where(User.email == email)
        res = await self.db.execute(q)
        return res.scalar_one_or_none()

    async def create_user(self, payload: UserCreate):
        existing = await self.get_by_email(payload.email)
        if existing:
            raise ValueError("El correo ya está registrado")

        user = User(
            email=payload.email,
            full_name=payload.full_name,
            username=getattr(payload, "username", None),
            phone_number=getattr(payload, "phone_number", None),
            birth_date=getattr(payload, "birth_date", None),
            address=getattr(payload, "address", None),
            hashed_password=hash_password(payload.password)
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def authenticate(self, email: str, password: str):
        user = await self.get_by_email(email)
        if not user:
            raise HTTPException(status_code=401, detail="Correo no registrado")
        if not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        token = create_access_token({"sub": str(user.id), "email": user.email})
        return token

    async def get_by_id(self, user_id: int):
        q = select(User).where(User.id == int(user_id))
        res = await self.db.execute(q)
        return res.scalar_one_or_none()

    async def update_user(
        self,
        user: User,
        email: Optional[str] = None,
        full_name: Optional[str] = None,
        phone_number: Optional[str] = None,
        birth_date: Optional[date] = None,
        address: Optional[str] = None,
    ):
        if email and email != user.email:
            other = await self.get_by_email(email)
            if other:
                raise ValueError("El correo ya está en uso")
            user.email = email
        if full_name is not None:
            user.full_name = full_name
        if phone_number is not None:
            user.phone_number = phone_number
        if birth_date is not None:
            user.birth_date = birth_date
        if address is not None:
            user.address = address
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
