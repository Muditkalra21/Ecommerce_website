from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from ..core.deps import get_db, get_current_user
from ..models import WishlistItem, Product
from ..models.user import User
from ..schemas import WishlistItemCreate, WishlistItemOut, WishlistResponse

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])


@router.get("", response_model=WishlistResponse)
def get_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = (
        db.query(WishlistItem)
        .options(joinedload(WishlistItem.product).joinedload(Product.category))
        .filter(WishlistItem.user_id == current_user.id)
        .order_by(WishlistItem.created_at.desc())
        .all()
    )
    return {"items": items, "total": len(items)}


@router.post("", response_model=WishlistItemOut)
def add_to_wishlist(
    payload: WishlistItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == payload.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == payload.product_id,
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Product already in wishlist")

    item = WishlistItem(user_id=current_user.id, product_id=payload.product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    item = db.query(WishlistItem).options(
        joinedload(WishlistItem.product).joinedload(Product.category)
    ).filter(WishlistItem.id == item.id).first()
    return item


@router.delete("/{item_id}")
def remove_from_wishlist(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(WishlistItem).filter(
        WishlistItem.id == item_id, WishlistItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed from wishlist"}


@router.delete("/product/{product_id}")
def remove_from_wishlist_by_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(WishlistItem).filter(
        WishlistItem.product_id == product_id,
        WishlistItem.user_id == current_user.id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed from wishlist"}
