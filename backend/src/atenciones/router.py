from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth.models import RolUsuario
from ..auth.security import requerir_rol
from ..auditoria.service import registrar_log
from .models import Atencion
from .schemas import AtencionCreate, AtencionResponse

router = APIRouter(prefix="/api/atenciones", tags=["Atenciones"])

solo_medico = requerir_rol(RolUsuario.admin, RolUsuario.medico)

@router.get("/", response_model=list[AtencionResponse])
def listar(db: Session = Depends(get_db), usuario=Depends(solo_medico)):
    return db.query(Atencion).order_by(Atencion.created_at.desc()).all()

@router.get("/paciente/{paciente_id}", response_model=list[AtencionResponse])
def por_paciente(paciente_id: int, db: Session = Depends(get_db),
                 usuario=Depends(solo_medico)):
    return db.query(Atencion).filter(Atencion.paciente_id == paciente_id).all()

@router.post("/", response_model=AtencionResponse, status_code=201)
def crear(datos: AtencionCreate, request: Request,
          db: Session = Depends(get_db), usuario=Depends(solo_medico)):
    atencion = Atencion(**datos.model_dump())
    db.add(atencion); db.commit(); db.refresh(atencion)
    registrar_log(db, usuario.id, "CREAR_ATENCION", "atenciones", atencion.id, str(request.client.host))
    return atencion

@router.get("/{id}", response_model=AtencionResponse)
def obtener(id: int, db: Session = Depends(get_db), usuario=Depends(solo_medico)):
    a = db.query(Atencion).filter(Atencion.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Atención no encontrada")
    return a
