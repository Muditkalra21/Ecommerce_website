from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .category import CategoryOut


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    discount_percent: Optional[int] = 0
    stock: Optional[int] = 0
    brand: Optional[str] = None
    rating: Optional[float] = 0.0
    rating_count: Optional[int] = 0
    image_url: Optional[str] = None
    images: Optional[str] = None
    specifications: Optional[str] = None
    category_id: int


class ProductOut(ProductBase):
    id: int
    is_active: bool
    created_at: datetime
    category: CategoryOut
    model_config = {"from_attributes": True}


class ProductListOut(BaseModel):
    id: int
    name: str
    price: float
    original_price: Optional[float] = None
    discount_percent: Optional[int] = 0
    rating: Optional[float] = 0.0
    rating_count: Optional[int] = 0
    image_url: Optional[str] = None
    brand: Optional[str] = None
    stock: Optional[int] = 0
    category: CategoryOut
    model_config = {"from_attributes": True}


class ProductsResponse(BaseModel):
    products: List[ProductListOut]
    total: int
    page: int
    per_page: int
    total_pages: int
