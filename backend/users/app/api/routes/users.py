from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserOut
from app.api.deps import get_current_user 

router = APIRouter()

@router.get("/", response_model=List[UserOut])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    return result.scalars().all()

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Devuelve el usuario autenticado en base al token JWT.
    Este endpoint es usado por otros microservicios para validar el token.
    """
    return current_user
