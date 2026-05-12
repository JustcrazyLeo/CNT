from pydantic import BaseModel

class AdminAssignRoleIn(BaseModel):
    role_id: int
    admin_id: int