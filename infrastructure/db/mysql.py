from contextlib import contextmanager
from typing import Iterator

import pymysql
from pymysql.connections import Connection

try:
    from .mysql_local import DB_CONFIG  # файл локальный и в .gitignore
except ImportError as e:
    raise RuntimeError(
        "Нет локального конфига БД. Создай файл "
        "src/app/infrastructure/db/mysql_local.py (он в .gitignore)."
    ) from e


@contextmanager
def mysql_conn() -> Iterator[Connection]:
    conn = pymysql.connect(**DB_CONFIG)
    try:
        yield conn
    finally:
        conn.close()