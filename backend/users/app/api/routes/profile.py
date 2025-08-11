# app/api/routes/profile.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.api.deps import get_current_user
from app.services.user_service import UserService
from app.schemas.user import UserUpdate, UserOut

router = APIRouter()
@router.get("/", response_model=UserOut)
async def get_profile(
    current_user = Depends(get_current_user)
):
    return current_user
    
@router.put("/", response_model=UserOut)
async def update_profile(
    payload: UserUpdate,
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    svc = UserService(db)
    try:
        updated = await svc.update_user(
            current_user,
            email=payload.email,
            full_name=payload.full_name,
            phone_number=payload.phone_number,
            birth_date=payload.birth_date,
            address=payload.address
        )
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


