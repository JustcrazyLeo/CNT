from fastapi import APIRouter, HTTPException, Query, Depends
from application.roles.admin_role_service import (get_roles, assign_role_to_admin)

router = APIRouter(prefix="/admin-roles", tags=["Admin Roles"])
from .admin_roles_schemas import AdminAssignRoleIn

@router.get("")
async def get_all_admin_roles(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    roles = get_roles(
        limit=limit,
        offset=offset
    )

    return {"ok": True, "roles": roles}

@router.post("/assign_role_to_admin")
def assign_role(
    admin_role_in: AdminAssignRoleIn,
):
    try:
        assign_role_to_admin(
            admin_id=admin_role_in.admin_id,
            role_id=admin_role_in.role_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"ok": True}