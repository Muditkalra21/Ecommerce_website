import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, Trash2, Plus, Minus, ChevronRight, MapPin, CreditCard, Loader2, Mail } from 'lucide-react';
import { getCart, updateCartItem, removeFromCart, placeOrder } from '../lib/api';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = ['Cash on Delivery', 'Credit/Debit Card', 'UPI', 'Net Banking', 'Flipkart Pay Later'];
const STEPS = ['cart', 'address', 'payment'];

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('123, MG Road, Bangalore, Karnataka 560001');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [customerEmail, setCustomerEmail] = useState('');
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch {
      toast.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) { await handleRemove(itemId); return; }
    setUpdatingItems(s => new Set(s).add(itemId));
    try {
      await updateCartItem(itemId, newQty);
      await fetchCart();
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingItems(s => { const ns = new Set(s); ns.delete(itemId); return ns; });
    }
  };

  const handleRemove = async (itemId) => {
    setUpdatingItems(s => new Set(s).add(itemId));
    try {
      await removeFromCart(itemId);
      await fetchCart();
      toast.success('Item removed from cart');
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setUpdatingItems(s => { const ns = new Set(s); ns.delete(itemId); return ns; });
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) { toast.error('Please enter a shipping address'); return; }
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setPlacing(true);
    try {
      await placeOrder(shippingAddress, paymentMethod, customerEmail || null);
      toast.success('🎉 Order placed successfully! Check your email for confirmation.');
      window.dispatchEvent(new Event('cart-updated'));
      router.push('/orders');
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Loader2 size={40} className="spin" style={{ color: '#2874f0' }} /></div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '24px', lineHeight: 1 }}>🛒</div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#212121', marginBottom: '8px' }}>Your cart is empty!</h2>
        <p style={{ fontSize: '14px', color: '#878787', marginBottom: '32px', maxWidth: '300px' }}>Add items to it now to keep track of what you need before ordering</p>
        <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>Shop Now</Link>
      </div>
    );
  }

  const deliveryFee = cart.subtotal > 499 ? 0 : 40;
  const totalAmount = cart.subtotal + deliveryFee;
  const totalSavings = cart.items.reduce((acc, item) => {
    const orig = item.product.original_price || item.product.price;
    return acc + (orig - item.product.price) * item.quantity;
  }, 0);

  return (
    <>
      <Head><title>My Cart – Flipkart</title></Head>
      <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '16px' }}>
        <div className="container">
          {/* Checkout steps */}
          <div style={{ background: 'white', borderRadius: '4px', padding: '16px 24px', marginBottom: '16px', display: 'flex', gap: '0', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            {STEPS.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: checkoutStep === step ? '#2874f0' : (i < STEPS.indexOf(checkoutStep) ? '#26a541' : '#e0e0e0'),
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700,
                  }}>
                    {i < STEPS.indexOf(checkoutStep) ? '✓' : i + 1}
                  </div>
                  <span style={{ fontWeight: checkoutStep === step ? 700 : 400, color: checkoutStep === step ? '#2874f0' : '#878787', fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    {step === 'cart' ? 'MY CART' : step === 'address' ? 'DETAILS' : 'PAYMENT'}
                  </span>
                </div>
                {i < 2 && <ChevronRight size={18} color="#ccc" style={{ marginLeft: 'auto', marginRight: 'auto' }} />}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', alignItems: 'start' }}>
            {/* Left */}
            <div>
              {checkoutStep === 'cart' && (
                <div style={{ background: 'white', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700 }}>My Cart ({cart.total_items} items)</h2>
                  </div>
                  {cart.items.map(item => (
                    <div key={item.id} style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '20px', alignItems: 'flex-start', opacity: updatingItems.has(item.id) ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                      <Link href={`/product/${item.product_id}`}>
                        <div style={{ width: '80px', height: '80px', border: '1px solid #f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', flexShrink: 0 }}>
                          <img src={item.product.image_url || 'https://placehold.co/80x80'} alt={item.product.name} style={{ maxWidth: '70px', maxHeight: '70px', objectFit: 'contain' }} />
                        </div>
                      </Link>
                      <div style={{ flex: 1 }}>
                        <Link href={`/product/${item.product_id}`}>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: '#212121', marginBottom: '4px', lineHeight: 1.4 }}>{item.product.name}</p>
                        </Link>
                        {item.product.brand && <p style={{ fontSize: '12px', color: '#878787', marginBottom: '8px' }}>by {item.product.brand}</p>}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                          <span style={{ fontSize: '18px', fontWeight: 700 }}>₹{item.product.price.toLocaleString()}</span>
                          {item.product.original_price && item.product.original_price > item.product.price && (
                            <span style={{ fontSize: '13px', color: '#878787', textDecoration: 'line-through' }}>₹{item.product.original_price.toLocaleString()}</span>
                          )}
                          {item.product.discount_percent > 0 && (
                            <span style={{ fontSize: '13px', color: '#26a541', fontWeight: 600 }}>{item.product.discount_percent}% off</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          {/* Qty */}
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                            <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={updatingItems.has(item.id)} style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', color: '#2874f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Minus size={14} />
                            </button>
                            <span style={{ padding: '0 12px', fontWeight: 700, fontSize: '14px' }}>{item.quantity}</span>
                            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} disabled={updatingItems.has(item.id)} style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', color: '#2874f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Plus size={14} />
                            </button>
                          </div>
                          <button onClick={() => handleRemove(item.id)} disabled={updatingItems.has(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff4040', background: 'none', border: 'none', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '80px' }}>
                        <p style={{ fontSize: '16px', fontWeight: 700 }}>₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '16px 24px' }}>
                    <button onClick={() => setCheckoutStep('address')} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px', borderRadius: '4px' }}>
                      PLACE ORDER →
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 'address' && (
                <div style={{ background: 'white', borderRadius: '4px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={20} color="#2874f0" /> Delivery Address
                  </h2>
                  <div style={{ background: '#f0f4ff', border: '2px solid #2874f0', borderRadius: '4px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ background: '#2874f0', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '2px' }}>HOME</span>
                      <span style={{ fontWeight: 600 }}>Mudit Kalra</span>
                    </div>
                    <textarea value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} rows={3} className="input-field" placeholder="Enter your full delivery address..." style={{ resize: 'vertical' }} />
                  </div>

                  {/* Email for order confirmation */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', marginBottom: '10px', color: '#212121' }}>
                      <Mail size={16} color="#2874f0" /> Order Confirmation Email
                    </label>
                    <input
                      id="customer-email"
                      type="email"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="Enter your email to receive order confirmation"
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                    <p style={{ fontSize: '11px', color: '#878787', marginTop: '6px' }}>
                      📧 A confirmation email with your invoice will be sent to this address. Leave blank to skip.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setCheckoutStep('cart')} className="btn-outline" style={{ flex: 1 }}>← Back</button>
                    <button onClick={() => setCheckoutStep('payment')} className="btn-primary" style={{ flex: 2 }}>Continue to Payment →</button>
                  </div>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div style={{ background: 'white', borderRadius: '4px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={20} color="#2874f0" /> Payment Method
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {PAYMENT_METHODS.map(method => (
                      <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', border: `2px solid ${paymentMethod === method ? '#2874f0' : '#e0e0e0'}`, borderRadius: '4px', cursor: 'pointer', background: paymentMethod === method ? '#f0f4ff' : 'white', transition: 'all 0.2s' }}>
                        <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} style={{ accentColor: '#2874f0' }} />
                        <span style={{ fontWeight: paymentMethod === method ? 600 : 400, color: paymentMethod === method ? '#2874f0' : '#212121' }}>{method}</span>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setCheckoutStep('address')} className="btn-outline" style={{ flex: 1 }}>← Back</button>
                    <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary" style={{ flex: 2 }}>
                      {placing ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Loader2 size={18} className="spin" /> Placing Order...</span> : `Confirm Order • ₹${totalAmount.toLocaleString()}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Summary */}
            <div style={{ background: 'white', borderRadius: '4px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: '72px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#878787', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase' }}>Price Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: `Price (${cart.total_items} items)`, value: `₹${cart.subtotal.toLocaleString()}` },
                  { label: 'Discount', value: `-₹${totalSavings.toFixed(0)}`, color: '#26a541' },
                  { label: 'Delivery Charges', value: deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`, color: '#26a541' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#212121' }}>
                    <span>{label}</span>
                    <span style={{ color: color || 'inherit', fontWeight: color ? 600 : 400 }}>{value}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700 }}>
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                {totalSavings > 0 && (
                  <div style={{ background: '#e8f5e9', borderRadius: '4px', padding: '10px 14px', fontSize: '13px', color: '#26a541', fontWeight: 600 }}>
                    🎉 You will save ₹{totalSavings.toFixed(0)} on this order!
                  </div>
                )}
              </div>
              {checkoutStep === 'cart' && (
                <button onClick={() => setCheckoutStep('address')} className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '14px' }}>
                  PLACE ORDER
                </button>
              )}
              <p style={{ fontSize: '11px', color: '#878787', textAlign: 'center', marginTop: '12px' }}>🔒 Safe and Secure Payments</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
