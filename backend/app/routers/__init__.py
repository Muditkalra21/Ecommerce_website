from .products import router as products_router
from .cart import router as cart_router
from .orders import router as orders_router
from .wishlist import router as wishlist_router

__all__ = ["products_router", "cart_router", "orders_router", "wishlist_router"]
