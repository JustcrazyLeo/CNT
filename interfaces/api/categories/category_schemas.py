from pydantic import BaseModel, Field
from typing import Optional


class CategoryCreateIn(BaseModel):
    """Схема для создания категории"""
    name: str = Field(..., min_length=1, max_length=100, description="Название категории")
    description: Optional[str] = Field(None, max_length=1000, description="Описание категории")
    is_active: bool = Field(True, description="Активна ли категория")


class CategoryUpdateIn(BaseModel):
    """Схема для обновления категории (все поля опциональны)"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None