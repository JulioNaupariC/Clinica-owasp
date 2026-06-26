from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..database import get_db
from ..auditoria.service import registrar_log
from .models import Usuario, RolUsuario
from .schemas import LoginRequest, TokenResponse, UsuarioCreate, UsuarioResponse
from .security import (
    verificar_password, hashear_password, crear_token,
    obtener_usuario_actual, requerir_rol,
    MAX_INTENTOS, BLOQUEO_MINUTOS
)

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])

# ── LOGIN con bloqueo por intentos — OWASP A07 + A09 ────────────────────────
@router.post("/login", response_model=TokenResponse)
def login(datos: LoginRequest, request: Request, db: Session = Depends(get_db)):
    ip = str(request.client.host)
    usuario = db.query(Usuario).filter(Usuario.email == datos.email).first()

    # Verificar si está bloqueado
    if usuario and usuario.bloqueado_hasta:
        if datetime.utcnow() < usuario.bloqueado_hasta:
            minutos = int((usuario.bloqueado_hasta - datetime.utcnow()).total_seconds() / 60) + 1
            registrar_log(db, None, "LOGIN_BLOQUEADO", "usuarios", None, ip, datos.email)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Cuenta bloqueada. Intenta en {minutos} minuto(s)."
            )
        else:
            usuario.intentos_fallidos = 0
            usuario.bloqueado_hasta   = None
            db.commit()

    # Credenciales incorrectas
    if not usuario or not verificar_password(datos.password, usuario.password_hash):
        if usuario:
            usuario.intentos_fallidos += 1
            if usuario.intentos_fallidos >= MAX_INTENTOS:
                usuario.bloqueado_hasta = datetime.utcnow() + timedelta(minutes=BLOQUEO_MINUTOS)
                db.commit()
                registrar_log(db, None, "LOGIN_CUENTA_BLOQUEADA", "usuarios", None, ip, datos.email)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Cuenta bloqueada por {MAX_INTENTOS} intentos fallidos. Intenta en {BLOQUEO_MINUTOS} minutos."
                )
            db.commit()
        registrar_log(db, None, "LOGIN_FALLIDO", "usuarios", None, ip, datos.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
        )

    if not usuario.activo:
        registrar_log(db, usuario.id, "LOGIN_USUARIO_INACTIVO", "usuarios", usuario.id, ip)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo. Contacta al administrador."
        )

    # Login exitoso
    usuario.intentos_fallidos = 0
    usuario.bloqueado_hasta   = None
    db.commit()

    registrar_log(db, usuario.id, "LOGIN_EXITOSO", "usuarios", usuario.id, ip)
    token = crear_token({"sub": usuario.email, "rol": usuario.rol})
    return TokenResponse(access_token=token, rol=usuario.rol, nombre=usuario.nombre)


# ── CREAR usuario — solo admin — OWASP A01 ───────────────────────────────────
@router.post("/usuarios", response_model=UsuarioResponse, status_code=201)
def crear_usuario(
    datos: UsuarioCreate,
    request: Request,
    db: Session = Depends(get_db),
    usuario=Depends(requerir_rol(RolUsuario.admin))
):
    if db.query(Usuario).filter(Usuario.email == datos.email).first():
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    nuevo = Usuario(
        nombre        = datos.nombre,
        email         = datos.email,
        password_hash = hashear_password(datos.password),
        rol           = datos.rol
    )
    db.add(nuevo); db.commit(); db.refresh(nuevo)
    registrar_log(db, usuario.id, "CREAR_USUARIO", "usuarios", nuevo.id, str(request.client.host))
    return nuevo


# ── LISTAR usuarios — solo admin ─────────────────────────────────────────────
@router.get("/usuarios", response_model=list[UsuarioResponse])
def listar_usuarios(
    db: Session = Depends(get_db),
    _=Depends(requerir_rol(RolUsuario.admin))
):
    return db.query(Usuario).order_by(Usuario.nombre).all()


# ── PERFIL propio ─────────────────────────────────────────────────────────────
@router.get("/me", response_model=UsuarioResponse)
def mi_perfil(usuario=Depends(obtener_usuario_actual)):
    return usuario
