from fastapi import APIRouter
from .admins.admin_crud_router import router as admins_router
from .auth.admin_auth_router import router as auth_router
from .admins.roles.admin_roles_router import router as admin_roles_router
from .categories.category_router import router as categories_router
from .permissions.permission_router import router as permissions_router

router = APIRouter()
router.include_router(admins_router)
router.include_router(auth_router)
router.include_router(admin_roles_router)
router.include_router(categories_router)
router.include_router(permissions_router)