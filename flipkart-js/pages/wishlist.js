import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { getWishlist, removeFromWishlist, addToCart } from '../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../components/ProtectedRoute';

function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [addingCart, setAddingCart] = useState(new Set());

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      setItems(data.items);
    } catch {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (productId) => {
    setRemovingItems(s => new Set(s).add(productId));
    try {
      await removeFromWishlist(productId);
      setItems(prev => prev.filter(i => i.product_id !== productId));
      toast.success('Removed from wishlist');
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch {
      toast.error('Failed to remove from wishlist');
    } finally {
      setRemovingItems(s => { const ns = new Set(s); ns.delete(productId); return ns; });
    }
  };

  const handleAddToCart = async (productId) => {
    setAddingCart(s => new Set(s).add(productId));
    try {
      await addToCart(productId);
      toast.success('Added to cart!');
      window.dispatchEvent(new Event('cart-updated'));
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAddingCart(s => { const ns = new Set(s); ns.delete(productId); return ns; });
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Loader2 size={40} className="spin" style={{ color: '#2874f0' }} /></div>;
  }

  if (items.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', padding: '40px' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b6b, #ff4040)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 32px rgba(255,64,64,0.3)' }}>
          <Heart size={56} color="white" fill="white" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#212121', marginBottom: '8px' }}>Your wishlist is empty</h2>
        <p style={{ fontSize: '14px', color: '#878787', marginBottom: '32px', maxWidth: '300px', lineHeight: 1.6 }}>
          Save products you love by clicking the ♡ heart icon on any product
        </p>
        <Link href="/" style={{ background: '#2874f0', color: 'white', padding: '12px 32px', borderRadius: '4px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(40,116,240,0.4)' }}>
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head><title>My Wishlist – Flipkart</title></Head>
      <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '20px 16px' }}>
        <div className="container">
          <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#212121', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={22} color="#ff4040" fill="#ff4040" /> My Wishlist ({items.length} items)
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {items.map(item => {
              const product = item.product;
              const isRemoving = removingItems.has(product.id);
              const isAddingToCart = addingCart.has(product.id);

              return (
                <div key={item.id} className="card" style={{ opacity: isRemoving ? 0.5 : 1, transition: 'all 0.3s', transform: isRemoving ? 'scale(0.95)' : 'scale(1)', position: 'relative' }}>
                  {/* Remove btn */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    disabled={isRemoving}
                    style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#ffebee'}
                    onMouseOut={e => e.currentTarget.style.background = 'white'}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={14} color="#ff4040" />
                  </button>

                  <Link href={`/product/${product.id}`}>
                    <div style={{ background: '#f9f9f9', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                      <img src={product.image_url || 'https://placehold.co/200x200'} alt={product.name} style={{ maxHeight: '168px', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                  </Link>

                  <div style={{ padding: '14px' }}>
                    <Link href={`/product/${product.id}`}>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#212121', lineHeight: 1.4, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.name}
                      </p>
                    </Link>

                    {product.rating > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <span className="star-rating">{product.rating.toFixed(1)} ★</span>
                        <span style={{ fontSize: '12px', color: '#878787' }}>({product.rating_count.toLocaleString()})</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: '#212121' }}>₹{product.price.toLocaleString()}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span style={{ fontSize: '13px', color: '#878787', textDecoration: 'line-through' }}>₹{product.original_price.toLocaleString()}</span>
                      )}
                      {product.discount_percent > 0 && (
                        <span style={{ fontSize: '13px', color: '#26a541', fontWeight: 600 }}>{product.discount_percent}% off</span>
                      )}
                    </div>

                    <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px' }}>
                      Added {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>

                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={isAddingToCart || product.stock === 0}
                      style={{ width: '100%', padding: '10px', background: product.stock === 0 ? '#ccc' : (isAddingToCart ? '#1a5dc8' : '#2874f0'), color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: product.stock === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                    >
                      <ShoppingCart size={14} />
                      {product.stock === 0 ? 'Out of Stock' : (isAddingToCart ? 'Adding...' : 'Add to Cart')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(WishlistPage);
