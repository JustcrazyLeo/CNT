from datetime import date
from pydantic import BaseModel, Field


class AdminCreateIn(BaseModel):
    admin_login: str = Field(min_length=3, max_length=64)
    admin_password: str = Field(min_length=8, max_length=128)

    is_active_admin: bool = True
    admin_birth_date: date | None = None

class AdminUpdateIn(BaseModel):
    # PATCH: можно присылать только то, что меняем
    admin_login: str | None = Field(default=None, min_length=3, max_length=64)
    is_active_admin: bool | None = None
    admin_birth_date: date | None = None