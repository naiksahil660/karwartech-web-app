import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import Button from '../components/common/Button';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Hero Section */}
        <div className="contact-hero">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contact-layout">
          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Contact Information</h2>
            <p className="contact-intro">
              Have questions about our products or services? Need technical support? We're here to help!
            </p>

            <div className="contact-cards">
              <div className="contact-info-card">
                <div className="contact-card-icon">
                  <FaPhone />
                </div>
                <h3>Call Us</h3>
                <p>Give us a call for immediate assistance</p>
                <a href="tel:7619153350" className="contact-link">7619153350</a>
              </div>

              <div className="contact-info-card">
                <div className="contact-card-icon">
                  <FaEnvelope />
                </div>
                <h3>Email Us</h3>
                <p>Send us an email anytime</p>
                <a href="mailto:karwartech@gmail.com" className="contact-link">karwartech@gmail.com</a>
              </div>

              <div className="contact-info-card">
                <div className="contact-card-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3>Visit Us</h3>
                <p>Come visit our store</p>
                <a
                  href="https://maps.app.goo.gl/1Z6bVBK8JVLiqXovJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  View on Google Maps
                </a>
              </div>

              <div className="contact-info-card">
                <div className="contact-card-icon">
                  <FaClock />
                </div>
                <h3>Business Hours</h3>
                <p>Mon - Sat: 10:00 AM - 8:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div className="proprietor-info">
              <h3>Proprietor</h3>
              <p className="proprietor-name">Anshul Naik</p>
              <p className="proprietor-detail">Expert Technician & Business Owner</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>

            {success && (
              <div className="success-alert">
                <p>Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}

            {error && (
              <div className="error-alert">
                <p>{error}</p>
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your contact number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="6"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                disabled={loading}
              >
                <FaPaperPlane /> {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2>Find Us Here</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3846.123456789!2d74.123456789!3d14.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDA3JzI0LjQiTiA3NMKwMDcnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Karwar Tech Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
