from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.api.routes import auth, profile, users  # 👈 aquí routers válidos

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(profile.router, prefix="/profile", tags=["Profile"])
app.include_router(users.router, prefix="/users", tags=["Users"])

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Mi API",
        version="1.0.0",
        description="Documentación de la API",
        routes=app.routes,
    )
    if "components" not in openapi_schema:
        openapi_schema["components"] = {}

    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": { 
            "type": "oauth2",
            "flows": {
                "password": {
                    "tokenUrl": "/auth/login",
                    "scopes": {}
                }
            }
        }
    }
    openapi_schema["security"] = [{"OAuth2PasswordBearer": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
