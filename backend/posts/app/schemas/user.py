# app/schemas/user.py  (posts)
from pydantic import BaseModel
from typing import Optional

class UserOut(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None

    # pydantic v2:
    model_config = {"from_attributes": True}
    # si estás con pydantic v1 reemplaza por:
    # class Config:
    #     orm_mode = True
