from pydantic import BaseModel, field_validator
from datetime import datetime

class PostBase(BaseModel):
    title: str 
    content: str 

    @field_validator("title")
    def validar_titulo(cls, value):
        if not value or len(value.strip()) == 0:
            raise ValueError("El título no puede estar vacío")
        if len(value) < 3:
            raise ValueError("El título debe tener al menos 3 caracteres")
        if len(value) > 255:
            raise ValueError("El título no debe superar los 255 caracteres")
        return value

    @field_validator("content")
    def validar_contenido(cls, value):
        if not value or len(value.strip()) == 0:
            raise ValueError("La descripción no puede estar vacía")
        if len(value) < 5:
            raise ValueError("La descripción debe tener al menos 5 caracteres")
        return value


class PostCreate(PostBase):
    pass


class PostOut(PostBase):
    id: int
    user_id: int
    created_at: datetime  # aquí sí va el campo de fecha

    class Config:
        from_attributes = True
