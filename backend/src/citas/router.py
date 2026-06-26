from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth.models import RolUsuario
from ..auth.security import requerir_rol
from ..auditoria.service import registrar_log
from .models import Cita, EstadoCita
from .schemas import CitaCreate, CitaResponse

router = APIRouter(prefix="/api/citas", tags=["Citas"])

todos = requerir_rol(RolUsuario.admin, RolUsuario.medico, RolUsuario.recepcionista)

@router.get("/", response_model=list[CitaResponse])
def listar(db: Session = Depends(get_db), usuario=Depends(todos)):
    return db.query(Cita).order_by(Cita.fecha_hora.desc()).all()

@router.post("/", response_model=CitaResponse, status_code=201)
def crear(datos: CitaCreate, request: Request,
          db: Session = Depends(get_db), usuario=Depends(todos)):
    cita = Cita(**datos.model_dump())
    db.add(cita); db.commit(); db.refresh(cita)
    registrar_log(db, usuario.id, "CREAR_CITA", "citas", cita.id, str(request.client.host))
    return cita

@router.put("/{id}/estado")
def cambiar_estado(id: int, estado: EstadoCita, request: Request,
                   db: Session = Depends(get_db), usuario=Depends(todos)):
    cita = db.query(Cita).filter(Cita.id == id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    cita.estado = estado
    db.commit()
    registrar_log(db, usuario.id, f"CAMBIAR_ESTADO_CITA_{estado.upper()}", "citas", id, str(request.client.host))
    return {"mensaje": f"Estado actualizado a {estado}"}

@router.delete("/{id}", status_code=204)
def eliminar(id: int, request: Request,
             db: Session = Depends(get_db),
             usuario=Depends(requerir_rol(RolUsuario.admin))):
    cita = db.query(Cita).filter(Cita.id == id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    db.delete(cita); db.commit()
    registrar_log(db, usuario.id, "ELIMINAR_CITA", "citas", id, str(request.client.host))
