from argon2 import PasswordHasher

from infrastructure.db.mysql import mysql_conn

PH = PasswordHasher()

def create_admin(data: dict) -> dict:
    admin_login = str(data["admin_login"]).strip()
    admin_password = str(data["admin_password"])

    is_active_admin = 1 if bool(data.get("is_active_admin", True)) else 0
    admin_birth_date = data.get("admin_birth_date")  # date | None

    if not admin_login:
        raise ValueError("admin_login cannot be empty")
    if not admin_password:
        raise ValueError("admin_password cannot be empty")

    password_hash = PH.hash(admin_password)

    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT 1 FROM admins WHERE admin_login = %s LIMIT 1",
                (admin_login,),
            )
            if cur.fetchone():
                raise ValueError("admin_login already exists")

            cur.execute(
                """
                INSERT INTO admins
                    (admin_login, admin_password_hash, is_active_admin, admin_birth_date, created_at)
                VALUES
                    (%s, %s, %s, %s, NOW())
                """,
                (admin_login, password_hash, is_active_admin, admin_birth_date),
            )
            new_id = int(cur.lastrowid)

            cur.connection.commit()

    admin = get_admin_by_id(new_id)
    if not admin:
        raise RuntimeError("admin created but not found")
    return admin

def get_admin_by_id(admin_id: int) -> dict | None:
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    admin_id,
                    admin_login,
                    is_active_admin,
                    admin_birth_date,
                    created_at
                FROM admins
                WHERE admin_id = %s
                LIMIT 1
                """,
                (int(admin_id),),
            )
            row = cur.fetchone()
            if not row:
                return None

    _admin_id, admin_login, is_active_admin, admin_birth_date, created_at = row
    return {
        "admin_id": int(_admin_id),
        "admin_login": str(admin_login),
        "is_active_admin": bool(is_active_admin),
        "admin_birth_date": admin_birth_date.isoformat() if admin_birth_date else None,
        "created_at": created_at.isoformat() if created_at else None,
    }

def list_admins(*, include_inactive: bool, limit: int, offset: int) -> list[dict]:
    where = "" if include_inactive else "WHERE is_active_admin = 1"

    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                SELECT
                    admin_id,
                    admin_login,
                    is_active_admin,
                    admin_birth_date,
                    created_at
                FROM admins
                {where}
                ORDER BY admin_id DESC
                LIMIT %s OFFSET %s
                """,
                (int(limit), int(offset)),
            )
            rows = cur.fetchall() or []

    items: list[dict] = []
    for (admin_id, admin_login, is_active_admin, admin_birth_date, created_at) in rows:
        items.append(
            {
                "admin_id": int(admin_id),
                "admin_login": str(admin_login),
                "is_active_admin": bool(is_active_admin),
                "admin_birth_date": admin_birth_date.isoformat() if admin_birth_date else None,
                "created_at": created_at.isoformat() if created_at else None,
            }
        )
    return items

def update_admin(admin_id: int, changes: dict) -> dict | None:
    admin_id = int(admin_id)

    if not get_admin_by_id(admin_id):
        return None

    fields: list[str] = []
    params: list = []

    if "admin_login" in changes:
        new_login = str(changes["admin_login"]).strip()
        if not new_login:
            raise ValueError("admin_login cannot be empty")

        with mysql_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT 1 FROM admins
                    WHERE admin_login = %s AND admin_id <> %s
                    LIMIT 1
                    """,
                    (new_login, admin_id),
                )
                if cur.fetchone():
                    raise ValueError("admin_login already exists")

        fields.append("admin_login = %s")
        params.append(new_login)

    if "is_active_admin" in changes:
        fields.append("is_active_admin = %s")
        params.append(1 if bool(changes["is_active_admin"]) else 0)

    if "admin_birth_date" in changes:
        # date | None; None -> NULL в БД
        fields.append("admin_birth_date = %s")
        params.append(changes["admin_birth_date"])

    if not fields:
        raise ValueError("nothing to update")

    params.append(admin_id)

    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE admins SET {', '.join(fields)} WHERE admin_id = %s",
                tuple(params),
            )

    return get_admin_by_id(admin_id)

def delete_admin(admin_id: int, *, hard: bool) -> bool:
    admin_id = int(admin_id)

    if not get_admin_by_id(admin_id):
        return False

    with mysql_conn() as conn:
        with conn.cursor() as cur:
            # всегда чистим сессии этого admin
            cur.execute("DELETE FROM admins_sessions WHERE admin_id = %s", (admin_id,))

            if hard:
                cur.execute("DELETE FROM admins WHERE admin_id = %s", (admin_id,))
            else:
                cur.execute(
                    "UPDATE admins SET is_active_admin = 0 WHERE admin_id = %s",
                    (admin_id,),
                )

    return True