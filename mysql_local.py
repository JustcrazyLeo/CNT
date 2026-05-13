import mysql.connector
from mysql.connector import Error

DB_CONFIG = dict(
    host="localhost",
    user="root",
    password="leovalt",
    database="leovalt",
    charset="utf8",
    autocommit=True,
)

def create_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("✅ Успешное подключение к базе данных 'palyan'")
            return connection
    except Error as e:
        print(f"❌ Ошибка подключения к базе данных: {e}")
        return None

def get_admins():
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM admins")
            admins = cursor.fetchall()
            cursor.close()
            connection.close()
            return admins
        except Error as e:
            print(f"❌ Ошибка: {e}")
            return []
    return []

def get_admin_by_id(admin_id):
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM admins WHERE admin_id = %s", (admin_id,))
            admin = cursor.fetchone()
            cursor.close()
            connection.close()
            return admin
        except Error as e:
            print(f"❌ Ошибка: {e}")
            return None
    return None

def create_admin(admin_data):
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = """
            INSERT INTO admins (admin_login, admin_password_hash, is_active_admin, admin_birth_date)
            VALUES (%s, %s, %s, %s)
            """
            cursor.execute(query, (
                admin_data.get('admin_login'),
                admin_data.get('admin_password_hash'),
                admin_data.get('is_active_admin', True),
                admin_data.get('admin_birth_date')
            ))
            connection.commit()
            new_id = cursor.lastrowid
            cursor.close()
            connection.close()
            return new_id
        except Error as e:
            print(f"❌ Ошибка: {e}")
            return None
    return None

if __name__ == "__main__":
    connection = create_connection()
    if connection and connection.is_connected():
        print("📊 Структура таблицы admins:")
        cursor = connection.cursor()
        cursor.execute("DESCRIBE admins")
        columns = cursor.fetchall()
        for column in columns:
            print(f"  - {column[0]}: {column[1]}")
        cursor.close()
        connection.close()
