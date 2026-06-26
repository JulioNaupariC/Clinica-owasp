from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..database import Base

class AuditoriaLog(Base):
    """
    OWASP A09:2021 — Fallos de Registro y Monitoreo de Seguridad
    Registra automáticamente cada acción crítica del sistema:
    logins, creación, edición y eliminación de registros.
    """
    __tablename__ = "auditoria_logs"

    id              = Column(Integer, primary_key=True, index=True)
    usuario_id      = Column(Integer, nullable=True)      # null si login fallido
    accion          = Column(String(100), nullable=False)  # LOGIN_EXITOSO, CREAR_PACIENTE...
    tabla_afectada  = Column(String(100), nullable=True)   # usuarios, pacientes, citas...
    registro_id     = Column(Integer, nullable=True)       # ID del registro afectado
    ip_address      = Column(String(50), nullable=True)    # IP del cliente
    detalle         = Column(String(500), nullable=True)   # info adicional
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
