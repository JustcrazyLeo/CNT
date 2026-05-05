import click
from application.admin_crud_service import get_admin_by_id, create_admin, update_admin, delete_admin
from application.roles.admin_role_service import (
    get_roles, 
    assign_role_to_admin,
    # Новые функции
    get_role_permissions,
    assign_permission_to_role,
    remove_permission_from_role,
    get_all_role_permission_relations,
    get_roles_with_permissions
)
from application.category_service import (
    create_category,
    get_category_by_id,
    list_categories,
    update_category,
    delete_category
)
from application.permissions.permission_service import (
    get_all_permissions,
    get_admin_permissions,
    assign_permission_to_admin,
    check_admin_permission
)
from application.auth.admin_auth_service import admin_sign_in

# Глобальная переменная для хранения текущего авторизованного админа
_current_admin = None

def require_login():
    """Декоратор для проверки авторизации"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            global _current_admin
            if _current_admin is None:
                click.echo("❌ Необходимо авторизоваться!")
                click.echo("Используйте пункт '0. Войти в систему' в главном меню")
                return
            return func(*args, **kwargs)
        return wrapper
    return decorator

def require_permission(permission_name: str):
    """Декоратор для проверки разрешений"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            global _current_admin
            if not check_admin_permission(_current_admin['admin_id'], permission_name):
                click.echo(f"❌ У вас нет разрешения '{permission_name}'!")
                return
            return func(*args, **kwargs)
        return wrapper
    return decorator

def login_cmd():
    """Авторизация администратора в CLI"""
    global _current_admin
    click.echo("=== Вход в систему ===")
    login = click.prompt('Логин', type=str)
    password = click.prompt('Пароль', type=str, hide_input=True)
    
    result = admin_sign_in(login, password)
    if result:
        admin, session_id = result
        _current_admin = admin
        click.echo(f"✅ Добро пожаловать, {admin['admin_login']}!")
        
        # Показываем разрешения пользователя
        permissions = get_admin_permissions(admin['admin_id'])
        if permissions:
            click.echo("\nВаши разрешения:")
            for perm in permissions:
                click.echo(f"  - {perm['permission_name']}: {perm.get('description', '')}")
        else:
            click.echo("\n⚠️ У вас нет назначенных разрешений")
    else:
        click.echo("❌ Неверный логин или пароль")

def logout_cmd():
    """Выход из системы"""
    global _current_admin
    if _current_admin:
        click.echo(f"👋 До свидания, {_current_admin['admin_login']}!")
        _current_admin = None
    else:
        click.echo("Вы не авторизованы")

# ============ Функции для работы с админами ============

@require_login()
@require_permission('admins.read')
def get_admin_from_id():
    admin_id = click.prompt('Введите ID администратора', type=int)
    admin = get_admin_by_id(admin_id)
    if admin:
        click.echo(f"Найден администратор: {admin}")
    else:
        click.echo(f"Администратор с ID {admin_id} не найден")

@require_login()
@require_permission('admins.create')
def create_admin_cmd():
    click.echo("=== Создание администратора ===")
    admin_login = click.prompt('Логин', type=str)
    admin_password = click.prompt('Пароль', type=str, hide_input=True)
    is_active = click.confirm('Админ активен?', default=True)
    
    try:
        admin = create_admin({
            "admin_login": admin_login,
            "admin_password": admin_password,
            "is_active_admin": is_active
        })
        click.echo(f"✅ Администратор создан: ID={admin['admin_id']}")
    except ValueError as e:
        click.echo(f"❌ Ошибка: {e}")

@require_login()
@require_permission('admins.update')
def update_admin_cmd():
    admin_id = click.prompt('Введите ID администратора', type=int)
    existing = get_admin_by_id(admin_id)
    if not existing:
        click.echo("❌ Администратор не найден")
        return
    
    changes = {}
    if click.confirm('Изменить логин?'):
        changes['admin_login'] = click.prompt('Новый логин')
    if click.confirm('Изменить статус активности?'):
        changes['is_active_admin'] = click.confirm('Активен?')
    
    if not changes:
        click.echo("Нет изменений")
        return
    
    try:
        updated = update_admin(admin_id, changes)
        click.echo(f"✅ Администратор обновлен: {updated}")
    except ValueError as e:
        click.echo(f"❌ Ошибка: {e}")

