from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func
from ..database import Base

class Paciente(Base):
    __tablename__ = "pacientes"

    id               = Column(Integer, primary_key=True, index=True)
    nombres          = Column(String(100), nullable=False)
    apellidos        = Column(String(100), nullable=False)
    dni              = Column(String(8), unique=True, index=True, nullable=False)
    fecha_nacimiento = Column(Date, nullable=True)
    telefono         = Column(String(15), nullable=True)
    direccion        = Column(String(255), nullable=True)
    email            = Column(String(150), nullable=True)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())
    updated_at       = Column(DateTime(timezone=True), onupdate=func.now())
