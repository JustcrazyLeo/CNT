from pydantic import BaseModel


class AdminSignInIn(BaseModel):
    admin_login: str
    admin_password: str