from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import engine, Base
from app.config import settings
import app.models
import logging
import time

from app.api_auth import router as auth_router
from app.api_game import router as game_router
from app.api_leaderboard import router as leaderboard_router
from app.api_election_data import router as election_data_router
from app.api_tutor import router as tutor_router

logger = logging.getLogger(__name__)

# ── Startup validation ───────────────────────────────────────────────────────
if settings.GEMINI_API_KEY == "your-gemini-api-key-here":
    logger.warning("⚠️  GEMINI_API_KEY is not set — AI Tutor will use rule-based fallback only.")

if settings.SECRET_KEY in ("your-secret-key-min-32-chars-change-in-production",):
    raise RuntimeError("❌ SECRET_KEY must be changed from the default placeholder before running.")

# Create database tables
Base.metadata.create_all(bind=engine)

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="VoteQuest API",
    description="Gamified Election Assistant Platform API",
    version="1.0.0",
    # Disable interactive docs in production to reduce attack surface
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
    openapi_url="/openapi.json" if settings.ENVIRONMENT == "development" else None,
)

# ── Security Headers Middleware ───────────────────────────────────────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    # Prevent browsers from MIME-sniffing
    response.headers["X-Content-Type-Options"] = "nosniff"
    # Prevent clickjacking
    response.headers["X-Frame-Options"] = "DENY"
    # Enforce HTTPS in production
    if settings.ENVIRONMENT == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    # Restrict referrer info
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    # Basic CSP: disallow unexpected content sources
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    # Log slow requests
    duration = time.time() - start
    if duration > 2.0:
        logger.warning(f"Slow request: {request.method} {request.url.path} took {duration:.2f}s")
    return response

# ── CORS ─────────────────────────────────────────────────────────────────────
_origins = [o.strip() for o in settings.CORS_ORIGINS.split(',') if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(game_router)
app.include_router(leaderboard_router)
app.include_router(election_data_router)
app.include_router(tutor_router)

# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "VoteQuest"}
