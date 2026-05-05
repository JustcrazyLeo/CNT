import click
from fastapi import FastAPI
from interfaces.api import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Primer API")

app.include_router(router, prefix="/api")

origins = [
    "http://localhost:4200",   # Angular dev server
    "http://127.0.0.1:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)