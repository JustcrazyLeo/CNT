from fastapi import APIRouter, HTTPException, Query
from application.category_service import (
    create_category,
    get_category_by_id,
    list_categories,
    update_category,
    delete_category,
    get_categories_count
)
from .category_schemas import CategoryCreateIn, CategoryUpdateIn

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("")
async def create_new_category(category_in: CategoryCreateIn):
    """Создание новой категории"""
    try:
        category = create_category(category_in.model_dump())
        return {"ok": True, "category": category}
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.get("/{category_id}")
async def get_category(category_id: int):
    """Получение категории по ID"""
    category = get_category_by_id(category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"ok": True, "category": category}

@router.get("")
async def list_all_categories(
    include_inactive: bool = Query(False),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    search: str = Query(None, description="Поиск по названию категории")
):
    """Получение списка категорий с пагинацией и поиском"""
    categories = list_categories(
        include_inactive=include_inactive,
        limit=limit,
        offset=offset,
        search=search
    )
    
    total_count = get_categories_count(
        include_inactive=include_inactive,
        search=search
    )
    
    return {
        "ok": True,
        "categories": categories,
        "total": total_count,
        "limit": limit,
        "offset": offset
    }

@router.patch("/{category_id}")
async def update_category_route(category_id: int, data: CategoryUpdateIn):
    """Обновление категории"""
    try:
        category = update_category(
            category_id,
            changes=data.model_dump(exclude_unset=True)
        )
        if category is None:
            raise HTTPException(status_code=404, detail="Category not found")
        return {"ok": True, "category": category}
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.delete("/{category_id}")
async def delete_category_route(
    category_id: int,
    hard: bool = Query(False, description="True для полного удаления, False для деактивации")
):
    """Удаление категории"""
    ok = delete_category(category_id, hard=hard)
    if not ok:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"ok": True, "hard": hard}