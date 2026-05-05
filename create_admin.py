import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from argon2 import PasswordHasher
from infrastructure.db.mysql import mysql_conn

PH = PasswordHasher()

password = "admin123"
password_hash = PH.hash(password)

try:
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            # Проверяем, существует ли админ
            cur.execute("SELECT 1 FROM admins WHERE admin_login = %s", ("admin",))
            if cur.fetchone():
                print("⚠️ Администратор 'admin' уже существует")
                cur.execute("SELECT admin_id FROM admins WHERE admin_login = %s", ("admin",))
                admin_id = cur.fetchone()[0]
            else:
                cur.execute(
                    """
                    INSERT INTO admins (admin_login, admin_password_hash, is_active_admin, admin_birth_date)
                    VALUES (%s, %s, %s, %s)
                    """,
                    ("admin", password_hash, 1, "1990-01-01")
                )
                conn.commit()
                admin_id = cur.lastrowid
            
            # Назначаем все разрешения админу
            cur.execute("SELECT permission_id FROM permissions")
            permission_ids = [row[0] for row in cur.fetchall()]
            
            for perm_id in permission_ids:
                try:
                    cur.execute(
                        """
                        INSERT IGNORE INTO admin_permissions_relations (admin_id, permission_id)
                        VALUES (%s, %s)
                        """,
                        (admin_id, perm_id)
                    )
                except Exception:
                    pass
            
            conn.commit()
            
            print(f"✅ Тестовый администратор готов!")
            print(f"   ID: {admin_id}")
            print(f"   Логин: admin")
            print(f"   Пароль: admin123")
            print(f"   Назначено разрешений: {len(permission_ids)}")
            
except Exception as e:
    print(f"❌ Ошибка: {e}")