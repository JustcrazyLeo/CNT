from infrastructure.db.mysql import mysql_conn

def get_roles(limit: int = 50, offset: int = 0):
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""
                SELECT id, name
                FROM roles
                ORDER BY id
                LIMIT {limit} OFFSET {offset}
                """,
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