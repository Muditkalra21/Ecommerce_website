from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import Optional

from ..core.deps import get_db
from ..models import Product, Category
from ..schemas import ProductOut, ProductListOut, ProductsResponse, CategoryOut

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=ProductsResponse)
def get_products(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = Query(None, enum=["price_asc", "price_desc", "rating", "newest", "discount"]),
    brand: Optional[str] = None,
):
    query = db.query(Product).options(joinedload(Product.category)).filter(Product.is_active == True)

    if category:
        query = query.join(Category).filter(Category.slug == category)

    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.brand.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
            )
        )

    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if brand:
        query = query.filter(Product.brand.ilike(f"%{brand}%"))

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort_by == "rating":
        query = query.order_by(Product.rating.desc())
    elif sort_by == "newest":
        query = query.order_by(Product.created_at.desc())
    elif sort_by == "discount":
        query = query.order_by(Product.discount_percent.desc())
    else:
        query = query.order_by(Product.id.asc())

    total = query.count()
    products = query.offset((page - 1) * per_page).limit(per_page).all()

    return {
        "products": products,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/categories", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.id).all()


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = (
        db.query(Product)
        .options(joinedload(Product.category))
        .filter(Product.id == product_id, Product.is_active == True)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
