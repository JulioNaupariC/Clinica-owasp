from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth.models import RolUsuario
from ..auth.security import requerir_rol
from ..auditoria.service import registrar_log
from .models import Paciente
from .schemas import PacienteCreate, PacienteResponse

router = APIRouter(prefix="/api/pacientes", tags=["Pacientes"])

todos  = requerir_rol(RolUsuario.admin, RolUsuario.medico, RolUsuario.recepcionista)
admin  = requerir_rol(RolUsuario.admin)

@router.get("/", response_model=list[PacienteResponse])
def listar(db: Session = Depends(get_db), usuario=Depends(todos)):
    return db.query(Paciente).order_by(Paciente.apellidos).all()

@router.get("/{id}", response_model=PacienteResponse)
def obtener(id: int, db: Session = Depends(get_db), usuario=Depends(todos)):
    p = db.query(Paciente).filter(Paciente.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return p

@router.post("/", response_model=PacienteResponse, status_code=201)
def crear(datos: PacienteCreate, request: Request,
          db: Session = Depends(get_db), usuario=Depends(todos)):
    if db.query(Paciente).filter(Paciente.dni == datos.dni).first():
        raise HTTPException(status_code=400, detail="Ya existe un paciente con ese DNI")
    p = Paciente(**datos.model_dump())
    db.add(p); db.commit(); db.refresh(p)
    registrar_log(db, usuario.id, "CREAR_PACIENTE", "pacientes", p.id, str(request.client.host))
    return p

@router.put("/{id}", response_model=PacienteResponse)
def actualizar(id: int, datos: PacienteCreate, request: Request,
               db: Session = Depends(get_db), usuario=Depends(todos)):
    p = db.query(Paciente).filter(Paciente.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    for k, v in datos.model_dump().items():
        setattr(p, k, v)
    db.commit(); db.refresh(p)
    registrar_log(db, usuario.id, "EDITAR_PACIENTE", "pacientes", p.id, str(request.client.host))
    return p

@router.delete("/{id}", status_code=204)
def eliminar(id: int, request: Request,
             db: Session = Depends(get_db), usuario=Depends(admin)):
    p = db.query(Paciente).filter(Paciente.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    db.delete(p); db.commit()
    registrar_log(db, usuario.id, "ELIMINAR_PACIENTE", "pacientes", id, str(request.client.host))
