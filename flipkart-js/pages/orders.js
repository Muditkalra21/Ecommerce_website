import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getOrders } from '../lib/api';
import withAuth from '../components/ProtectedRoute';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#ff9f00', bg: '#fff8e1', icon: <Clock size={14} /> },
  confirmed: { label: 'Confirmed', color: '#2874f0', bg: '#e8f0fe', icon: <CheckCircle size={14} /> },
  shipped:   { label: 'Shipped',   color: '#9c27b0', bg: '#f3e5f5', icon: <Truck size={14} /> },
  delivered: { label: 'Delivered', color: '#26a541', bg: '#e8f5e9', icon: <CheckCircle size={14} /> },
  cancelled: { label: 'Cancelled', color: '#ff4040', bg: '#ffebee', icon: <XCircle size={14} /> },
};

const DELIVERY_STEPS = ['confirmed', 'shipped', 'delivered'];

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    getOrders()
      .then(data => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Loader2 size={40} className="spin" style={{ color: '#2874f0' }} /></div>;
  }

  if (orders.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>📦</div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#212121', marginBottom: '8px' }}>No orders yet!</h2>
        <p style={{ fontSize: '14px', color: '#878787', marginBottom: '32px' }}>Looks like you haven&apos;t placed any orders. Start shopping!</p>
        <Link href="/" style={{ background: '#2874f0', color: 'white', padding: '12px 32px', borderRadius: '4px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', textTransform: 'uppercase' }}>
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head><title>My Orders – Flipkart</title></Head>
      <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '20px 16px' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#212121', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package color="#2874f0" /> My Orders ({orders.length})
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map(order => {
              const sc = STATUS_CONFIG[order.status];
              const isExpanded = expandedOrder === order.id;
              const stepIndex = DELIVERY_STEPS.indexOf(order.status);

              return (
                <div key={order.id} style={{ background: 'white', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{ padding: '16px 20px', cursor: 'pointer', borderBottom: isExpanded ? '1px solid #f0f0f0' : 'none' }} onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 700, color: '#212121' }}>Order #{order.id}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
                            {sc.icon} {sc.label}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#878787' }}>
                          Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {' · '}{order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#212121' }}>₹{order.total_amount.toLocaleString()}</div>
                        <div style={{ fontSize: '12px', color: '#878787' }}>{order.payment_method}</div>
                      </div>
                    </div>
                    {/* Thumbnails */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.id} style={{ width: '48px', height: '48px', border: '1px solid #f0f0f0', borderRadius: '4px', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img src={item.product.image_url || 'https://placehold.co/48x48'} alt={item.product.name} style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div style={{ width: '48px', height: '48px', border: '1px solid #e0e0e0', borderRadius: '4px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#878787', fontWeight: 600 }}>
                          +{order.items.length - 3}
                        </div>
                      )}
                      <ChevronRight size={18} color="#878787" style={{ marginLeft: 'auto', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div style={{ padding: '20px' }}>
                      {/* Delivery progress */}
                      {order.status !== 'cancelled' && order.status !== 'pending' && (
                        <div style={{ marginBottom: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            {DELIVERY_STEPS.map((step, i) => {
                              const done = stepIndex >= i;
                              const active = stepIndex === i;
                              return (
                                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 0 }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: done ? '#2874f0' : '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700, boxShadow: active ? '0 0 0 4px rgba(40,116,240,0.2)' : 'none', transition: 'all 0.3s' }}>
                                      {done ? '✓' : i + 1}
                                    </div>
                                    <span style={{ fontSize: '11px', color: done ? '#2874f0' : '#878787', fontWeight: done ? 700 : 400, whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
                                      {STATUS_CONFIG[step].label}
                                    </span>
                                  </div>
                                  {i < 2 && <div style={{ flex: 1, height: '2px', background: stepIndex > i ? '#2874f0' : '#e0e0e0', margin: '0 8px', marginBottom: '20px', transition: 'background 0.3s' }} />}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Items */}
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#212121', marginBottom: '12px' }}>Items Ordered</h4>
                        {order.items.map(item => (
                          <div key={item.id} style={{ display: 'flex', gap: '16px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ width: '60px', height: '60px', border: '1px solid #f0f0f0', borderRadius: '4px', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <img src={item.product.image_url || 'https://placehold.co/60x60'} alt={item.product.name} style={{ maxWidth: '56px', maxHeight: '56px', objectFit: 'contain' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <Link href={`/product/${item.product_id}`}>
                                <p style={{ fontSize: '14px', color: '#212121', fontWeight: 500, marginBottom: '4px', lineHeight: 1.4 }}>{item.product.name}</p>
                              </Link>
                              <p style={{ fontSize: '13px', color: '#878787' }}>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '15px' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping */}
                      <div style={{ background: '#f9f9f9', borderRadius: '4px', padding: '14px 16px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#878787', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Delivered To</p>
                        <p style={{ fontSize: '14px', color: '#212121' }}>{order.shipping_address}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(OrdersPage);
