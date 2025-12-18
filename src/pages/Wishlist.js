import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="empty-wishlist">
            <h2>Please Login</h2>
            <p>You need to be logged in to view your wishlist</p>
            <Link to="/login">
              <Button variant="primary">Login Now</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading fullScreen />;
  }

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleMoveToCart = async (product) => {
    const result = await addToCart(product._id, 1);
    if (result.success) {
      await removeFromWishlist(product._id);
    }
  };

  if (!wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="empty-wishlist">
            <FaHeart className="empty-icon" />
            <h2>Your Wishlist is Empty</h2>
            <p>Save your favorite products to wishlist</p>
            <Link to="/products">
              <Button variant="primary">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p className="wishlist-count">
            {wishlist.products.length} {wishlist.products.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="wishlist-grid">
          {wishlist.products.map((product) => (
            <div key={product._id} className="wishlist-card">
              <button
                onClick={() => handleRemove(product._id)}
                className="remove-wishlist-btn"
                aria-label="Remove from wishlist"
              >
                <FaTrash />
              </button>

              <Link to={`/product/${product._id}`} className="wishlist-image-link">
                <div className="wishlist-image">
                  <img
                    src={product.images?.[0] || '/placeholder-product.png'}
                    alt={product.name}
                  />
                </div>
              </Link>

              <div className="wishlist-info">
                <Link to={`/product/${product._id}`} className="wishlist-name">
                  {product.name}
                </Link>

                <p className="wishlist-brand">{product.brand}</p>

                <div className="wishlist-pricing">
                  <span className="wishlist-price">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="wishlist-original-price">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {product.stock === 0 ? (
                  <div className="out-of-stock-badge">Out of Stock</div>
                ) : product.stock < 5 ? (
                  <div className="low-stock-badge">Only {product.stock} left</div>
                ) : (
                  <div className="in-stock-badge">In Stock</div>
                )}

                <div className="wishlist-actions">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="move-to-cart-btn"
                    disabled={product.stock === 0}
                  >
                    <FaShoppingCart />
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
