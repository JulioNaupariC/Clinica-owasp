from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .models import EstadoCita

class CitaCreate(BaseModel):
    paciente_id:   int
    medico_id:     int
    fecha_hora:    datetime
    motivo:        str
    observaciones: Optional[str] = None

class CitaResponse(BaseModel):
    id:            int
    paciente_id:   int
    medico_id:     int
    fecha_hora:    datetime
    motivo:        str
    estado:        EstadoCita
    observaciones: Optional[str]

    class Config:
        from_attributes = True
