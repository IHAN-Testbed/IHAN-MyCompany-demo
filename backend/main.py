import os
import subprocess  # nosec

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import configure_db
from app.routers.auth import router as auth_router
from app.routers.configuration import router as config_router
from app.routers.consents import router as consent_router
from app.routers.health import health_router
from app.routers.identities import router as identities_router
from app.routers.product_gateway import router as pg_router
from settings import conf

CORS_ORIGINS = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]

app = FastAPI(title=conf.PROJECT_NAME, version="1.0.0")
_nginx_process = None


@app.on_event("startup")
def initialize():
    configure_db()
    if not conf.is_local_env():
        # Nginx must start only after the backend is loaded to avoid 502s
        global _nginx_process
        _nginx_process = subprocess.Popen(  # nosec
            ["/bin/sh", "/src/docker/nginx-entrypoint.sh"], env=os.environ
        )


# /api
api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router, prefix="/auth")
api_router.include_router(identities_router, prefix="/identities")
api_router.include_router(consent_router, prefix="/consents")
api_router.include_router(config_router, prefix="/configuration")
api_router.include_router(pg_router, prefix="/dataProduct")

app.include_router(api_router, prefix="/api")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
