from pydantic import BaseModel
from typing import List
from datetime import datetime
from .product import ProductListOut


class WishlistItemCreate(BaseModel):
    product_id: int


class WishlistItemOut(BaseModel):
    id: int
    product_id: int
    product: ProductListOut
    created_at: datetime
    model_config = {"from_attributes": True}


class WishlistResponse(BaseModel):
    items: List[WishlistItemOut]
    total: int
