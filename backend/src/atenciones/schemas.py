from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AtencionCreate(BaseModel):
    paciente_id:   int
    medico_id:     int
    cita_id:       Optional[int] = None
    diagnostico:   str
    tratamiento:   str
    observaciones: Optional[str] = None

class AtencionResponse(BaseModel):
    id:            int
    paciente_id:   int
    medico_id:     int
    cita_id:       Optional[int]
    diagnostico:   str
    tratamiento:   str
    observaciones: Optional[str]
    created_at:    datetime

    class Config:
        from_attributes = True
