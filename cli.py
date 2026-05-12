import click
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# БД
DB_CONFIG = dict(
    host="localhost",  # localhost
    user="root",  # логин от базы
    password="azaz1234@",  # пароль от базы
    database="palan",  # имя базы
    charset="utf8",
    autocommit=True,
)
Session = sessionmaker(bind=DB_CONFIG)
Base = declarative_base()

# Модели
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    password = Column(String(100))
    role = Column(String(50), default="user")

class Permission(Base):
    __tablename__ = "permissions"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True)
    code = Column(String(50), unique=True)

class UserPermission(Base):
    __tablename__ = "user_permissions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    permission_id = Column(Integer, ForeignKey("permissions.id"))

class RolePermission(Base):
    __tablename__ = "role_permissions"
    id = Column(Integer, primary_key=True)
    role = Column(String(50), nullable=False)
    permission_id = Column(Integer, ForeignKey("permissions.id"), nullable=False)
    __table_args__ = (UniqueConstraint("role", "permission_id", name="uq_role_permission"),)
    permission = relationship("Permission")

def get_db(): return Session()
def get_user(u): return get_db().query(User).filter(User.username == u).first()
def get_perm(code): return get_db().query(Permission).filter(Permission.code == code).first()

def create_user(u, p, r="user"):
    db = get_db()
    user = User(username=u, password=p, role=r)
    db.add(user); db.commit()
    return user

def has_perm(user, code):
    if not user: return False
    if user.role == "admin": return True
    perm = get_perm(code)
    if not perm: return False
    db = get_db()
    return (db.query(UserPermission).filter_by(user_id=user.id, permission_id=perm.id).first() or
            db.query(RolePermission).filter_by(role=user.role, permission_id=perm.id).first())

# Сервис управления связями роль-разрешение
class RolePermService:
    @staticmethod
    def assign(role, perm_code):
        db = get_db()
        perm = get_perm(perm_code)
        if not perm: raise ValueError(f"Разрешение '{perm_code}' не найдено")
        if db.query(RolePermission).filter_by(role=role, permission_id=perm.id).first():
            return False
        db.add(RolePermission(role=role, permission_id=perm.id))
        db.commit(); return True

    @staticmethod
    def remove(role, perm_code):
        db = get_db()
        perm = get_perm(perm_code)
        if not perm: raise ValueError(f"Разрешение '{perm_code}' не найдено")
        rp = db.query(RolePermission).filter_by(role=role, permission_id=perm.id).first()
        if not rp: return False
        db.delete(rp); db.commit()
        return True

    @staticmethod
    def get_role_perms(role):
        db = get_db()
        return [e.permission for e in db.query(RolePermission).filter_by(role=role).all()]

    @staticmethod
    def check(role, perm_code):
        perm = get_perm(perm_code)
        return bool(perm and get_db().query(RolePermission).filter_by(role=role, permission_id=perm.id).first())

def init_db():
    Base.metadata.create_all(engine)
    if not get_user("admin"):
        create_user("admin", "admin123", "admin")
        create_user("user", "user123")
        db = get_db()
        for name, code in [("Доступ к системе","menu_access"),("Доступ к админам","admin_access"),
                           ("Доступ к ролям","role_access"),("Доступ к разрешениям","perm_access")]:
            if not get_perm(code): db.add(Permission(name=name, code=code))
        db.commit(); db.close()

current_user = None

def auth():
    global current_user
    if current_user: return True
    click.secho("\n=== АВТОРИЗАЦИЯ ===", fg="cyan")
    u, p = click.prompt("Логин"), click.prompt("Пароль", hide_input=True)
    user = get_user(u)
    if user and user.password == p:
        current_user = user
        click.secho(f"✓ Добро пожаловать, {u}!", fg="green"); return True
    click.secho("✗ Неверно", fg="red"); return False

def check_perm(code):
    if not has_perm(current_user, code):
        click.secho("⛔ Нет доступа", fg="red"); return False
    return True

@click.group()
def cli(): pass

@cli.command()
def main_menu():
    if not auth() or not has_perm(current_user, "menu_access"):
        click.secho("⛔ Нет доступа", fg="red"); return
    while True:
        click.echo("\n1.Админы\n2.Роли\n3.Разрешения\n4.Связи роль-разрешение\n5.Выход")
        c = click.prompt(">", type=int)
        if c == 1:
            if check_perm("admin_access"): click.secho("\n=== АДМИНЫ ===", fg="cyan"); click.echo("Заглушка")
        elif c == 2:
            if check_perm("role_access"): click.secho("\n=== РОЛИ ===", fg="cyan"); click.echo("Заглушка")
        elif c == 3:
            if check_perm("perm_access"):
                click.secho("\n=== РАЗРЕШЕНИЯ ===", fg="cyan")
                for p in get_db().query(Permission).all():
                    click.echo(f"{p.id}. {p.name} ({p.code})")
        elif c == 4: role_perm_menu()
        elif c == 5: break

def role_perm_menu():
    if not check_perm("perm_access"): return
    while True:
        click.echo("\n=== Связи роль-разрешение ===")
        click.echo("1.Показать\n2.Назначить\n3.Удалить\n4.Проверить\n5.Выход")
        c = click.prompt(">", type=int)
        if c == 5: break
        if c not in (1,4):
            role, code = click.prompt("Роль"), click.prompt("Код разрешения")
        else:
            role = click.prompt("Роль")
            if c == 1:
                perms = RolePermService.get_role_perms(role)
                click.echo("\n".join(f"  - {p.name} ({p.code})" for p in perms) if perms else "Нет разрешений")
                continue
            code = click.prompt("Код разрешения")
        try:
            if c == 2:
                ok = RolePermService.assign(role, code)
                click.secho("✓ Назначено" if ok else "Уже существует", fg="green" if ok else "yellow")
            elif c == 3:
                ok = RolePermService.remove(role, code)
                click.secho("✓ Удалено" if ok else "Не найдено", fg="green" if ok else "yellow")
            elif c == 4:
                click.secho("✓ Есть" if RolePermService.check(role, code) else "✗ Нет", fg="green")
        except ValueError as e:
            click.secho(f"✗ Ошибка: {e}", fg="red")

@cli.command()
@click.argument("action")
@click.argument("role")
@click.argument("perm_code", required=False)
def role_perms(action, role, perm_code):
    """Управление разрешениями ролей: list, assign, remove, check"""
    if not auth(): return
    if action == "list":
        perms = RolePermService.get_role_perms(role)
        click.echo("\n".join(f"  {p.name} ({p.code})" for p in perms) if perms else "Нет разрешений")
    elif action in ("assign","remove","check"):
        if not perm_code: click.echo("Укажите код разрешения"); return
        try:
            if action == "assign":
                ok = RolePermService.assign(role, perm_code)
                click.secho("✓ Назначено" if ok else "Уже существует", fg="green" if ok else "yellow")
            elif action == "remove":
                ok = RolePermService.remove(role, perm_code)
                click.secho("✓ Удалено" if ok else "Не найдено", fg="green" if ok else "yellow")
            elif action == "check":
                click.secho("✓ Есть" if RolePermService.check(role, perm_code) else "✗ Нет", fg="green")
        except ValueError as e:
            click.secho(f"✗ Ошибка: {e}", fg="red")
    else:
        click.echo("Используйте: list, assign, remove, check")

if __name__ == '__main__':
    init_db()
    cli()