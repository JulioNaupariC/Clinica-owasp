from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
import enum
from ..database import Base

class RolUsuario(str, enum.Enum):
    admin          = "admin"
    medico         = "medico"
    recepcionista  = "recepcionista"

class Usuario(Base):
    __tablename__ = "usuarios"

    id               = Column(Integer, primary_key=True, index=True)
    nombre           = Column(String(100), nullable=False)
    email            = Column(String(150), unique=True, index=True, nullable=False)
    password_hash    = Column(String(255), nullable=False)
    rol              = Column(Enum(RolUsuario), default=RolUsuario.recepcionista)
    activo           = Column(Boolean, default=True)

    # OWASP A07 — bloqueo por intentos fallidos
    intentos_fallidos = Column(Integer, default=0)
    bloqueado_hasta   = Column(DateTime, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
