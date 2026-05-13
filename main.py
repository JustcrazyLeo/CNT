import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import pymysql

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "leovalt",
    "database": "leovalt",
    "charset": "utf8",
    "autocommit": True,
}

class AdminCreate(BaseModel):
    admin_login: str
    admin_password_hash: str
    admin_birth_date: str = None
    is_active_admin: bool = True

class AdminUpdate(BaseModel):
    admin_login: str = None
    admin_password_hash: str = None
    admin_birth_date: str = None
    is_active_admin: bool = None

@app.get("/api/admins")
def get_admins():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT * FROM admins")
        admins = cursor.fetchall()
        return {"data": admins}
    finally:
        conn.close()

@app.post("/api/admins")
def create_admin(admin: AdminCreate):
    conn = pymysql.connect(**DB_CONFIG)
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO admins (admin_login, admin_password_hash, admin_birth_date, is_active_admin) VALUES (%s, %s, %s, %s)",
            (admin.admin_login, admin.admin_password_hash, admin.admin_birth_date, admin.is_active_admin)
        )
        conn.commit()
        new_id = cursor.lastrowid
        return {"data": {"admin_id": new_id, "admin_login": admin.admin_login, "admin_password_hash": admin.admin_password_hash, "admin_birth_date": admin.admin_birth_date, "is_active_admin": admin.is_active_admin, "created_at": ""}}
    finally:
        conn.close()

@app.put("/api/admins/{admin_id}")
def update_admin(admin_id: int, admin: AdminUpdate):
    conn = pymysql.connect(**DB_CONFIG)
    try:
        cursor = conn.cursor()
        updates = []
        values = []

        if admin.admin_login is not None:
            updates.append("admin_login = %s")
            values.append(admin.admin_login)
        if admin.admin_password_hash is not None:
            updates.append("admin_password_hash = %s")
            values.append(admin.admin_password_hash)
        if admin.admin_birth_date is not None:
            updates.append("admin_birth_date = %s")
            values.append(admin.admin_birth_date)
        if admin.is_active_admin is not None:
            updates.append("is_active_admin = %s")
            values.append(admin.is_active_admin)

        if updates:
            values.append(admin_id)
            cursor.execute(f"UPDATE admins SET {', '.join(updates)} WHERE admin_id = %s", values)
            conn.commit()
            return {"status": "ok", "message": "Админ обновлён"}
        return {"status": "ok", "message": "Нет данных для обновления"}
    finally:
        conn.close()

@app.get("/")
def root():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
