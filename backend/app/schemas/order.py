from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from ..models.order import OrderStatus
from .product import ProductListOut


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: ProductListOut
    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    shipping_address: str
    payment_method: Optional[str] = "Cash on Delivery"


class OrderOut(BaseModel):
    id: int
    total_amount: float
    status: OrderStatus
    shipping_address: str
    payment_method: str
    created_at: datetime
    items: List[OrderItemOut]
    model_config = {"from_attributes": True}


class OrdersResponse(BaseModel):
    orders: List[OrderOut]
    total: int