@require_login()
@require_permission('admins.delete')
def delete_admin_cmd():
    admin_id = click.prompt('Введите ID администратора', type=int)
    hard = click.confirm('Полное удаление?', default=False)
    
    if delete_admin(admin_id, hard=hard):
        click.echo("✅ Администратор удален")
    else:
        click.echo("❌ Администратор не найден")

def menu_admin():
    actions = {
        1: {"func": get_admin_from_id, "name": "Получение админа по id"},
        2: {"func": create_admin_cmd, "name": "Создание админа"},
        3: {"func": update_admin_cmd, "name": "Обновление данных админа"},
        4: {"func": delete_admin_cmd, "name": "Удаление админа"}
    }
    
    menu_text = "Выберите пункт меню:\n"
    for key in sorted(actions.keys()):
        menu_text += f"   {key}. {actions[key]['name']}\n"
    
    number = click.prompt(menu_text, type=int)
    
    action = actions.get(number)
    if action:
        action["func"]()
    else:
        click.echo("Неверный пункт меню")

# ============ НОВЫЕ ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ СВЯЗЯМИ РОЛЕЙ И РАЗРЕШЕНИЙ ============

@require_login()
@require_permission('roles.read')
def view_role_permissions_cmd():
    """Просмотр разрешений конкретной роли"""
    # Сначала покажем список ролей
    roles = get_roles()
    if not roles:
        click.echo("Нет доступных ролей")
        return
    
    click.echo("\nДоступные роли:")
    for role in roles:
        click.echo(f"  ID: {role['role_id']}, Название: {role['role_name']}")
    
    role_id = click.prompt('\nВведите ID роли для просмотра её разрешений', type=int)
    
    permissions = get_role_permissions(role_id)
    if not permissions:
        click.echo(f"У роли с ID {role_id} нет назначенных разрешений")
    else:
        click.echo(f"\nРазрешения роли:")
        for perm in permissions:
            desc = f" - {perm['description']}" if perm.get('description') else ""
            click.echo(f"  ID: {perm['permission_id']}, {perm['permission_name']}{desc}")

@require_login()
@require_permission('roles.assign')
def assign_permission_to_role_cmd():
    """Назначить разрешение роли"""
    # Показываем роли
    roles = get_roles()
    if not roles:
        click.echo("Нет доступных ролей")
        return
    
    click.echo("\nДоступные роли:")
    for role in roles:
        click.echo(f"  ID: {role['role_id']}, Название: {role['role_name']}")
    
    role_id = click.prompt('\nВведите ID роли', type=int)
    
    # Показываем доступные разрешения
    permissions = get_all_permissions()
    if not permissions:
        click.echo("Нет доступных разрешений")
        return
    
    click.echo("\nДоступные разрешения:")
    for perm in permissions:
        desc = f" - {perm.get('description', '')}"
        click.echo(f"  ID: {perm['permission_id']}, {perm['permission_name']}{desc}")
    
    permission_id = click.prompt('\nВведите ID разрешения для назначения', type=int)
    
    try:
        assign_permission_to_role(role_id, permission_id)
        click.echo(f"✅ Разрешение {permission_id} успешно назначено роли {role_id}")
    except ValueError as e:
        click.echo(f"❌ Ошибка: {e}")

@require_login()
@require_permission('roles.assign')
def remove_permission_from_role_cmd():
    """Удалить разрешение у роли"""
    # Показываем роли
    roles = get_roles()
    if not roles:
        click.echo("Нет доступных ролей")
        return
    
    click.echo("\nДоступные роли:")
    for role in roles:
        click.echo(f"  ID: {role['role_id']}, Название: {role['role_name']}")
    
    role_id = click.prompt('\nВведите ID роли', type=int)
    
    # Показываем текущие разрешения роли
    current_permissions = get_role_permissions(role_id)
    if not current_permissions:
        click.echo(f"У роли с ID {role_id} нет назначенных разрешений")
        return
    
    click.echo(f"\nТекущие разрешения роли:")
    for perm in current_permissions:
        click.echo(f"  ID: {perm['permission_id']}, {perm['permission_name']}")
    
    permission_id = click.prompt('\nВведите ID разрешения для удаления', type=int)
    
    if click.confirm(f'Удалить разрешение {permission_id} у роли {role_id}?'):
        result = remove_permission_from_role(role_id, permission_id)
        if result:
            click.echo(f"✅ Разрешение успешно удалено у роли")
        else:
            click.echo("❌ Связь не найдена")

