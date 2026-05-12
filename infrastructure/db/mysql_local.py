import mysql.connector
from mysql.connector import Error
1
DB_CONFIG = dict(
    host="localhost",  # localhost
    user="root",  # логин от базы
    password="leovalt1205",  # пароль от базы
    database="lionel",  # имя базы
    charset="utf8",
    autocommit=True,
)

def create_connection():
    """Создание подключения к базе данных"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("✅ Успешное подключение к базе данных 'palyan'")
            return connection
    except Error as e:
        print(f"❌ Ошибка подключения к базе данных: {e}")
        return None

def get_admins():
    """Получение всех администраторов"""
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
            print(f"❌ Ошибка при получении администраторов: {e}")
            return []
    return []

def get_admin_by_id(admin_id):
    """Получение администратора по ID"""
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM admins WHERE id = %s", (admin_id,))
            admin = cursor.fetchone()
            cursor.close()
            connection.close()
            return admin
        except Error as e:
            print(f"❌ Ошибка при получении администратора: {e}")
            return None
    return None

def create_admin(admin_data):
    """Создание нового администратора"""
    connection = create_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = """
            INSERT INTO admins (username, email, password, full_name, is_active)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (
                admin_data.get('username'),
                admin_data.get('email'),
                admin_data.get('password'),
                admin_data.get('full_name'),
                admin_data.get('is_active', True)
            ))
            connection.commit()
            new_id = cursor.lastrowid
            cursor.close()
            connection.close()
            return new_id
        except Error as e:
            print(f"❌ Ошибка при создании администратора: {e}")
            return None
    return None

# Проверка подключения при запуске
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
