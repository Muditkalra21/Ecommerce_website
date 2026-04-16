from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .product import ProductListOut


class CartItemCreate(BaseModel):
    product_id: int
    quantity: Optional[int] = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductListOut
    created_at: datetime
    model_config = {"from_attributes": True}


class CartResponse(BaseModel):
    items: List[CartItemOut]
    total_items: int
    subtotal: float
    model_config = {"from_attributes": True}
