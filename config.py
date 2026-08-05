import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "sentinel-ai-secret-key-prod-2026"
    PERMANENT_SESSION_LIFETIME = timedelta(days=1)
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"