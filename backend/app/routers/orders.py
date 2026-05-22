from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session, joinedload

from ..core.deps import get_db, get_current_user
from ..models import Order, OrderItem, CartItem, Product
from ..models.user import User
from ..schemas import OrderCreate, OrderOut, OrdersResponse
from ..services.email import send_order_confirmation

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.get("", response_model=OrdersResponse)
def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    orders = (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.product).joinedload(Product.category)
        )
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return {"orders": orders, "total": len(orders)}


@router.post("", response_model=OrderOut)
async def place_order(
    payload: OrderCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Get cart items
    cart_items = (
        db.query(CartItem)
        .options(joinedload(CartItem.product))
        .filter(CartItem.user_id == current_user.id)
        .all()
    )

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Check stock
    for item in cart_items:
        if item.product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {item.product.name}",
            )

    # Calculate total
    total = sum(item.product.price * item.quantity for item in cart_items)

    # Create order
    order = Order(
        user_id=current_user.id,
        total_amount=total,
        shipping_address=payload.shipping_address,
        payment_method=payload.payment_method,
    )
    db.add(order)
    db.flush()

    # Create order items & reduce stock
    order_items_data = []
    for item in cart_items:
        oi = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price,
        )
        db.add(oi)
        item.product.stock -= item.quantity
        order_items_data.append({
            "name": item.product.name,
            "quantity": item.quantity,
            "price": item.product.price,
        })

    # Clear cart
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()

    # Reload order with relationships
    order = (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.product).joinedload(Product.category)
        )
        .filter(Order.id == order.id)
        .first()
    )

    # Send confirmation email — use authenticated user's email directly
    recipient_email = payload.customer_email or current_user.email
    recipient_name = current_user.name

    if recipient_email:
        background_tasks.add_task(
            send_order_confirmation,
            email=recipient_email,
            user_name=recipient_name,
            order_id=order.id,
            items=order_items_data,
            total_amount=total,
            shipping_address=payload.shipping_address,
            payment_method=payload.payment_method,
            order_date=order.created_at,
        )

    return order


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.product).joinedload(Product.category)
        )
        .filter(Order.id == order_id, Order.user_id == current_user.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
