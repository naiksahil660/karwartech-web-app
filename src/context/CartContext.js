import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], totalAmount: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      const response = await cartAPI.addToCart({ productId, quantity });
      setCart(response.data);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add to cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      setError(null);
      const response = await cartAPI.updateCartItem({ productId, quantity });
      setCart(response.data);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);
      const response = await cartAPI.removeFromCart(productId);
      setCart(response.data);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to remove from cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const response = await cartAPI.clearCart();
      setCart(response.data);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to clear cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getCartCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
    cartCount: getCartCount()
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