@require_login()
@require_permission('roles.read')
def view_all_role_permission_relations_cmd():
    """Просмотр всех связей ролей и разрешений"""
    relations = get_all_role_permission_relations()
    
    if not relations:
        click.echo("Нет связей между ролями и разрешениями")
        return
    
    click.echo(f"\n=== Все связи ролей и разрешений (всего: {len(relations)}) ===\n")
    
    # Группируем по ролям для удобного отображения
    from collections import defaultdict
    grouped = defaultdict(list)
    for rel in relations:
        grouped[rel['role_name']].append(rel)
    
    for role_name, perms in grouped.items():
        click.echo(f"📋 Роль: {role_name}")
        for p in perms:
            click.echo(f"   └─ {p['permission_name']} (ID: {p['permission_id']})")
        click.echo("")

@require_login()
@require_permission('roles.read')
def view_roles_with_permissions_cmd():
    """Просмотр ролей вместе с их разрешениями"""
    roles = get_roles_with_permissions()
    
    if not roles:
        click.echo("Нет ролей в системе")
        return
    
    click.echo(f"\n=== Роли с разрешениями ===\n")
    for role in roles:
        click.echo(f"📋 {role['role_name']} (ID: {role['role_id']})")
        if role.get('permissions'):
            for perm in role['permissions']:
                click.echo(f"   ├─ {perm['permission_name']}")
            click.echo("")
        else:
            click.echo("   └─ Нет разрешений\n")

# ============ Функции для работы с ролями (существующие) ============

@require_login()
@require_permission('roles.read')
def list_roles_cmd():
    roles_list = get_roles()
    if not roles_list:
        click.echo("В базе данных нет ролей.")
    else:
        click.echo("Список доступных ролей:")
        for role in roles_list:
            click.echo(f"  ID: {role['role_id']}, Название: {role['role_name']}")

@require_login()
@require_permission('roles.assign')
def assign_role_to_admin_cmd():
    admin_id = click.prompt('Введите ID администратора', type=int)
    if not get_admin_by_id(admin_id):
        click.echo(f"Ошибка: Администратор с ID {admin_id} не найден.")
        return
            
    role_id = click.prompt('Введите ID роли для назначения', type=int)
    try:
        assign_role_to_admin(admin_id, role_id)
        click.echo(f"Роль с ID {role_id} успешно назначена администратору с ID {admin_id}.")
    except ValueError as e:
        click.echo(f"Ошибка при назначении роли: {e}")

def menu_roles():
    """Меню управления ролями и их разрешениями"""
    actions = {
        1: {"func": list_roles_cmd, "name": "Показать все роли"},
        2: {"func": assign_role_to_admin_cmd, "name": "Назначить роль администратору"},
        3: {"func": view_role_permissions_cmd, "name": "Просмотр разрешений роли"},
        4: {"func": assign_permission_to_role_cmd, "name": "Назначить разрешение роли"},
        5: {"func": remove_permission_from_role_cmd, "name": "Удалить разрешение у роли"},
        6: {"func": view_all_role_permission_relations_cmd, "name": "Все связи ролей и разрешений"},
        7: {"func": view_roles_with_permissions_cmd, "name": "Роли с разрешениями (сводка)"}
    }
    
    menu_text = "Выберите пункт меню:\n"
    for key in sorted(actions.keys()):
        menu_text += f"   {key}. {actions[key]['name']}\n"
    
    number = click.prompt(menu_text, type=int)
    
    action = actions.get(number)
    if action:
        action["func"]()
    else:
        click.echo("Неверный пункт меню")

