from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.routes import posts

app = FastAPI(title="Posts Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Handler para mostrar errores solo en español
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errores = {}
    traducciones = {
        "string should have at least": "El campo debe tener al menos",
        "characters": "caracteres",
        "field required": "Este campo es obligatorio",
        "value is not a valid integer": "El valor no es un número entero válido"
        # puedes agregar más aquí
    }

    for error in exc.errors():
        campo = error["loc"][-1]
        mensaje = error["msg"]

        # Traducir frases comunes
        for en, es in traducciones.items():
            mensaje = mensaje.replace(en, es)

        errores[campo] = mensaje

    return JSONResponse(
        status_code=422,
        content={"detail": errores}
    )



# Rutas
app.include_router(posts.router, prefix="/posts", tags=["Posts"])

# Configuración personalizada OpenAPI
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version="1.0.0",
        description="API para gestionar publicaciones",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "HTTPBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    openapi_schema["security"] = [{"HTTPBearer": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
