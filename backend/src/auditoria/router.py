from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth.models import RolUsuario
from ..auth.security import requerir_rol
from .models import AuditoriaLog

router = APIRouter(prefix="/api/auditoria", tags=["Auditoría"])

@router.get("/")
def listar_logs(
    skip:  int = Query(default=0,   ge=0),
    limit: int = Query(default=100, le=500),
    db:    Session = Depends(get_db),
    _=Depends(requerir_rol(RolUsuario.admin))
):
    """
    Devuelve el log de auditoría completo.
    Solo accesible para administradores — OWASP A01 + A09.
    """
    logs = (
        db.query(AuditoriaLog)
        .order_by(AuditoriaLog.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return logs
