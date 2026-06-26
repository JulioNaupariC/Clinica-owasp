from sqlalchemy.orm import Session
from .models import AuditoriaLog

def registrar_log(
    db:         Session,
    usuario_id: int | None,
    accion:     str,
    tabla:      str,
    registro_id: int | None = None,
    ip:         str | None  = None,
    detalle:    str | None  = None
):
    """
    Registra una acción crítica en el log de auditoría.
    Se llama desde cada router después de cada operación importante.
    OWASP A09:2021
    """
    log = AuditoriaLog(
        usuario_id     = usuario_id,
        accion         = accion,
        tabla_afectada = tabla,
        registro_id    = registro_id,
        ip_address     = ip,
        detalle        = detalle
    )
    db.add(log)
    db.commit()
