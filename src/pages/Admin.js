import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../utils/api';
import { FaBox, FaTags, FaBuilding, FaExclamationTriangle, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import './Admin.css';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    originalPrice: '',
    discountedPrice: '',
    discountPercentage: '',
    category: 'new-phone',
    specifications: {},
    featured: false,
    topItem: false
  });
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [otherImagePreviews, setOtherImagePreviews] = useState([]);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const categories = [
    { value: 'new-phone', label: 'New Phone' },
    { value: 'used-phone', label: 'Used Phone' },
    { value: 'new-laptop', label: 'New Laptop' },
    { value: 'used-laptop', label: 'Used Laptop' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile-accessories', label: 'Mobile Accessories' },
    { value: 'laptop-accessories', label: 'Laptop Accessories' },
    { value: 'speaker', label: 'Speaker' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/login');
      return;
    }

    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getProducts()
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data.products);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setMessage({ type: 'error', text: 'Failed to load admin data' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-calculate discount percentage when prices change
    if (name === 'discountedPrice' && formData.originalPrice) {
      const original = parseFloat(formData.originalPrice);
      const discounted = parseFloat(value);
      if (original > 0 && discounted > 0) {
        const percentage = Math.round(((original - discounted) / original) * 100);
        setFormData(prev => ({ ...prev, discountPercentage: percentage.toString() }));
      }
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setOtherImages(prev => [...prev, ...files].slice(0, 5));
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setOtherImagePreviews(prev => [...prev, ...newPreviews].slice(0, 5));
    }
  };

  const removeOtherImage = (index) => {
    setOtherImages(prev => prev.filter((_, i) => i !== index));
    setOtherImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim()
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      originalPrice: '',
      discountedPrice: '',
      discountPercentage: '',
      category: 'new-phone',
      specifications: {},
      featured: false,
      topItem: false
    });
    setMainImage(null);
    setOtherImages([]);
    setMainImagePreview(null);
    setOtherImagePreviews([]);
    setSpecKey('');
    setSpecValue('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.brand || !formData.originalPrice) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    if (!mainImage) {
      setMessage({ type: 'error', text: 'Please upload a main image' });
      return;
    }

    try {
      setUploadLoading(true);
      setMessage({ type: '', text: '' });

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('brand', formData.brand);
      submitData.append('originalPrice', formData.originalPrice);
      submitData.append('discountedPrice', formData.discountedPrice || formData.originalPrice);
      submitData.append('discountPercentage', formData.discountPercentage || '0');
      submitData.append('category', formData.category);
      submitData.append('specifications', JSON.stringify(formData.specifications));
      submitData.append('featured', formData.featured);
      submitData.append('topItem', formData.topItem);
      submitData.append('mainImage', mainImage);

      otherImages.forEach(image => {
        submitData.append('otherImages', image);
      });

      await adminAPI.uploadProduct(submitData);

      setMessage({ type: 'success', text: 'Product uploaded successfully!' });
      resetForm();
      setShowUploadForm(false);
      fetchData();
    } catch (error) {
      console.error('Error uploading product:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload product' });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await adminAPI.deleteProduct(productId);
      setMessage({ type: 'success', text: 'Product deleted successfully!' });
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage({ type: 'error', text: 'Failed to delete product' });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.name}</p>
      </div>

      {message.text && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <FaBox className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
          <div className="stat-card">
            <FaTags className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.totalCategories}</h3>
              <p>Categories</p>
            </div>
          </div>
          <div className="stat-card">
            <FaBuilding className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.totalBrands}</h3>
              <p>Brands</p>
            </div>
          </div>
          <div className="stat-card warning">
            <FaExclamationTriangle className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.lowStockProducts}</h3>
              <p>Low Stock</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Button */}
      <div className="admin-actions">
        <button
          className="btn-add-product"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          <FaPlus /> {showUploadForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="upload-form-container">
          <h2>Upload New Product</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Brand/Company *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Enter brand name"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Original Price (₹) *</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="Enter original price"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Discounted Price (₹)</label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleInputChange}
                  placeholder="Enter discounted price"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Discount %</label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  placeholder="Auto-calculated"
                  min="0"
                  max="100"
                  readOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Display Options */}
            <div className="form-row checkbox-row">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  />
                  <span>Featured Product</span>
                </label>
                <small>Show in Featured Products section on Home page</small>
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="topItem"
                    checked={formData.topItem}
                    onChange={(e) => setFormData(prev => ({ ...prev, topItem: e.target.checked }))}
                  />
                  <span>Top Item</span>
                </label>
                <small>Show in Top Items Today section on Home page</small>
              </div>
            </div>

            {/* Main Image Upload */}
            <div className="form-group">
              <label>Main Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                required={!mainImage}
              />
              {mainImagePreview && (
                <div className="image-preview main-preview">
                  <img src={mainImagePreview} alt="Main preview" />
                </div>
              )}
            </div>

            {/* Other Images Upload */}
            <div className="form-group">
              <label>Other Images (up to 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleOtherImagesChange}
                disabled={otherImages.length >= 5}
              />
              {otherImagePreviews.length > 0 && (
                <div className="image-previews">
                  {otherImagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeOtherImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="form-group">
              <label>Specifications</label>
              <div className="spec-input-row">
                <input
                  type="text"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  placeholder="Spec name (e.g., RAM)"
                />
                <input
                  type="text"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  placeholder="Spec value (e.g., 8GB)"
                />
                <button type="button" onClick={addSpecification} className="btn-add-spec">
                  Add
                </button>
              </div>
              {Object.keys(formData.specifications).length > 0 && (
                <div className="specifications-list">
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span><strong>{key}:</strong> {value}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecification(key)}
                        className="btn-remove-spec"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={uploadLoading}
            >
              {uploadLoading ? 'Uploading...' : 'Upload Product'}
            </button>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="products-section">
        <h2>All Products ({products.length})</h2>
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.mainImage || product.images?.[0] || '/placeholder.png'}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>
                    <span className="price">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">₹{product.originalPrice}</span>
                    )}
                  </td>
                  <td>{product.discount || 0}%</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(product._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="7" className="no-products">
                    No products found. Add your first product!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