# ============ Функции для работы с permissions ============

@require_login()
@require_permission('permissions.read')
def list_permissions_cmd():
    permissions = get_all_permissions()
    if not permissions:
        click.echo("Нет разрешений в системе")
    else:
        click.echo("Список всех разрешений:")
        for perm in permissions:
            desc = f" - {perm.get('description', '')}"
            click.echo(f"  ID: {perm['permission_id']}, Название: {perm['permission_name']}{desc}")

@require_login()
@require_permission('permissions.read')
def list_admin_permissions_cmd():
    admin_id = click.prompt('Введите ID администратора', type=int)
    permissions = get_admin_permissions(admin_id)
    if not permissions:
        click.echo(f"У администратора {admin_id} нет разрешений")
    else:
        click.echo(f"Разрешения администратора {admin_id}:")
        for perm in permissions:
            click.echo(f"  - {perm['permission_name']}")

@require_login()
@require_permission('permissions.assign')
def assign_permission_to_admin_cmd():
    admin_id = click.prompt('Введите ID администратора', type=int)
    if not get_admin_by_id(admin_id):
        click.echo(f"❌ Администратор с ID {admin_id} не найден")
        return
    
    permissions = get_all_permissions()
    click.echo("\nДоступные разрешения:")
    for p in permissions:
        click.echo(f"  {p['permission_id']}: {p['permission_name']}")
    
    permission_id = click.prompt('\nВведите ID разрешения', type=int)
    try:
        assign_permission_to_admin(admin_id, permission_id)
        click.echo("✅ Разрешение успешно назначено")
    except ValueError as e:
        click.echo(f"❌ Ошибка: {e}")

def menu_permissions():
    actions = {
        1: {"func": list_permissions_cmd, "name": "Показать все разрешения"},
        2: {"func": list_admin_permissions_cmd, "name": "Показать разрешения админа"},
        3: {"func": assign_permission_to_admin_cmd, "name": "Назначить разрешение админу"}
    }
    
    menu_text = "Выберите пункт меню:\n"
    for key in sorted(actions.keys()):
        menu_text += f"   {key}. {actions[key]['name']}\n"
    
    number = click.prompt(menu_text, type=int)
    
    action = actions.get(number)
    if action:
        action["func"]()
    else:
        click.echo("Неверный пункт меню")

# ============ Функции для работы с категориями ============

@require_login()
@require_permission('categories.create')
def create_category_cmd():
    click.echo("=== Создание новой категории ===")
    
    name = click.prompt('Введите название категории', type=str)
    description = click.prompt('Введите описание (или Enter для пропуска)', type=str, default="", show_default=False)
    is_active = click.prompt('Категория активна? (True/False)', type=bool, default=True)
    
    try:
        category = create_category({
            "name": name,
            "description": description if description else None,
            "is_active": is_active
        })
        click.echo(f"✅ Категория успешно создана:")
        click.echo(f"   ID: {category['id']}")
        click.echo(f"   Название: {category['name']}")
    except ValueError as e:
        click.echo(f"❌ Ошибка: {e}")

@require_login()
@require_permission('categories.read')
def get_category_cmd():
    category_id = click.prompt('Введите ID категории', type=int)
    category = get_category_by_id(category_id)
    
    if category:
        click.echo("✅ Категория найдена:")
        _print_category(category)
    else:
        click.echo(f"❌ Категория с ID {category_id} не найдена")

@require_login()
@require_permission('categories.read')
def list_categories_cmd():
    include_inactive = click.confirm('Показать неактивные категории?', default=False)
    search = click.prompt('Поиск по названию (Enter для пропуска)', type=str, default="", show_default=False)
    search = search if search else None
    
    page = click.prompt('Номер страницы', type=int, default=1)
    per_page = click.prompt('Записей на странице (1-100)', type=int, default=10)
    
    if per_page < 1 or per_page > 100:
        per_page = 10
    if page < 1:
        page = 1
    
    offset = (page - 1) * per_page
    
    categories = list_categories(
        include_inactive=include_inactive,
        limit=per_page,
        offset=offset,
        search=search
    )
    
    if not categories:
        click.echo("Нет категорий для отображения.")
        return
    
    click.echo(f"\n=== Список категорий (всего на странице: {len(categories)}) ===\n")
    
    for category in categories:
        status = "✓ Активна" if category['is_active'] else "✗ Неактивна"
        click.echo(f"ID: {category['id']} | {category['name']} | {status}")

