from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from .models import RolUsuario

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    rol:          str
    nombre:       str

class UsuarioCreate(BaseModel):
    nombre:   str
    email:    EmailStr
    password: str
    rol:      RolUsuario = RolUsuario.recepcionista

    # OWASP A07 — política de contraseña fuerte
    @field_validator("password")
    @classmethod
    def password_fuerte(cls, v):
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        if not any(c.isupper() for c in v):
            raise ValueError("La contraseña debe tener al menos una mayúscula")
        if not any(c.isdigit() for c in v):
            raise ValueError("La contraseña debe tener al menos un número")
        return v

class UsuarioResponse(BaseModel):
    id:     int
    nombre: str
    email:  str
    rol:    RolUsuario
    activo: bool

    class Config:
        from_attributes = True
