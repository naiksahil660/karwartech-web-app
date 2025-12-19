import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';
import { FaMobileAlt, FaLaptop, FaDesktop, FaHeadphones, FaTools, FaTag, FaGift } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [topItems, setTopItems] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const offers = [
    {
      id: 1,
      icon: <FaTag />,
      title: 'Special Discount',
      description: 'Get up to 25% off on selected mobiles and laptops',
      color: '#DC143C'
    },
    {
      id: 2,
      icon: <FaGift />,
      title: 'Free Screen Guard',
      description: 'Free screen guard with every new phone purchase',
      color: '#FF6B35'
    },
    {
      id: 3,
      icon: <FaTools />,
      title: 'Repair Offer',
      description: '15% off on all repair services this month',
      color: '#F7931E'
    }
  ];

  const heroSlides = [
    {
      id: 1,
      title: 'Welcome to Karwar Tech',
      subtitle: 'Your Trusted Destination for Mobiles, Laptops & Expert Repair Services',
      type: 'gradient'
    },
    {
      id: 2,
      title: 'Latest Flagship Phones',
      subtitle: 'Discover cutting-edge technology with premium devices from top brands',
      brand: 'Premium Devices',
      type: 'brand'
    },
    {
      id: 3,
      title: 'Expert Repair Services',
      subtitle: 'Professional phone and laptop repairs with genuine parts and warranty',
      brand: 'Quality Service',
      type: 'service'
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 4000);

    return () => clearInterval(slideInterval);
  }, [offers.length]);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(heroInterval);
  }, [heroSlides.length]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const [topItemsRes, featuredRes, latestRes] = await Promise.all([
        productAPI.getAllProducts({ topItem: 'true' }),
        productAPI.getAllProducts({ featured: 'true' }),
        productAPI.getAllProducts({ sort: 'newest' })
      ]);

      setTopItems(topItemsRes.data.products);
      setFeaturedProducts(featuredRes.data.products);
      setLatestProducts(latestRes.data.products);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      name: 'New Phones',
      icon: <FaMobileAlt />,
      path: '/products?category=new-phone',
      color: '#DC143C'
    },
    {
      name: 'New Laptops',
      icon: <FaLaptop />,
      path: '/products?category=new-laptop',
      color: '#FF6B35'
    },
    {
      name: 'Desktops',
      icon: <FaDesktop />,
      path: '/products?category=desktop',
      color: '#F7931E'
    },
    {
      name: 'Accessories',
      icon: <FaHeadphones />,
      path: '/products?category=mobile-accessories',
      color: '#00A8E8'
    },
    {
      name: 'Repair Services',
      icon: <FaTools />,
      path: '/services',
      color: '#4CAF50'
    }
  ];

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="home">
      <SEO
        title="Best Mobile & Laptop Shop in Karwar"
        description="Karwar Tech is your trusted destination for new & used mobiles, laptops, desktops, and accessories in Karwar. Expert repair services with genuine parts. Best prices guaranteed!"
        keywords="mobile shop Karwar, laptop shop Karwar, phone repair Karwar, laptop repair Karwar, buy mobile Karwar, Samsung phones Karwar, iPhone Karwar, used phones Karwar"
        url="/"
      />
      <section className="hero-section">
        <div className="hero-overlay"></div>

        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === heroSlide ? 'active' : ''} hero-slide-${slide.type}`}
          >
            <div className="hero-content container">
              {slide.brand && <div className="hero-brand">{slide.brand}</div>}
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <div className="hero-buttons">
                <Link to="/products">
                  <Button variant="primary" size="large">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="secondary" size="large">
                    Our Services
                  </Button>
                </Link>
              </div>
            </div>

            {slide.type === 'brand' && (
              <div className="hero-visual">
                <div className="phone-mockup">
                  <FaMobileAlt />
                </div>
              </div>
            )}

            {slide.type === 'service' && (
              <div className="hero-visual">
                <div className="service-mockup">
                  <FaTools />
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="hero-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === heroSlide ? 'active' : ''}`}
              onClick={() => setHeroSlide(index)}
              aria-label={`Go to hero slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="offers-slider">
        <div className="container">
          <div className="slider-container">
            {offers.map((offer, index) => (
              <div
                key={offer.id}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundColor: `${offer.color}15` }}
              >
                <div className="slide-icon" style={{ color: offer.color }}>
                  {offer.icon}
                </div>
                <div className="slide-content">
                  <h3 className="slide-title">{offer.title}</h3>
                  <p className="slide-description">{offer.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="slider-dots">
            {offers.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Browse Categories</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="category-card"
                style={{ borderColor: category.color }}
              >
                <div className="category-icon" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <h3 className="category-name">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {topItems.length > 0 && (
        <section className="products-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Top Items Today</h2>
              <Link to="/products">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="products-grid">
              {topItems.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="products-section featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Products</h2>
              <Link to="/products?featured=true">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="products-grid">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {latestProducts.length > 0 && (
        <section className="products-section latest-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Latest Products</h2>
              <Link to="/products">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="products-grid">
              {latestProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="services-banner">
        <div className="container">
          <div className="banner-content">
            <h2>Need Device Repair?</h2>
            <p>
              Expert mobile and laptop repair services with genuine parts and warranty.
              Book your appointment today!
            </p>
            <Link to="/services">
              <Button variant="primary" size="large">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      )}
    </div>
  );
};

export default Home;
