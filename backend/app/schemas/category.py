from pydantic import BaseModel
from typing import Optional


class CategoryBase(BaseModel):
    name: str
    slug: str
    icon: Optional[str] = None
    description: Optional[str] = None


class CategoryOut(CategoryBase):
    id: int
    model_config = {"from_attributes": True}
