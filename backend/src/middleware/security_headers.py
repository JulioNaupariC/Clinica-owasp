from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    OWASP A05:2021 — Configuración de Seguridad Incorrecta
    Agrega cabeceras de seguridad HTTP a todas las respuestas
    para proteger contra clickjacking, XSS, sniffing y más.
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Evita que el navegador adivine el tipo de contenido
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Evita que la página se cargue en un iframe (anti-clickjacking)
        response.headers["X-Frame-Options"] = "DENY"

        # Protección básica contra XSS en navegadores antiguos
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Fuerza HTTPS en producción
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        # Controla qué información se envía en el Referer
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # No cachear respuestas con datos sensibles
        response.headers["Cache-Control"] = "no-store"

        return response
