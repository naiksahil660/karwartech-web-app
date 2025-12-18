import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeDropdown();
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        closeDropdown();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const categories = [
    { name: 'New Phones', path: '/products?category=new-phone' },
    { name: 'Used Phones', path: '/products?category=used-phone' },
    { name: 'New Laptops', path: '/products?category=new-laptop' },
    { name: 'Used Laptops', path: '/products?category=used-laptop' },
    { name: 'Desktops', path: '/products?category=desktop' },
    { name: 'Accessories', path: '/products?category=accessories' }
  ];

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path.includes('?')) {
      const [pathname, query] = path.split('?');
      return location.pathname === pathname && location.search.includes(query);
    }
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src="/karwar tech logo (1).png" alt="Karwar Tech" className="logo-image" />
          <span className="logo-text">Karwar Tech</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>

        <div className="navbar-icons">
          {isAuthenticated ? (
            <div className="user-dropdown">
              <button className="icon-button" onClick={toggleDropdown}>
                <FaUser />
                <span className="icon-label">Account</span>
              </button>
              <div className={`dropdown-menu ${isDropdownOpen ? 'active' : ''}`}>
                <div className="dropdown-menu-content">
                  <Link to="/profile" className="dropdown-item" onClick={closeDropdown}>Profile</Link>
                  <Link to="/orders" className="dropdown-item" onClick={closeDropdown}>My Orders</Link>
                  <Link to="/appointments" className="dropdown-item" onClick={closeDropdown}>Appointments</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item" onClick={closeDropdown}>Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item">Logout</button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="icon-button">
              <FaUser />
              <span className="icon-label">Login</span>
            </Link>
          )}

          <Link to="/wishlist" className="icon-button">
            <FaHeart />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            <span className="icon-label">Wishlist</span>
          </Link>

          <Link to="/cart" className="icon-button">
            <FaShoppingCart />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
            <span className="icon-label">Cart</span>
          </Link>

          <button className="icon-button theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
            <span className="icon-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        <button className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="navbar-bottom">
        <div className="container">
          <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link
              to="/"
              className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className={`nav-link ${isActiveLink(category.path) ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {category.name}
              </Link>
            ))}

            <Link
              to="/services"
              className={`nav-link ${isActiveLink('/services') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Services
            </Link>
            <Link
              to="/about"
              className={`nav-link ${isActiveLink('/about') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`nav-link ${isActiveLink('/contact') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Contact
            </Link>

            {isMobileMenuOpen && (
              <form className="mobile-search" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <FaSearch />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
