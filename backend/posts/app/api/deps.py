# app/api/deps.py  (posts)
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from app.core.config import settings

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    if not getattr(settings, "USERS_SERVICE_URL", None):
        raise HTTPException(status_code=500, detail="USERS_SERVICE_URL not configured in settings")

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                f"{settings.USERS_SERVICE_URL}/users/me",
                headers={"Authorization": f"Bearer {token}"},
                timeout=5.0
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Users service unavailable: {str(e)}"
            )

    # si no es 200 -> devolver detalle del body para depuración
    if resp.status_code != 200:
        body = None
        try:
            body = resp.json()
        except Exception:
            body = resp.text
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token (users responded {resp.status_code}): {body}"
        )

    user_data = resp.json()

    # Intentar convertir a Pydantic UserOut si está disponible en posts
    try:
        from app.schemas.user import UserOut  # opcional, si lo creas abajo
        # Para pydantic v2:
        try:
            return UserOut.model_validate(user_data)
        except Exception:
            # pydantic v1 fallback
            return UserOut(**user_data)
    except Exception:
        # si no existe UserOut en posts, devolvemos el dict tal cual
        return user_data
