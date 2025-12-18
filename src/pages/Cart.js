import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import './Cart.css';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Please Login</h2>
            <p>You need to be logged in to view your cart</p>
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

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FaShoppingBag className="empty-icon" />
            <h2>Your Cart is Empty</h2>
            <p>Add some products to your cart to see them here</p>
            <Link to="/products">
              <Button variant="primary">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={handleClearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div className="item-image">
                  <img
                    src={item.product.images?.[0] || '/placeholder-product.png'}
                    alt={item.product.name}
                  />
                </div>

                <div className="item-details">
                  <Link to={`/product/${item.product._id}`} className="item-name">
                    {item.product.name}
                  </Link>
                  <p className="item-brand">{item.product.brand}</p>
                  <p className="item-price">{formatPrice(item.price)}</p>
                  {item.product.stock < 5 && item.product.stock > 0 && (
                    <p className="low-stock">Only {item.product.stock} left in stock</p>
                  )}
                  {item.product.stock === 0 && (
                    <p className="out-of-stock">Out of stock</p>
                  )}
                </div>

                <div className="item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      className="qty-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      className="qty-btn"
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>

                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="remove-btn"
                    aria-label="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal ({cart.items.length} items)</span>
              <span>{formatPrice(cart.totalAmount)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(cart.totalAmount)}</span>
            </div>

            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={() => alert('Checkout functionality coming soon!')}
            >
              Proceed to Checkout
            </Button>

            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
