import React, { createContext, useState, useContext, useEffect } from 'react';
import { wishlistAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist({ products: [] });
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      setError(null);
      const response = await wishlistAPI.addToWishlist({ productId });
      setWishlist(response.data);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add to wishlist';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setError(null);
      const response = await wishlistAPI.removeFromWishlist(productId);
      setWishlist(response.data);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to remove from wishlist';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.products.some(product => product._id === productId);
  };

  const value = {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist,
    wishlistCount: wishlist.products.length
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
