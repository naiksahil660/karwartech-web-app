import React from 'react';
import { FaMobileAlt, FaLaptop, FaTools, FaShippingFast, FaHeadset, FaShieldAlt } from 'react-icons/fa';
import SEO from '../components/common/SEO';
import './About.css';

const About = () => {
  const features = [
    {
      icon: <FaMobileAlt />,
      title: 'Wide Product Range',
      description: 'New and used phones, laptops, desktops, and accessories from top brands'
    },
    {
      icon: <FaTools />,
      title: 'Expert Repairs',
      description: 'Professional repair services for mobile phones and laptops with quality parts'
    },
    {
      icon: <FaShippingFast />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery service to get your products on time'
    },
    {
      icon: <FaHeadset />,
      title: 'Customer Support',
      description: '24/7 customer support to help you with any queries or concerns'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Quality Assurance',
      description: 'All products tested and certified for quality and performance'
    },
    {
      icon: <FaLaptop />,
      title: 'Tech Expertise',
      description: 'Years of experience in technology sales and service'
    }
  ];

  return (
    <div className="about-page">
      <SEO
        title="About Us - Karwar Tech"
        description="Learn about Karwar Tech - your trusted technology partner in Karwar. Founded by Anshul Naik, we offer quality mobiles, laptops, and expert repair services with years of experience."
        keywords="about Karwar Tech, Anshul Naik Karwar, mobile shop owner Karwar, electronics store Karwar, technology partner Karnataka"
        url="/about"
      />
      <div className="container">
        {/* Hero Section */}
        <div className="about-hero">
          <h1>About Karwar Tech</h1>
          <p className="hero-tagline">Your Trusted Technology Partner</p>
        </div>

        {/* Story Section */}
        <div className="about-story">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              Welcome to <strong>Karwar Tech</strong>, your one-stop destination for all things technology.
              Founded with a passion for innovation and customer satisfaction, we specialize in providing
              high-quality new and used mobile phones, laptops, desktops, and accessories.
            </p>
            <p>
              What sets us apart is not just our extensive product range, but also our commitment to
              excellence in service. As experienced technicians, we offer professional repair services
              for mobile phones and laptops, ensuring your devices stay in perfect working condition.
            </p>
            <p>
              At Karwar Tech, we believe in building long-term relationships with our customers by
              providing honest advice, quality products, and reliable after-sales support. Whether you're
              looking to buy the latest smartphone, upgrade your laptop, or get your device repaired,
              we're here to help.
            </p>
          </div>
          <div className="story-image">
            <img src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500" alt="Technology Store" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-section">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Proprietor Section */}
        <div className="proprietor-section">
          <div className="proprietor-card">
            <div className="proprietor-image">
              <img src="/IMG_4306.jpeg" alt="Anshul Naik" />
            </div>
            <div className="proprietor-info">
              <h2>Meet the Proprietor</h2>
              <h3>Anshul Naik</h3>
              <p className="proprietor-title">Founder & Lead Technician</p>
              <p className="proprietor-description">
                With years of experience in the technology industry and a passion for helping customers
                find the perfect tech solutions, Anshul Naik established Karwar Tech to bring quality
                products and expert services to the community. As a certified technician specializing in
                mobile and laptop repairs, Anshul ensures every customer receives personalized attention
                and professional service.
              </p>
              <div className="proprietor-specialties">
                <h4>Specializations:</h4>
                <ul>
                  <li>Mobile Phone Repairs (Screen replacement, charging port, battery)</li>
                  <li>Laptop Repairs (SSD installation, RAM upgrade, OS migration)</li>
                  <li>Hardware Diagnostics & Solutions</li>
                  <li>Product Consultation & Recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Services Overview */}
        <div className="services-overview">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-item">
              <FaMobileAlt className="service-icon" />
              <h3>Mobile Sales</h3>
              <p>New and used smartphones from top brands at competitive prices</p>
            </div>
            <div className="service-item">
              <FaLaptop className="service-icon" />
              <h3>Laptop & Desktop Sales</h3>
              <p>Wide range of laptops and desktops for every need and budget</p>
            </div>
            <div className="service-item">
              <FaTools className="service-icon" />
              <h3>Repair Services</h3>
              <p>Expert repair services for mobile phones and laptops</p>
            </div>
            <div className="service-item">
              <FaShieldAlt className="service-icon" />
              <h3>Accessories</h3>
              <p>Genuine accessories including cases, chargers, headphones, and more</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="contact-cta">
          <h2>Ready to Experience Quality Service?</h2>
          <p>Visit us or get in touch to discuss your technology needs</p>
          <div className="cta-buttons">
            <a href="/contact" className="cta-button primary">Contact Us</a>
            <a href="/services" className="cta-button secondary">Our Services</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
