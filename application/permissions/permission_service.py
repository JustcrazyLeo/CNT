from typing import List, Dict, Any
from infrastructure.db.mysql import mysql_conn


def get_all_permissions(limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    """Получение списка всех разрешений"""
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT permission_id, permission_name, description, created_at
                FROM permissions
                ORDER BY permission_id
                LIMIT %s OFFSET %s
                """,
                (limit, offset)
            )
            rows = cur.fetchall() or []
    
    return [
        {
            "permission_id": int(row[0]),
            "permission_name": str(row[1]),
            "description": str(row[2]) if row[2] else None,
            "created_at": row[3].isoformat() if row[3] else None
        }
        for row in rows
    ]


def get_admin_permissions(admin_id: int) -> List[Dict[str, Any]]:
    """Получение списка разрешений конкретного администратора"""
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT p.permission_id, p.permission_name, p.description
                FROM permissions p
                JOIN admin_permissions_relations apr ON p.permission_id = apr.permission_id
                WHERE apr.admin_id = %s
                ORDER BY p.permission_id
                """,
                (int(admin_id),)
            )
            rows = cur.fetchall() or []
    
    return [
        {
            "permission_id": int(row[0]),
            "permission_name": str(row[1]),
            "description": str(row[2]) if row[2] else None
        }
        for row in rows
    ]


def assign_permission_to_admin(admin_id: int, permission_id: int) -> None:
    """Назначение разрешения администратору"""
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            # Проверяем существование админа
            cur.execute(
                "SELECT 1 FROM admins WHERE admin_id = %s",
                (admin_id,)
            )
            if not cur.fetchone():
                raise ValueError("Admin not found")
            
            # Проверяем существование разрешения
            cur.execute(
                "SELECT 1 FROM permissions WHERE permission_id = %s",
                (permission_id,)
            )
            if not cur.fetchone():
                raise ValueError("Permission not found")
            
            # Проверяем, не назначено ли уже это разрешение
            cur.execute(
                """
                SELECT 1 FROM admin_permissions_relations 
                WHERE admin_id = %s AND permission_id = %s
                """,
                (admin_id, permission_id)
            )
            if cur.fetchone():
                raise ValueError("Permission already assigned to this admin")
            
            # Назначаем разрешение
            cur.execute(
                """
                INSERT INTO admin_permissions_relations (admin_id, permission_id)
                VALUES (%s, %s)
                """,
                (admin_id, permission_id)
            )
            conn.commit()


def remove_permission_from_admin(admin_id: int, permission_id: int) -> None:
    """Удаление разрешения у администратора"""
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM admin_permissions_relations
                WHERE admin_id = %s AND permission_id = %s
                """,
                (admin_id, permission_id)
            )
            conn.commit()


def check_admin_permission(admin_id: int, permission_name: str) -> bool:
    """Проверка наличия конкретного разрешения у администратора"""
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 1
                FROM permissions p
                JOIN admin_permissions_relations apr ON p.permission_id = apr.permission_id
                WHERE apr.admin_id = %s AND p.permission_name = %s
                LIMIT 1
                """,
                (int(admin_id), permission_name)
            )
            return cur.fetchone() is not None