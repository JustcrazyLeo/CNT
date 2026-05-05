from fastapi import Cookie, HTTPException

from application.auth.admin_auth_service import get_current_admin


def require_admin(
    admin_session_id: str | None = Cookie(default=None, alias="admin_session_id"),
) -> dict:
    if not admin_session_id:
        raise HTTPException(status_code=401, detail="not authenticated")

    admin = get_current_admin(admin_session_id)
    if not admin:
        raise HTTPException(status_code=401, detail="invalid session")

    return admin