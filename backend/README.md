# 🏥 Sistema Web Clínica — OWASP Top 10 2021

> **Tesis:** "Sistema web con controles de seguridad basados en OWASP Top 10 2021 y su influencia en la seguridad de la información en clínicas privadas de la región Junín, 2026"
> **Autor:** Ñaupari Camarena, Julio Armando
> **Universidad Continental — Ing. de Sistemas e Informática**
> **Herramienta IA utilizada:** Claude (Anthropic) — Claude Code

---

## 🛡️ Controles OWASP Top 10 2021 Implementados

| Control | Riesgo | Implementación |
|---|---|---|
| A01 | Control de acceso roto | Roles: admin, médico, recepcionista |
| A02 | Fallos criptográficos | bcrypt + JWT con expiración 30 min |
| A03 | Inyección | SQLAlchemy ORM + validación Pydantic |
| A05 | Configuración incorrecta | Security headers + .env + CORS restringido |
| A07 | Fallas de autenticación | Bloqueo tras 5 intentos + contraseña fuerte |
| A09 | Fallas de registro | Log automático en tabla auditoria_logs |

---

## 🗂️ Estado del Arte

### Pregunta de investigación
¿En qué medida la implementación de un sistema web con controles de seguridad basados en el estándar OWASP Top 10 2021 influye en la seguridad de la información en clínicas privadas de Huancayo, Junín, 2026?

### Estrategia de búsqueda
- **Bases de datos:** IEEE Xplore, Scopus, Dialnet, Redalyc, SciELO
- **Período:** 2018–2025
- **Idiomas:** Español e inglés
- **Total identificados:** 811 artículos
- **Total seleccionados:** 16 artículos

### Artículos seleccionados

| Código | Autores | Año | Título | Fuente |
|---|---|---|---|---|
| ART_1 | Álava, K.; Basurto, W. & Tóala, R. | 2022 | Vulnerabilidades en los sistemas informáticos OWASP Top 10: revisión bibliográfica | Dialnet |
| ART_2 | Carrión, E. & Proaño, J. | 2024 | Metodología OWASP: prevención de vulnerabilidades en aplicaciones web | Dialnet |
| ART_3 | Vega-Oyola, C.; Tapia, E. & Gallardo, F. | 2022 | Análisis de factores de seguridad informática mediante la metodología OWASP v4.2: caso ISTJOL | SciELO |
| ART_4 | González Brito, A. & Montesino, R. | 2018 | Capacidades de las metodologías de pruebas de penetración para vulnerabilidades web | SciELO Cuba |
| ART_5 | González Brito, A.; Montesino, R. & Gainza, G. | 2021 | Riesgos de seguridad en las pruebas de penetración de aplicaciones web | Redalyc |
| ART_6 | Niño Benítez, Y. & Silega Martínez, N. | 2018 | Requisitos de seguridad para aplicaciones web | SciELO Cuba |
| ART_7 | Ramírez Patajalo, G. A. | 2023 | Seguridad en desarrollo web: mejores prácticas para proteger aplicaciones y datos | Dialnet |
| ART_8 | Choiriyah, A. & Qomariasih, N. | 2023 | Security Analysis on Websites belonging to the Health Service Districts based on OWASP Top 10 2021 | IEEE |
| ART_9 | Gomero-Cuadra, R. & Sánchez-Calle, D. | 2024 | Ciberseguridad en servicios de apoyo al médico ocupacional de la ciudad de Lima | SciELO Perú |
| ART_10 | Cervera García, A. & Goussens, A. | 2024 | Ciberseguridad y uso de las TIC en el Sector Salud | ScienceDirect |
| ART_11 | Salazar-Lazo, C. & Avila-Correa, B. | 2024 | Estándares de ciberseguridad aplicables a los sistemas informáticos sanitarios | Dialnet |
| ART_12 | Coronel Suárez, S. & Quirumbay, D. | 2022 | Seguridad informática, metodologías, estándares y aplicaciones web | Redalyc |
| ART_13 | Pillajo-García, P. & Avila-Pesantez, D. | 2023 | Ciberseguridad en plataformas digitales: revisión sistemática | Dialnet |
| ART_14 | Morales-Paredes, C. & Medina-Chicaiza, R. | 2021 | Análisis de ciberseguridad en clínicas: vulnerabilidades en plataformas web de salud | Dialnet |
| ART_15 | Solís, B. et al. | 2023 | Seguridad de los sistemas informáticos: retos pendientes en organizaciones del sector salud | REICIT |
| ART_16 | Pillajo Pila, K. et al. | 2025 | Ciberseguridad y su integración en los sistemas de organizaciones de salud de Latinoamérica | Dialnet |

### Hallazgos principales
- OWASP supera al 76% de metodologías alternativas en cobertura de vulnerabilidades (ART_4)
- El 83% de organizaciones de salud experimentó brechas en 2022 con costo promedio de $4.35M por incidente (ART_9)
- Sistemas web de salud sin controles OWASP presentan hasta 11 vulnerabilidades activamente explotables (ART_8)
- El sector salud en Latinoamérica registra 388 incidentes de ciberseguridad por día (ART_16)

---

## 🚀 Instalación rápida

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install psycopg2==2.9.9 --only-binary=:all:
pip install bcrypt==4.0.1 passlib==1.7.4
pip install fastapi uvicorn sqlalchemy --upgrade python-dotenv "python-jose[cryptography]" pydantic-settings slowapi
python -c "open('.env','w',encoding='utf-8').write('DATABASE_URL=TU_URL_SUPABASE\nSECRET_KEY=clavesecretaclinica2026\nALGORITHM=HS256\nACCESS_TOKEN_EXPIRE_MINUTES=30\nDEBUG=False\n')"
python seed.py
python -m uvicorn src.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## 📁 Estructura del proyecto
clinica-owasp/
├── backend/
│   ├── src/
│   │   ├── auth/        → A01 + A02 + A07
│   │   ├── pacientes/   → CRUD completo
│   │   ├── citas/       → Agenda médica
│   │   ├── atenciones/  → Historial clínico
│   │   ├── auditoria/   → A09 logs
│   │   └── middleware/  → A05 security headers
│   └── seed.py
└── frontend/
└── src/
├── pages/       → 7 pantallas
└── components/  → Layout, Modal

---

## 🔑 Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@clinica.pe | Admin1234 |
| Médico | medico@clinica.pe | Medico1234 |
| Recepcionista | recep@clinica.pe | Recep1234 |

---

## 📊 Normas ISO aplicadas

| Norma | Aplicación |
|---|---|
| ISO 9001 | Gestión de calidad del proceso de desarrollo |
| ISO 25000 | Calidad del producto software |
| ISO 29119 | Plan de pruebas (caja blanca y negra) |
| ISO 27000 | Seguridad de la información — controles OWASP |