@require_login()
@require_permission('categories.update')
def update_category_cmd():
    category_id = click.prompt('Введите ID категории для обновления', type=int)
    
    existing = get_category_by_id(category_id)
    if not existing:
        click.echo(f"❌ Категория с ID {category_id} не найдена")
        return
    
    click.echo("Текущие данные категории:")
    _print_category(existing)
    
    changes = {}
    
    if click.confirm('Изменить название?', default=False):
        new_name = click.prompt('Введите новое название', type=str)
        changes["name"] = new_name
    
    if click.confirm('Изменить описание?', default=False):
        new_description = click.prompt('Введите новое описание (или "None" для удаления)', type=str)
        changes["description"] = None if new_description.lower() == "none" else new_description
    
    if click.confirm('Изменить статус активности?', default=False):
        is_active = click.prompt('Категория активна? (True/False)', type=bool)
        changes["is_active"] = is_active
    
    if not changes:
        click.echo("Нет данных для обновления")
        return
    
    try:
        updated_category = update_category(category_id, changes)
        if updated_category:
            click.echo("✅ Категория успешно обновлена:")
            _print_category(updated_category)
    except ValueError as e:
        click.echo(f"❌ Ошибка: {e}")

@require_login()
@require_permission('categories.delete')
def delete_category_cmd():
    category_id = click.prompt('Введите ID категории для удаления', type=int)
    
    existing = get_category_by_id(category_id)
    if not existing:
        click.echo(f"❌ Категория с ID {category_id} не найдена")
        return
    
    _print_category(existing)
    
    hard_delete = click.confirm('Выполнить полное удаление из БД?', default=False)
    
    if click.confirm(f'Вы уверены?', default=False):
        result = delete_category(category_id, hard=hard_delete)
        if result:
            action = "полностью удалена" if hard_delete else "деактивирована"
            click.echo(f"✅ Категория успешно {action}")

def _print_category(category: dict):
    click.echo(f"   ID: {category['id']}")
    click.echo(f"   Название: {category['name']}")
    click.echo(f"   Описание: {category['description'] or 'Нет'}")
    click.echo(f"   Активна: {'Да' if category['is_active'] else 'Нет'}")

def menu_categories():
    actions = {
        1: {"func": create_category_cmd, "name": "Создание категории"},
        2: {"func": get_category_cmd, "name": "Получение категории по ID"},
        3: {"func": list_categories_cmd, "name": "Просмотр списка категорий"},
        4: {"func": update_category_cmd, "name": "Обновление категории"},
        5: {"func": delete_category_cmd, "name": "Удаление категории"}
    }
    
    menu_text = "Выберите пункт меню:\n"
    for key in sorted(actions.keys()):
        menu_text += f"   {key}. {actions[key]['name']}\n"
    
    number = click.prompt(menu_text, type=int)
    
    action = actions.get(number)
    if action:
        action["func"]()
    else:
        click.echo("Неверный пункт меню")

# ============ Главное меню ============

main_menu = """
0. Войти в систему / Выйти
1. Меню по управлению пользователями
2. Меню по управлению ролями и разрешениями
3. Меню по управлению категориями
4. Меню по управлению разрешениями админов
"""

@click.command()
@click.option(
    "--number", prompt=f"{main_menu}", help="Выберите пункт меню.", type=int
)
def cli(number: int):
    if number == 0:
        global _current_admin
        if _current_admin:
            logout_cmd()
        else:
            login_cmd()
    elif number == 1:
        menu_admin()
    elif number == 2:
        menu_roles()
    elif number == 3:
        menu_categories()
    elif number == 4:
        menu_permissions()
    else:
        click.echo("Неверный пункт меню. Пожалуйста, выберите от 0 до 4.")

if __name__ == "__main__":
    cli()