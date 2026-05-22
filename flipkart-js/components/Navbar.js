'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ShoppingCart, Heart, Package, Search, Menu, X, User, ChevronDown, LogOut, LogIn } from 'lucide-react';
import { getCart, getWishlist } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const fetchCounts = async () => {
    if (!isAuthenticated) { setCartCount(0); setWishlistCount(0); return; }
    try {
      const [cart, wishlist] = await Promise.all([getCart(), getWishlist()]);
      setCartCount(cart.total_items);
      setWishlistCount(wishlist.total);
    } catch {}
  };

  useEffect(() => {
    fetchCounts();
    window.addEventListener('cart-updated', fetchCounts);
    window.addEventListener('wishlist-updated', fetchCounts);
    return () => {
      window.removeEventListener('cart-updated', fetchCounts);
      window.removeEventListener('wishlist-updated', fetchCounts);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinkStyle = {
    padding: '6px 12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '4px',
    transition: 'background 0.2s',
    position: 'relative',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  const firstName = user?.name?.split(' ')[0] || 'Account';

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'linear-gradient(135deg, #2874f0 0%, #1a5dc8 100%)',
      boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.15)',
      transition: 'box-shadow 0.3s ease',
    }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', height: '56px', gap: '16px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', flexDirection: 'column', minWidth: 'fit-content' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px', lineHeight: 1 }}>
              Flipkart
            </span>
            <span style={{ color: '#ffe066', fontSize: '10px', fontStyle: 'italic', fontWeight: 500 }}>
              ⚡ Explore <span style={{ textDecoration: 'underline' }}>Plus</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '680px' }}>
            <div style={{ position: 'relative', display: 'flex' }}>
              <input
                id="search-input"
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '10px 48px 10px 16px',
                  borderRadius: '2px', border: 'none', fontSize: '14px',
                  outline: 'none', color: '#333', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
              <button type="submit" style={{
                position: 'absolute', right: 0, top: 0, bottom: 0, width: '44px',
                background: 'linear-gradient(135deg, #2874f0, #1557d0)',
                border: 'none', borderRadius: '0 2px 2px 0', color: 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hide-mobile">

            {/* User menu */}
            {isAuthenticated ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen(v => !v)}
                  style={{ ...navLinkStyle, background: userMenuOpen ? 'rgba(255,255,255,0.15)' : 'transparent', border: 'none' }}
                >
                  <User size={16} />
                  {firstName}
                  <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: userMenuOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'white', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    minWidth: '200px', padding: '8px', zIndex: 100,
                    animation: 'fadeSlideDown 0.15s ease',
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', marginBottom: '4px' }}>
                      <p style={{ fontWeight: 700, fontSize: '14px', color: '#212121' }}>{user.name}</p>
                      <p style={{ fontSize: '12px', color: '#878787', marginTop: '2px' }}>{user.email}</p>
                    </div>
                    <Link href="/orders" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: '#212121', fontSize: '14px', fontWeight: 500, borderRadius: '6px', transition: 'background 0.15s' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <Package size={16} color="#2874f0" /> My Orders
                    </Link>
                    <button
                      id="logout-btn"
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: '#ff4040', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px', transition: 'background 0.15s', fontFamily: 'Inter, sans-serif' }}
                      onMouseOver={e => e.currentTarget.style.background = '#fff0f0'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" style={{ ...navLinkStyle, background: 'white', color: '#2874f0' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                <LogIn size={16} /> Login
              </Link>
            )}

            <Link href="/orders" style={navLinkStyle}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <Package size={16} /> Orders
            </Link>

            <Link href="/wishlist" style={{ ...navLinkStyle }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <Heart size={16} /> Wishlist
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute', top: '4px', right: '6px',
                  background: '#ff4040', color: 'white', borderRadius: '50%',
                  width: '16px', height: '16px', fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" style={{ ...navLinkStyle }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <ShoppingCart size={16} /> Cart
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '4px', right: '8px',
                  background: '#ff6161', color: 'white', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '11px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', color: 'white', padding: '8px', border: 'none' }}
            className="show-mobile"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div style={{ background: 'white', borderTop: '1px solid #eee', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {isAuthenticated ? (
            <>
              <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid #f0f0f0', marginBottom: '4px' }}>
                <p style={{ fontWeight: 700, fontSize: '14px' }}>{user.name}</p>
                <p style={{ fontSize: '12px', color: '#878787' }}>{user.email}</p>
              </div>
              <Link href="/orders" style={{ padding: '12px', color: '#212121', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setMobileMenuOpen(false)}>
                <Package size={18} /> My Orders
              </Link>
              <Link href="/wishlist" style={{ padding: '12px', color: '#212121', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setMobileMenuOpen(false)}>
                <Heart size={18} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <Link href="/cart" style={{ padding: '12px', color: '#212121', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart size={18} /> Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              <button onClick={() => { setMobileMenuOpen(false); logout(); }} style={{ padding: '12px', color: '#ff4040', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ padding: '12px', color: '#2874f0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setMobileMenuOpen(false)}>
                <LogIn size={18} /> Login / Register
              </Link>
              <Link href="/orders" style={{ padding: '12px', color: '#212121', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setMobileMenuOpen(false)}>
                <Package size={18} /> Orders
              </Link>
              <Link href="/cart" style={{ padding: '12px', color: '#212121', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart size={18} /> Cart
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
