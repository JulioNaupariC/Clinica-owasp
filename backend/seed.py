"""
Script para cargar datos iniciales en la base de datos.
Ejecutar UNA SOLA VEZ después de crear la base de datos:

    cd backend
    venv\Scripts\activate        (Windows)
    python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.database import SessionLocal, Base, engine
from src.auth.models import Usuario, RolUsuario
from src.pacientes.models import Paciente
from src.citas.models import Cita, EstadoCita
from src.atenciones.models import Atencion
from src.auditoria.models import AuditoriaLog
from src.auth.security import hashear_password
from datetime import datetime, date

# Crear todas las tablas
Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("=" * 50)
print("  CARGANDO DATOS INICIALES — CLÍNICA OWASP")
print("=" * 50)

# ── USUARIOS ─────────────────────────────────────────
usuarios_data = [
    {
        "nombre":   "Administrador Sistema",
        "email":    "admin@clinica.pe",
        "password": "Admin1234",
        "rol":      RolUsuario.admin
    },
    {
        "nombre":   "Dr. Carlos Mendoza Rios",
        "email":    "medico@clinica.pe",
        "password": "Medico1234",
        "rol":      RolUsuario.medico
    },
    {
        "nombre":   "Ana Torres Recepción",
        "email":    "recep@clinica.pe",
        "password": "Recep1234",
        "rol":      RolUsuario.recepcionista
    },
]

usuarios_creados = []
for u in usuarios_data:
    existe = db.query(Usuario).filter(Usuario.email == u["email"]).first()
    if not existe:
        nuevo = Usuario(
            nombre        = u["nombre"],
            email         = u["email"],
            password_hash = hashear_password(u["password"]),
            rol           = u["rol"]
        )
        db.add(nuevo)
        db.commit()
        db.refresh(nuevo)
        usuarios_creados.append(nuevo)
        print(f"  ✓ Usuario creado: {u['email']} [{u['rol']}]")
    else:
        usuarios_creados.append(existe)
        print(f"  ⚠ Ya existe: {u['email']}")

# ── PACIENTES ─────────────────────────────────────────
pacientes_data = [
    {
        "nombres":          "María Elena",
        "apellidos":        "García López",
        "dni":              "12345678",
        "fecha_nacimiento": date(1985, 3, 15),
        "telefono":         "987654321",
        "direccion":        "Av. Giráldez 234, Huancayo",
        "email":            "maria.garcia@email.com"
    },
    {
        "nombres":          "Juan Carlos",
        "apellidos":        "Pérez Torres",
        "dni":              "87654321",
        "fecha_nacimiento": date(1990, 7, 22),
        "telefono":         "912345678",
        "direccion":        "Jr. Cusco 456, Huancayo",
        "email":            "juan.perez@email.com"
    },
    {
        "nombres":          "Rosa Amelia",
        "apellidos":        "Huanca Mamani",
        "dni":              "45678912",
        "fecha_nacimiento": date(1978, 11, 8),
        "telefono":         "998877665",
        "direccion":        "Av. Ferrocarril 789, Huancayo",
        "email":            None
    },
    {
        "nombres":          "Pedro Luis",
        "apellidos":        "Quispe Cóndor",
        "dni":              "32165498",
        "fecha_nacimiento": date(2001, 5, 30),
        "telefono":         "944332211",
        "direccion":        "Jr. Lima 123, Huancayo",
        "email":            "pedro.quispe@email.com"
    },
]

pacientes_creados = []
for p in pacientes_data:
    existe = db.query(Paciente).filter(Paciente.dni == p["dni"]).first()
    if not existe:
        nuevo = Paciente(**p)
        db.add(nuevo)
        db.commit()
        db.refresh(nuevo)
        pacientes_creados.append(nuevo)
        print(f"  ✓ Paciente creado: {p['nombres']} {p['apellidos']} — DNI {p['dni']}")
    else:
        pacientes_creados.append(existe)
        print(f"  ⚠ Ya existe paciente DNI: {p['dni']}")

# ── CITAS ─────────────────────────────────────────────
medico = db.query(Usuario).filter(Usuario.rol == RolUsuario.medico).first()

if medico and pacientes_creados:
    citas_data = [
        {
            "paciente_id": pacientes_creados[0].id,
            "medico_id":   medico.id,
            "fecha_hora":  datetime(2026, 6, 20, 9, 0),
            "motivo":      "Control general y chequeo preventivo",
            "estado":      EstadoCita.confirmada,
        },
        {
            "paciente_id": pacientes_creados[1].id,
            "medico_id":   medico.id,
            "fecha_hora":  datetime(2026, 6, 20, 10, 30),
            "motivo":      "Dolor de cabeza persistente",
            "estado":      EstadoCita.pendiente,
        },
        {
            "paciente_id": pacientes_creados[2].id,
            "medico_id":   medico.id,
            "fecha_hora":  datetime(2026, 6, 19, 8, 0),
            "motivo":      "Seguimiento de presión arterial",
            "estado":      EstadoCita.atendida,
        },
    ]

    for c in citas_data:
        existe = db.query(Cita).filter(
            Cita.paciente_id == c["paciente_id"],
            Cita.fecha_hora  == c["fecha_hora"]
        ).first()
        if not existe:
            nueva = Cita(**c)
            db.add(nueva)
            db.commit()
            print(f"  ✓ Cita creada: paciente #{c['paciente_id']} — {c['motivo'][:40]}")

# ── CIERRE ────────────────────────────────────────────
db.close()

print("\n" + "=" * 50)
print("  ✅ DATOS CARGADOS CORRECTAMENTE")
print("=" * 50)
print("\nCredenciales de acceso:")
print("  Admin:         admin@clinica.pe    / Admin1234")
print("  Médico:        medico@clinica.pe   / Medico1234")
print("  Recepcionista: recep@clinica.pe    / Recep1234")
print("\nInicia el servidor con:")
print("  python -m uvicorn src.main:app --reload --port 8000")
print("  Swagger: http://localhost:8000/docs")
print("=" * 50)
