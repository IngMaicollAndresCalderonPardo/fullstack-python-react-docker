# app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.user import UserCreate, Token, UserOut
from app.services.user_service import UserService
from app.utils.security import decode_token

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    svc = UserService(db)
    try:
        user = await svc.create_user(payload)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    svc = UserService(db)
    # OAuth2PasswordRequestForm usa 'username' y 'password' (username -> tu email)
    token = await svc.authenticate(
        form_data.username, 
        form_data.password)
    # svc.authenticate debería devolver el token o lanzar HTTPException
    return {"access_token": token, "token_type": "bearer"}

@router.post("/verify", response_model=UserOut)
async def verify(body: dict, db: AsyncSession = Depends(get_db)):
    token = body.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token required")
    data = decode_token(token)
    if not data:
        raise HTTPException(status_code=401, detail="Invalid token")
    svc = UserService(db)
    user = await svc.get_by_id(data.get("sub"))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
