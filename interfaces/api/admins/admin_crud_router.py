from fastapi import APIRouter, HTTPException, Query, Depends
from application.admin_crud_service import (
    get_admin_by_id,
    list_admins,
    create_admin,
    update_admin,
    delete_admin
    )

from .admin_crud_schemas import AdminCreateIn, AdminUpdateIn
from .auth.admin_auth_deps import require_admin

router = APIRouter(prefix="/admins", tags=["Admins"])
@router.get("")
async def list_all_admins(
    include_inactive: bool = Query(False),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    admins = list_admins(
        include_inactive=include_inactive,
        limit=limit,
        offset=offset
    )
    return {"ok": True, "admins": admins}

@router.get("/{admin_id}")
async def get_admin_by(
    admin_id: int
):
    admin = get_admin_by_id(admin_id)
    if admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin

@router.post("")
async def create_new_admin(
    admin_in: AdminCreateIn,
    #_admin: dict = Depends(require_admin)
):
    try:
        admin = create_admin(admin_in.model_dump())
        return {"ok": True, "admin": admin}
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    
@router.patch("/{admin_id}")
def route_update_admin(
    admin_id: int,
    data: AdminUpdateIn,
    _admin: dict = Depends(require_admin)
):
    try:
        admin = update_admin(admin_id, changes=data.model_dump(exclude_unset=True))
        return admin
    except Exception as e:
        e.with_traceback
        raise HTTPException(status_code=409, detail=e)

@router.delete("/{admin_id}")
def route_delete_admin(
    admin_id: int,
    hard: bool = Query(False),
    _admin: dict = Depends(require_admin)
):
    ok = delete_admin(admin_id, hard=hard)
    if not ok:
        raise HTTPException(status_code=404, detail="admin not found")
    return {"ok": ok, "hard":hard}