import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import Loading from '../components/common/Loading';
import { getCategoryDisplayName } from '../utils/helpers';
import './Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: '',
    maxPrice: '',
    search: searchParams.get('q') || '',
    sort: 'newest'
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'new-phone', label: 'New Phones' },
    { value: 'used-phone', label: 'Used Phones' },
    { value: 'new-laptop', label: 'New Laptops' },
    { value: 'used-laptop', label: 'Used Laptops' },
    { value: 'desktop', label: 'Desktops' },
    { value: 'mobile-accessories', label: 'Mobile Accessories' },
    { value: 'laptop-accessories', label: 'Laptop Accessories' },
    { value: 'speaker', label: 'Speakers' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('q');

    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
    if (searchParam) {
      setFilters(prev => ({ ...prev, search: searchParam }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const response = await productAPI.getAllProducts(params);
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: 'newest'
    });
  };

  const getPageTitle = () => {
    if (filters.search) {
      return `Search Results for "${filters.search}"`;
    }
    if (filters.category) {
      return getCategoryDisplayName(filters.category);
    }
    return 'All Products';
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1 className="products-title">{getPageTitle()}</h1>
          <p className="products-count">
            {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
          </p>
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <h4>Category</h4>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="price-input"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="price-input"
                />
              </div>
            </div>

            {/* Sort Filter */}
            <div className="filter-group">
              <h4>Sort By</h4>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="filter-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-content">
            {error && (
              <div className="error-message">{error}</div>
            )}

            {!loading && products.length === 0 ? (
              <div className="no-products">
                <h2>No products found</h2>
                <p>Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
