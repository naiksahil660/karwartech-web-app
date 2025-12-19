import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-section">
          <h3 className="footer-title">Karwar Tech</h3>
          <p className="footer-description">
            Your trusted destination for new and used mobiles, laptops, and accessories.
            Expert repair services for all your devices.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/products">All Products</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Categories</h4>
          <ul className="footer-links">
            <li><Link to="/products?category=new-phone">New Phones</Link></li>
            <li><Link to="/products?category=used-phone">Used Phones</Link></li>
            <li><Link to="/products?category=new-laptop">New Laptops</Link></li>
            <li><Link to="/products?category=used-laptop">Used Laptops</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contact Info</h4>
          <ul className="contact-info">
            <li>
              <FaMapMarkerAlt />
              <span>Karwar, Karnataka, India</span>
            </li>
            <li>
              <FaPhone />
              <a href="tel:+917619153350">+91 76191 53350</a>
            </li>
            <li>
              <FaEnvelope />
              <a href="mailto:karwartech@gmail.com">karwartech@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} Karwar Tech. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
