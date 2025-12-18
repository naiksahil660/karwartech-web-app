import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaArrowLeft } from 'react-icons/fa';
import { productAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/helpers';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import ProductCard from '../components/common/ProductCard';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      setProduct(response.data);

      // Fetch related products from the same category
      const relatedResponse = await productAPI.getAllProducts({
        category: response.data.category,
        limit: 8
      });

      // Filter out the current product from related products
      const filtered = relatedResponse.data.products.filter(p => p._id !== id);
      setRelatedProducts(filtered.slice(0, 4));
    } catch (err) {
      setError('Failed to load product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(product._id, quantity);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>{error || 'Product not found'}</h2>
            <Button onClick={() => navigate('/products')}>Back to Products</Button>
          </div>
        </div>
      </div>
    );
  }

  // Combine mainImage with other images for the gallery
  const productImages = [];

  // Add main image first
  if (product.mainImage) {
    productImages.push(product.mainImage);
  }

  // Add other images
  if (product.images && product.images.length > 0) {
    productImages.push(...product.images);
  }

  // Fallback to placeholder if no images
  if (productImages.length === 0) {
    productImages.push('/placeholder-product.png');
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="product-detail-layout">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={productImages[selectedImage]} alt={product.name} />
              <button
                className="wishlist-toggle-btn"
                onClick={handleWishlistToggle}
              >
                {isInWishlist(product._id) ? (
                  <FaHeart className="filled" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
            </div>
            <div className="thumbnail-images">
              {productImages.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`${product.name} view ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <span className="product-brand">{product.brand}</span>
              <h1 className="product-title">{product.name}</h1>

              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(product.rating || 0) ? 'filled' : ''}
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {product.rating || 0} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <div className="product-pricing">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="original-price">{formatPrice(product.originalPrice)}</span>
                  <span className="discount-badge">{product.discount}% OFF</span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {product.stock === 0 ? (
                <span className="out-of-stock">Out of Stock</span>
              ) : product.stock < 5 ? (
                <span className="low-stock">Only {product.stock} left in stock!</span>
              ) : (
                <span className="in-stock">In Stock</span>
              )}
            </div>

            {/* Condition Badge */}
            {product.condition && product.condition !== 'new' && (
              <div className="condition-badge">
                Condition: <strong>{product.condition}</strong>
              </div>
            )}

            {/* Description */}
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="product-specifications">
                <h3>Specifications</h3>
                <div className="specs-grid">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-key">{key}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
                  <span>{quantity}</span>
                  <button onClick={incrementQuantity} disabled={quantity >= product.stock}>+</button>
                </div>
              </div>

              <div className="action-buttons">
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  fullWidth
                >
                  <FaShoppingCart /> Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
