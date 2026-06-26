from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Text
from sqlalchemy.sql import func
import enum
from ..database import Base

class EstadoCita(str, enum.Enum):
    pendiente  = "pendiente"
    confirmada = "confirmada"
    atendida   = "atendida"
    cancelada  = "cancelada"

class Cita(Base):
    __tablename__ = "citas"

    id          = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    medico_id   = Column(Integer, ForeignKey("usuarios.id"),  nullable=False)
    fecha_hora  = Column(DateTime, nullable=False)
    motivo      = Column(String(255), nullable=False)
    estado      = Column(Enum(EstadoCita), default=EstadoCita.pendiente)
    observaciones = Column(Text, nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
