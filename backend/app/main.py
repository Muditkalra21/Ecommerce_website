import re
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .core.config import settings
from .core.database import engine
from .models import (  # noqa: F401 – import all so metadata is populated
    User, Category, Product, CartItem, Order, OrderItem, WishlistItem,
)
from .models.user import User as UserModel  # ensure Base is common
from .core.database import Base
from .routers import products, cart, orders, wishlist
from .routers import auth

# ── Schema migrations (safe ALTER TABLE for missing columns) ─────────────────
def run_migrations():
    """Add any columns that may be missing due to schema evolution.
    Uses IF NOT EXISTS so it's safe to run on every startup."""
    from sqlalchemy import text
    migrations = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS hashed_password VARCHAR(200)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now()",
    ]
    with engine.connect() as conn:
        for sql in migrations:
            try:
                conn.execute(text(sql))
            except Exception:
                pass  # column may already exist on older Postgres without IF NOT EXISTS
        conn.commit()


# Create all tables on startup, then patch any missing columns
Base.metadata.create_all(bind=engine)
run_migrations()

app = FastAPI(
    title="Flipkart API",
    description="Backend API for Flipkart e-commerce application",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# ── CORS ────────────────────────────────────────────────────────────────────
# Build list of allowed origins
_allowed_origins = list({
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://ecomwebsite-two.vercel.app",   # production frontend (hardcoded fallback)
    settings.FRONTEND_URL.rstrip("/"),       # from FRONTEND_URL env var on Render
})

# Pattern to also allow all Vercel preview/production URLs dynamically
_vercel_pattern = re.compile(r"https://[\w-]+\.vercel\.app$")


def _origin_allowed(origin: str) -> bool:
    if origin in _allowed_origins:
        return True
    if _vercel_pattern.match(origin):
        return True
    return False


app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_origin_regex=r"https://[\w-]+\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Global exception handler — always adds CORS headers ──────────────────────
# Starlette's CORSMiddleware does NOT add headers when an unhandled exception
# occurs inside a route (e.g. DB connection failure). This handler ensures the
# browser always receives CORS headers so the real error is visible in the console.
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin", "")
    cors_origin = origin if _origin_allowed(origin) else ""
    headers = {}
    if cors_origin:
        headers["Access-Control-Allow-Origin"] = cors_origin
        headers["Access-Control-Allow-Credentials"] = "true"
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {type(exc).__name__}: {exc}"},
        headers=headers,
    )


# ── Routers ─────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(wishlist.router)


# ── Health Endpoints ─────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "Flipkart API",
        "version": "1.0.0",
        "docs": "/api/docs",
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "flipkart-clone-api"}


@app.get("/api/health/db")
def health_check_db():
    """Check DB connectivity — useful for diagnosing Render deployment issues."""
    from sqlalchemy import text
    from .core.database import SessionLocal
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "unhealthy", "database": "disconnected", "error": str(e)},
        )
    finally:
        db.close()
