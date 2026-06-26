from sqlalchemy import Column, Integer, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from ..database import Base

class Atencion(Base):
    __tablename__ = "atenciones"

    id            = Column(Integer, primary_key=True, index=True)
    paciente_id   = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    medico_id     = Column(Integer, ForeignKey("usuarios.id"),  nullable=False)
    cita_id       = Column(Integer, ForeignKey("citas.id"),     nullable=True)
    diagnostico   = Column(Text, nullable=False)
    tratamiento   = Column(Text, nullable=False)
    observaciones = Column(Text, nullable=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
