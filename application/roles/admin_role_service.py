from typing import List, Dict, Any
from infrastructure.db.mysql import mysql_conn


# ============ Существующие функции ============

def get_roles(limit: int = 50, offset: int = 0):
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, name
                FROM roles
                ORDER BY id
                LIMIT %s OFFSET %s
                """,
                (limit, offset)
            )
            rows = cur.fetchall()
            roles = [{"role_id": int(role_id), "role_name": str(role_name)} for role_id, role_name in rows]
    return roles


def assign_role_to_admin(admin_id: int, role_id: int):
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            # Проверяем, что админ существует
            cur.execute(
                "SELECT 1 FROM admins WHERE admin_id = %s",
                (admin_id,),
            )
            if not cur.fetchone():
                raise ValueError("Admin not found")

            # Проверяем, что роль существует
            cur.execute(
                "SELECT 1 FROM roles WHERE id = %s",
                (role_id,),
            )
            if not cur.fetchone():
                raise ValueError("Role not found")

            # Проверяем, что роль еще не назначена этому админу
            cur.execute(
                "SELECT 1 FROM admin_roles_relations WHERE admin_id = %s AND role_id = %s",
                (admin_id, role_id),
            )
            if cur.fetchone():
                raise ValueError("Role already assigned to this admin")

            # Назначаем роль админу
            cur.execute(
                "INSERT INTO admin_roles_relations (admin_id, role_id) VALUES (%s, %s)",
                (admin_id, role_id),
            )
            conn.commit()


# ============ НОВЫЕ ФУНКЦИИ ДЛЯ СВЯЗИ РОЛЕЙ И РАЗРЕШЕНИЙ ============

def get_role_permissions(role_id: int) -> List[Dict[str, Any]]:
    """
    Получить все разрешения, назначенные роли
    
    Args:
        role_id: ID роли
    
    Returns:
        Список разрешений роли
    """
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT p.permission_id, p.permission_name, p.description
                FROM permissions p
                JOIN role_permissions_relations rpr ON p.permission_id = rpr.permission_id
                WHERE rpr.role_id = %s
                ORDER BY p.permission_id
                """,
                (int(role_id),)
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


def assign_permission_to_role(role_id: int, permission_id: int) -> None:
    """
    Назначить разрешение роли
    
    Args:
        role_id: ID роли
        permission_id: ID разрешения
    
    Raises:
        ValueError: если роль не найдена, разрешение не найдено или связь уже существует
    """
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            # Проверяем существование роли
            cur.execute("SELECT 1 FROM roles WHERE id = %s", (role_id,))
            if not cur.fetchone():
                raise ValueError(f"Роль с ID {role_id} не найдена")
            
            # Проверяем существование разрешения
            cur.execute(
                "SELECT 1 FROM permissions WHERE permission_id = %s",
                (permission_id,)
            )
            if not cur.fetchone():
                raise ValueError(f"Разрешение с ID {permission_id} не найдено")
            
            # Проверяем, что связь еще не существует
            cur.execute(
                """
                SELECT 1 FROM role_permissions_relations 
                WHERE role_id = %s AND permission_id = %s
                """,
                (role_id, permission_id)
            )
            if cur.fetchone():
                raise ValueError(f"Разрешение {permission_id} уже назначено роли {role_id}")
            
            # Создаем связь
            cur.execute(
                """
                INSERT INTO role_permissions_relations (role_id, permission_id)
                VALUES (%s, %s)
                """,
                (role_id, permission_id)
            )
            conn.commit()


def remove_permission_from_role(role_id: int, permission_id: int) -> bool:
    """
    Удалить разрешение у роли
    
    Args:
        role_id: ID роли
        permission_id: ID разрешения
    
    Returns:
        True если удалено успешно, False если связь не найдена
    """
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM role_permissions_relations
                WHERE role_id = %s AND permission_id = %s
                """,
                (role_id, permission_id)
            )
            affected = cur.rowcount
            conn.commit()
    
    return affected > 0


def get_all_role_permission_relations(limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
    """
    Получить все связи ролей и разрешений с информацией
    
    Args:
        limit: ограничение количества записей
        offset: смещение
    
    Returns:
        Список связей с детальной информацией
    """
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 
                    rpr.id as relation_id,
                    r.id as role_id,
                    r.name as role_name,
                    p.permission_id,
                    p.permission_name,
                    p.description,
                    rpr.created_at
                FROM role_permissions_relations rpr
                JOIN roles r ON rpr.role_id = r.id
                JOIN permissions p ON rpr.permission_id = p.permission_id
                ORDER BY r.name, p.permission_name
                LIMIT %s OFFSET %s
                """,
                (limit, offset)
            )
            rows = cur.fetchall() or []
    
    return [
        {
            "relation_id": int(row[0]),
            "role_id": int(row[1]),
            "role_name": str(row[2]),
            "permission_id": int(row[3]),
            "permission_name": str(row[4]),
            "description": str(row[5]) if row[5] else None,
            "created_at": row[6].isoformat() if row[6] else None
        }
        for row in rows
    ]


def get_roles_with_permissions(limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    """
    Получить список ролей вместе с их разрешениями
    
    Returns:
        Список ролей с вложенными разрешениями
    """
    roles = get_roles(limit=limit, offset=offset)
    
    for role in roles:
        role['permissions'] = get_role_permissions(role['role_id'])
    
    return roles