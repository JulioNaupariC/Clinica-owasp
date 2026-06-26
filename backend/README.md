# Sistema Web Clínica — OWASP Top 10 2021

Sistema de gestión clínica con controles de seguridad basados en OWASP Top 10 2021.

**Tesis:** "Sistema web con controles de seguridad basados en OWASP Top 10 2021 y su influencia en la seguridad de la información en clínicas privadas de la región Junín, 2026"
**Universidad Continental — Ing. de Sistemas e Informática**

---

## Controles OWASP implementados

| Control | Descripción | Implementación |
|---|---|---|
| A01 | Control de acceso roto | Roles: admin, médico, recepcionista |
| A02 | Fallos criptográficos | bcrypt + JWT con expiración 30 min |
| A03 | Inyección | SQLAlchemy ORM + validación Pydantic |
| A05 | Configuración incorrecta | Security headers + .env + CORS restringido |
| A07 | Fallas de autenticación | Bloqueo tras 5 intentos + contraseña fuerte |
| A09 | Fallas de registro | Log automático en tabla auditoria_logs |

---

## Requisitos previos

Instalar en este orden:

- [Python 3.11+](https://python.org)
- [PostgreSQL 15+](https://postgresql.org)
- [Node.js 18+](https://nodejs.org)
- [Git](https://git-scm.com)

---

## Instalación — Backend

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/clinica-owasp.git
cd clinica-owasp/backend
```

### 2. Crear entorno virtual
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno
```bash
copy .env.example .env
```

Editar `.env` con tus datos:
```
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/clinica_db
SECRET_KEY=clave-super-secreta-cambiar-en-produccion-2026
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
```

### 5. Crear la base de datos
Abrir pgAdmin o psql y ejecutar:
```sql
CREATE DATABASE clinica_db;
```

### 6. Cargar datos iniciales
```bash
python seed.py
```

### 7. Iniciar el servidor
```bash
python -m uvicorn src.main:app --reload --port 8000
```

**Swagger (documentación API):** http://localhost:8000/docs

---

## Instalación — Frontend

```bash
cd ../frontend
npm install
npm start
```

**Frontend:** http://localhost:3000

---

## Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@clinica.pe | Admin1234 |
| Médico | medico@clinica.pe | Medico1234 |
| Recepcionista | recep@clinica.pe | Recep1234 |

---

## Estructura del proyecto

```
clinica-owasp/
├── backend/
│   ├── src/
│   │   ├── main.py              ← FastAPI app principal
│   │   ├── config.py            ← variables de entorno
│   │   ├── database.py          ← conexión PostgreSQL
│   │   ├── auth/                ← login, JWT, roles
│   │   ├── pacientes/           ← módulo pacientes
│   │   ├── citas/               ← módulo citas
│   │   ├── atenciones/          ← módulo atenciones
│   │   ├── auditoria/           ← logs OWASP A09
│   │   └── middleware/          ← security headers A05
│   ├── seed.py                  ← datos de prueba
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/               ← Login, Dashboard, etc.
    │   ├── components/          ← Layout, Modal
    │   ├── context/             ← AuthContext
    │   └── services/            ← api.js
    └── package.json
```

---

## Escaneo OWASP ZAP (para la tesis)

### Pre-test (antes de implementar controles)
```bash
# Iniciar ZAP y escanear el sistema sin controles
zap-baseline.py -t http://localhost:8000
```

### Post-test (con controles implementados)
```bash
# Escanear el sistema con todos los controles activos
zap-baseline.py -t http://localhost:8000 -r reporte_post.html
```

---

## Endpoints principales

| Método | Ruta | Descripción | Rol requerido |
|---|---|---|---|
| POST | /api/auth/login | Iniciar sesión | Público |
| GET | /api/auth/me | Perfil propio | Autenticado |
| GET | /api/pacientes/ | Listar pacientes | Todos |
| POST | /api/pacientes/ | Crear paciente | Todos |
| PUT | /api/pacientes/{id} | Editar paciente | Todos |
| DELETE | /api/pacientes/{id} | Eliminar paciente | Admin |
| GET | /api/citas/ | Listar citas | Todos |
| POST | /api/citas/ | Crear cita | Todos |
| PUT | /api/citas/{id}/estado | Cambiar estado | Todos |
| GET | /api/atenciones/ | Listar atenciones | Admin, Médico |
| POST | /api/atenciones/ | Registrar atención | Admin, Médico |
| GET | /api/auditoria/ | Ver logs | Solo Admin |
| GET | /api/auth/usuarios | Listar usuarios | Solo Admin |
| POST | /api/auth/usuarios | Crear usuario | Solo Admin |
