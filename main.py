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
    "password": "Azaz1234@",
    "database": "palyan",
    "charset": "utf8",
    "autocommit": True,
}

class AdminCreate(BaseModel):
    admin_login: str
    admin_password_hash: str
    admin_birth_date: str = None
    is_active_admin: bool = True

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
        return {"data": {
            "admin_id": new_id,
            "admin_login": admin.admin_login,
            "admin_password_hash": admin.admin_password_hash,
            "admin_birth_date": admin.admin_birth_date,
            "is_active_admin": admin.is_active_admin,
            "created_at": ""
        }}
    finally:
        conn.close()

@app.get("/")
def root():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)