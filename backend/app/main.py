from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .core.database import engine
from .models import (  # noqa: F401 – import all so metadata is populated
    User, Category, Product, CartItem, Order, OrderItem, WishlistItem,
)
from .models.user import User as UserModel  # ensure Base is common
from .core.database import Base
from .routers import products, cart, orders, wishlist
from .routers import auth

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Flipkart API",
    description="Backend API for Flipkart e-commerce application",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# ── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        settings.FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
