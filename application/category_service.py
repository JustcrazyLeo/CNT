"""
CRUD сервис для работы с категориями
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from infrastructure.db.mysql import mysql_conn


def create_category(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Создание новой категории
    
    Args:
        data: dict с ключами name, description (опционально), is_active (опционально)
    
    Returns:
        dict с созданной категорией
    
    Raises:
        ValueError: если name пустой или уже существует
    """
    name = str(data.get("name", "")).strip()
    description = data.get("description", "").strip() or None
    is_active = bool(data.get("is_active", True))
    
    # Валидация
    if not name:
        raise ValueError("Название категории не может быть пустым")
    
    if len(name) > 100:
        raise ValueError("Название категории не может быть длиннее 100 символов")
    
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            # Проверяем уникальность названия
            cur.execute(
                "SELECT 1 FROM categories WHERE name = %s LIMIT 1",
                (name,)
            )
            if cur.fetchone():
                raise ValueError(f"Категория с названием '{name}' уже существует")
            
            # Создаем категорию
            cur.execute(
                """
                INSERT INTO categories (name, description, is_active)
                VALUES (%s, %s, %s)
                """,
                (name, description, is_active)
            )
            conn.commit()
            new_id = cur.lastrowid
    
    # Возвращаем созданную категорию
    return get_category_by_id(new_id)


def get_category_by_id(category_id: int) -> Optional[Dict[str, Any]]:
    """
    Получение категории по ID
    
    Args:
        category_id: ID категории
    
    Returns:
        dict с данными категории или None, если не найдена
    """
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, name, description, is_active, created_at, updated_at
                FROM categories
                WHERE id = %s
                LIMIT 1
                """,
                (int(category_id),)
            )
            row = cur.fetchone()
            
            if not row:
                return None
            
            return _row_to_dict(row)


def list_categories(
    include_inactive: bool = False,
    limit: int = 50,
    offset: int = 0,
    search: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Получение списка категорий с пагинацией и поиском
    
    Args:
        include_inactive: включать ли неактивные категории
        limit: количество записей на странице
        offset: смещение для пагинации
        search: поиск по названию (опционально)
    
    Returns:
        list[dict]: список категорий
    """
    where_conditions = []
    params = []
    
    # Фильтр по активности
    if not include_inactive:
        where_conditions.append("is_active = TRUE")
    
    # Фильтр по поиску
    if search:
        where_conditions.append("name LIKE %s")
        params.append(f"%{search}%")
    
    # Формируем WHERE часть
    where_clause = ""
    if where_conditions:
        where_clause = "WHERE " + " AND ".join(where_conditions)
    
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            query = f"""
                SELECT id, name, description, is_active, created_at, updated_at
                FROM categories
                {where_clause}
                ORDER BY name ASC
                LIMIT %s OFFSET %s
            """
            params.extend([int(limit), int(offset)])
            
            cur.execute(query, params)
            rows = cur.fetchall() or []
    
    return [_row_to_dict(row) for row in rows]


def update_category(category_id: int, changes: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Обновление данных категории
    
    Args:
        category_id: ID категории
        changes: dict с полями для обновления (name, description, is_active)
    
    Returns:
        dict с обновленной категорией или None, если не найдена
    
    Raises:
        ValueError: при ошибках валидации
    """
    category_id = int(category_id)
    
    # Проверяем существование категории
    existing = get_category_by_id(category_id)
    if not existing:
        return None
    
    fields = []
    params = []
    
    # Обработка name
    if "name" in changes:
        new_name = str(changes["name"]).strip()
        if not new_name:
            raise ValueError("Название категории не может быть пустым")
        if len(new_name) > 100:
            raise ValueError("Название категории не может быть длиннее 100 символов")
        
        # Проверяем уникальность (исключая текущую категорию)
        with mysql_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT 1 FROM categories WHERE name = %s AND id != %s LIMIT 1",
                    (new_name, category_id)
                )
                if cur.fetchone():
                    raise ValueError(f"Категория с названием '{new_name}' уже существует")
        
        fields.append("name = %s")
        params.append(new_name)
    
    # Обработка description
    if "description" in changes:
        description = changes["description"]
        if description is not None:
            description = str(description).strip()
        fields.append("description = %s")
        params.append(description)
    
    # Обработка is_active
    if "is_active" in changes:
        fields.append("is_active = %s")
        params.append(bool(changes["is_active"]))
    
    if not fields:
        raise ValueError("Нет полей для обновления")
    
    # Добавляем ID в конец параметров
    params.append(category_id)
    
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE categories SET {', '.join(fields)} WHERE id = %s",
                tuple(params)
            )
            conn.commit()
    
    return get_category_by_id(category_id)


def delete_category(category_id: int, hard: bool = False) -> bool:
    """
    Удаление категории
    
    Args:
        category_id: ID категории
        hard: если True - физическое удаление, иначе - мягкое (деактивация)
    
    Returns:
        bool: True если операция успешна, False если категория не найдена
    """
    category_id = int(category_id)
    
    # Проверяем существование
    if not get_category_by_id(category_id):
        return False
    
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            if hard:
                cur.execute("DELETE FROM categories WHERE id = %s", (category_id,))
            else:
                cur.execute(
                    "UPDATE categories SET is_active = FALSE WHERE id = %s",
                    (category_id,)
                )
            conn.commit()
    
    return True


def get_categories_count(include_inactive: bool = False, search: Optional[str] = None) -> int:
    """
    Получение общего количества категорий
    
    Args:
        include_inactive: включать ли неактивные
        search: поиск по названию
    
    Returns:
        int: количество категорий
    """
    where_conditions = []
    params = []
    
    if not include_inactive:
        where_conditions.append("is_active = TRUE")
    
    if search:
        where_conditions.append("name LIKE %s")
        params.append(f"%{search}%")
    
    where_clause = ""
    if where_conditions:
        where_clause = "WHERE " + " AND ".join(where_conditions)
    
    with mysql_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(f"SELECT COUNT(*) FROM categories {where_clause}", params)
            count = cur.fetchone()[0]
    
    return int(count)


def _row_to_dict(row: tuple) -> Dict[str, Any]:
    """
    Преобразование строки из БД в словарь
    """
    id_, name, description, is_active, created_at, updated_at = row
    
    return {
        "id": int(id_),
        "name": str(name),
        "description": str(description) if description else None,
        "is_active": bool(is_active),
        "created_at": created_at.isoformat() if created_at else None,
        "updated_at": updated_at.isoformat() if updated_at else None
    }