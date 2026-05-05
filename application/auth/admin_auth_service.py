import secrets

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from infrastructure.db.mysql import mysql_conn

PH = PasswordHasher()


def admin_sign_in(admin_login: str, admin_password: str):
    # 1) Находим admin и проверяем активность
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT admin_id, admin_password_hash, is_active_admin
                FROM admins
                WHERE admin_login = %s
                LIMIT 1
                """,
                (admin_login,),
            )
            row = cur.fetchone()
            if not row:
                return None

            admin_id, admin_password_hash, is_active_admin = row
            b = bool(is_active_admin)
            if int(b) != 1:
                return None

            # 2) Проверяем пароль
            try:
                PH.verify(admin_password_hash, admin_password)
            except VerifyMismatchError:
                return None

            # 3) Создаем сессию
            admin_session_id = secrets.token_urlsafe(32)
            cur.execute(
                """
                INSERT INTO admins_sessions (admin_session_id, admin_id, expires_at)
                VALUES (%s, %s, NOW() + INTERVAL 30 DAY)
                """,
                (admin_session_id, int(admin_id)),
            )

    # 4) Возвращаем данные (dict) и id сессии
    admin = {"admin_id": int(admin_id), "admin_login": str(admin_login)}
    return admin, admin_session_id


def admin_sign_out(admin_session_id: str) -> None:
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            # удалить текущую сессию
            cur.execute(
                "DELETE FROM admins_sessions WHERE admin_session_id = %s",
                (admin_session_id,),
            )

            # подчистить протухшие сессии
            cur.execute(
                "DELETE FROM admins_sessions WHERE expires_at IS NOT NULL AND expires_at <= NOW()"
            )


def get_current_admin(admin_session_id: str) -> dict | None:
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT a.admin_id, a.admin_login
                FROM admins_sessions s
                JOIN admins a ON a.admin_id = s.admin_id
                WHERE s.admin_session_id = %s
                  AND (s.expires_at IS NULL OR s.expires_at > NOW())
                  AND a.is_active_admin = 1
                LIMIT 1
                """,
                (admin_session_id,),
            )
            row = cur.fetchone()
            if not row:
                return None

            admin_id, admin_login = row
            return {"admin_id": int(admin_id), "admin_login": str(admin_login)}