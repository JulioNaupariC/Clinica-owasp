from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .middleware.security_headers import SecurityHeadersMiddleware

app = FastAPI(
    title="Sistema Clínica OWASP Top 10 2021",
    description="""
Sistema web de gestión clínica con controles OWASP Top 10 2021.

## Controles implementados
- **A01** Control de acceso por roles (admin, médico, recepcionista)
- **A02** Cifrado bcrypt + JWT con expiración
- **A03** Validación Pydantic + SQLAlchemy ORM
- **A05** Security headers + CORS restringido + variables de entorno
- **A07** Bloqueo tras 5 intentos fallidos + contraseña fuerte
- **A09** Log automático de todas las acciones críticas
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# OWASP A05 — Security headers en todas las respuestas
app.add_middleware(SecurityHeadersMiddleware)

# OWASP A05 — CORS restringido solo al frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Importar modelos para que SQLAlchemy cree las tablas ──
from .auth.models      import Usuario
from .pacientes.models import Paciente
from .citas.models     import Cita
from .atenciones.models import Atencion
from .auditoria.models import AuditoriaLog
from .database         import Base, engine

Base.metadata.create_all(bind=engine)

# ── Registrar routers ──
from .auth.router       import router as auth_router
from .pacientes.router  import router as pacientes_router
from .citas.router      import router as citas_router
from .atenciones.router import router as atenciones_router
from .auditoria.router  import router as auditoria_router

app.include_router(auth_router)
app.include_router(pacientes_router)
app.include_router(citas_router)
app.include_router(atenciones_router)
app.include_router(auditoria_router)

@app.get("/", tags=["Sistema"])
def root():
    return {
        "sistema": "Clínica OWASP Top 10 2021",
        "version": "1.0.0",
        "estado":  "operativo",
        "docs":    "/docs"
    }

@app.get("/health", tags=["Sistema"])
def health():
    return {"status": "ok"}
