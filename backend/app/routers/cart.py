from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from ..core.deps import get_db, get_current_user
from ..models import CartItem, Product
from ..models.user import User
from ..schemas import CartItemCreate, CartItemUpdate, CartItemOut, CartResponse

router = APIRouter(prefix="/api/cart", tags=["cart"])


@router.get("", response_model=CartResponse)
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = (
        db.query(CartItem)
        .options(joinedload(CartItem.product).joinedload(Product.category))
        .filter(CartItem.user_id == current_user.id)
        .all()
    )
    subtotal = sum(item.product.price * item.quantity for item in items)
    return {
        "items": items,
        "total_items": sum(i.quantity for i in items),
        "subtotal": subtotal,
    }


@router.post("", response_model=CartItemOut)
def add_to_cart(
    payload: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == payload.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == payload.product_id,
    ).first()

    if existing:
        existing.quantity += payload.quantity
        db.commit()
        db.refresh(existing)
        item = db.query(CartItem).options(
            joinedload(CartItem.product).joinedload(Product.category)
        ).filter(CartItem.id == existing.id).first()
        return item

    cart_item = CartItem(
        user_id=current_user.id,
        product_id=payload.product_id,
        quantity=payload.quantity,
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    item = db.query(CartItem).options(
        joinedload(CartItem.product).joinedload(Product.category)
    ).filter(CartItem.id == cart_item.id).first()
    return item


@router.put("/{item_id}", response_model=CartItemOut)
def update_cart_item(
    item_id: int,
    payload: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(CartItem).filter(
        CartItem.id == item_id, CartItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if payload.quantity <= 0:
        db.delete(item)
        db.commit()
        raise HTTPException(status_code=204, detail="Item removed")

    item.quantity = payload.quantity
    db.commit()
    db.refresh(item)
    item = db.query(CartItem).options(
        joinedload(CartItem.product).joinedload(Product.category)
    ).filter(CartItem.id == item_id).first()
    return item


@router.delete("/{item_id}")
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(CartItem).filter(
        CartItem.id == item_id, CartItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}


@router.delete("")
def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Cart cleared"}
