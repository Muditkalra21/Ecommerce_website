import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Products ────────────────────────────────────────────────────────────────

export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
  });
  const { data } = await api.get(`/api/products?${params.toString()}`);
  return data;
};

export const getProduct = async (id) => {
  const { data } = await api.get(`/api/products/${id}`);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get('/api/products/categories');
  return data;
};

// ─── Cart ─────────────────────────────────────────────────────────────────────

export const getCart = async () => {
  const { data } = await api.get('/api/cart');
  return data;
};

export const addToCart = async (productId, quantity = 1) => {
  const { data } = await api.post('/api/cart', { product_id: productId, quantity });
  return data;
};

export const updateCartItem = async (itemId, quantity) => {
  const { data } = await api.put(`/api/cart/${itemId}`, { quantity });
  return data;
};

export const removeFromCart = async (itemId) => {
  await api.delete(`/api/cart/${itemId}`);
};

export const clearCart = async () => {
  await api.delete('/api/cart');
};

// ─── Orders ─────────────────────────────────────────────────────────────────

export const getOrders = async () => {
  const { data } = await api.get('/api/orders');
  return data;
};

export const placeOrder = async (shippingAddress, paymentMethod = 'Cash on Delivery', customerEmail = null) => {
  const { data } = await api.post('/api/orders', {
    shipping_address: shippingAddress,
    payment_method: paymentMethod,
    ...(customerEmail && { customer_email: customerEmail }),
  });
  return data;
};

export const getOrder = async (id) => {
  const { data } = await api.get(`/api/orders/${id}`);
  return data;
};

// ─── Wishlist ────────────────────────────────────────────────────────────────

export const getWishlist = async () => {
  const { data } = await api.get('/api/wishlist');
  return data;
};

export const addToWishlist = async (productId) => {
  const { data } = await api.post('/api/wishlist', { product_id: productId });
  return data;
};

export const removeFromWishlist = async (productId) => {
  await api.delete(`/api/wishlist/product/${productId}`);
};
