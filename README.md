# clinica-owasp — Sistema Web de Gestión Clínica

Tesis: "Sistema web con controles de seguridad basados en OWASP Top 10 2021
y su influencia en la seguridad de la información en clínicas privadas
de la región Junín, 2026"
Universidad Continental — Ing. de Sistemas e Informática
Autor: Ñaupari Camarena, Julio Armando

---

## Estructura del proyecto

```
clinica-owasp/
├── backend/     ← Python + FastAPI + PostgreSQL
└── frontend/    ← React + Bootstrap 5
```

---

## Instalación rápida

### 1. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Editar .env con tu contraseña de PostgreSQL
python seed.py
python -m uvicorn src.main:app --reload --port 8000
```
→ API: http://localhost:8000
→ Swagger: http://localhost:8000/docs

### 2. Frontend
```bash
cd frontend
npm install
npm start
```
→ Sistema: http://localhost:3000

---

## Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@clinica.pe | Admin1234 |
| Médico | medico@clinica.pe | Medico1234 |
| Recepcionista | recep@clinica.pe | Recep1234 |

---

## Controles OWASP Top 10 2021 implementados

| Control | Implementación |
|---|---|
| A01 Control de acceso | Roles admin / médico / recepcionista |
| A02 Fallos criptográficos | bcrypt + JWT 30 min |
| A03 Inyección | SQLAlchemy ORM + validación Pydantic |
| A05 Config incorrecta | Security headers + .env + CORS |
| A07 Fallas autenticación | Bloqueo 5 intentos + contraseña fuerte |
| A09 Registro/monitoreo | Log automático en auditoria_logs |
