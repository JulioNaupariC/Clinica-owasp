from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date

class PacienteCreate(BaseModel):
    nombres:          str
    apellidos:        str
    dni:              str
    fecha_nacimiento: Optional[date] = None
    telefono:         Optional[str]  = None
    direccion:        Optional[str]  = None
    email:            Optional[str]  = None

    @field_validator("dni")
    @classmethod
    def dni_valido(cls, v):
        if not v.isdigit() or len(v) != 8:
            raise ValueError("El DNI debe tener exactamente 8 dígitos numéricos")
        return v

class PacienteResponse(BaseModel):
    id:               int
    nombres:          str
    apellidos:        str
    dni:              str
    fecha_nacimiento: Optional[date]
    telefono:         Optional[str]
    direccion:        Optional[str]
    email:            Optional[str]

    class Config:
        from_attributes = True
