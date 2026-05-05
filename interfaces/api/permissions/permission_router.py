from fastapi import APIRouter, HTTPException, Query
from application.permissions.permission_service import (
    get_all_permissions,
    get_admin_permissions,
    assign_permission_to_admin,
    remove_permission_from_admin
)
from pydantic import BaseModel

router = APIRouter(prefix="/permissions", tags=["Permissions"])

class AssignPermissionIn(BaseModel):
    admin_id: int
    permission_id: int

@router.get("")
async def list_permissions(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0)
):
    permissions = get_all_permissions(limit=limit, offset=offset)
    return {"ok": True, "permissions": permissions}

@router.get("/admin/{admin_id}")
async def get_admin_permissions_route(admin_id: int):
    permissions = get_admin_permissions(admin_id)
    return {"ok": True, "permissions": permissions}

@router.post("/assign")
async def assign_permission(data: AssignPermissionIn):
    try:
        assign_permission_to_admin(data.admin_id, data.permission_id)
        return {"ok": True, "message": "Permission assigned successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/remove")
async def remove_permission(admin_id: int, permission_id: int):
    try:
        remove_permission_from_admin(admin_id, permission_id)
        return {"ok": True, "message": "Permission removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))