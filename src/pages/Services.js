import React, { useState } from 'react';
import { FaMobileAlt, FaLaptop, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTools, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI } from '../utils/api';
import Button from '../components/common/Button';
import './Services.css';

const Services = () => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    serviceType: '',
    deviceType: '',
    deviceModel: '',
    issue: '',
    preferredDate: '',
    preferredTime: '',
    contactNumber: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const mobileServices = [
    { name: 'Display Replacement', icon: '📱', description: 'Screen repair and replacement' },
    { name: 'Charging Pin Change', icon: '🔌', description: 'Fix charging port issues' },
    { name: 'Battery Replacement', icon: '🔋', description: 'Replace worn-out batteries' },
    { name: 'Camera Repair', icon: '📷', description: 'Front and back camera fixes' },
    { name: 'Speaker Repair', icon: '🔊', description: 'Audio and speaker issues' },
    { name: 'Software Issues', icon: '⚙️', description: 'OS updates and bug fixes' }
  ];

  const laptopServices = [
    { name: 'SSD Installation', icon: '💾', description: 'Upgrade to faster storage' },
    { name: 'RAM Installation', icon: '🎯', description: 'Memory upgrade service' },
    { name: 'OS Migration', icon: '💻', description: 'Windows/Linux installation' },
    { name: 'Screen Replacement', icon: '🖥️', description: 'Laptop display repair' },
    { name: 'Keyboard Repair', icon: '⌨️', description: 'Fix broken keys' },
    { name: 'Cooling System', icon: '❄️', description: 'Fan cleaning and thermal paste' }
  ];

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

    if (!isAuthenticated) {
      setError('Please login to book a service appointment');
      return;
    }

    if (!formData.serviceType || !formData.deviceType || !formData.issue) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await appointmentAPI.createAppointment(formData);
      setSuccess(true);
      setFormData({
        serviceType: '',
        deviceType: '',
        deviceModel: '',
        issue: '',
        preferredDate: '',
        preferredTime: '',
        contactNumber: '',
        notes: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="services-page">
      <div className="container">
        {/* Hero Section */}
        <div className="services-hero">
          <h1>Expert Repair Services</h1>
          <p>Professional mobile and laptop repair services you can trust</p>
        </div>

        {/* Services Grid */}
        <div className="services-section">
          <div className="service-category">
            <div className="category-header">
              <FaMobileAlt className="category-icon" />
              <h2>Mobile Repair Services</h2>
            </div>
            <div className="services-grid">
              {mobileServices.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="service-category">
            <div className="category-header">
              <FaLaptop className="category-icon" />
              <h2>Laptop Repair Services</h2>
            </div>
            <div className="services-grid">
              {laptopServices.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="booking-section">
          <div className="booking-header">
            <FaTools className="booking-icon" />
            <h2>Book a Service Appointment</h2>
            <p>Fill out the form below and we'll get back to you shortly</p>
          </div>

          {success && (
            <div className="success-message">
              <FaCheckCircle />
              <p>Appointment booked successfully! We'll contact you soon.</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Service Type *</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Service Type</option>
                  <option value="Display Replacement">Display Replacement</option>
                  <option value="Charging Pin Change">Charging Pin Change</option>
                  <option value="Battery Replacement">Battery Replacement</option>
                  <option value="Camera Repair">Camera Repair</option>
                  <option value="Speaker Repair">Speaker Repair</option>
                  <option value="SSD Installation">SSD Installation</option>
                  <option value="RAM Installation">RAM Installation</option>
                  <option value="OS Migration">OS Migration</option>
                  <option value="Screen Replacement">Screen Replacement</option>
                  <option value="Keyboard Repair">Keyboard Repair</option>
                  <option value="Cooling System">Cooling System</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Device Type *</label>
                <select
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Device Type</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Tablet">Tablet</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Device Model</label>
                <input
                  type="text"
                  name="deviceModel"
                  value={formData.deviceModel}
                  onChange={handleChange}
                  placeholder="e.g., iPhone 13 Pro, Dell XPS 15"
                />
              </div>

              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preferred Date</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Preferred Time</label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                >
                  <option value="">Select Time</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                  <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                  <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                  <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Issue Description *</label>
              <textarea
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                placeholder="Describe the problem you're facing..."
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information..."
                rows="3"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="contact-info-section">
          <h2>Get in Touch</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <FaPhone className="contact-icon" />
              <h3>Phone</h3>
              <a href="tel:7619153350">7619153350</a>
            </div>

            <div className="contact-card">
              <FaEnvelope className="contact-icon" />
              <h3>Email</h3>
              <a href="mailto:karwartech@gmail.com">karwartech@gmail.com</a>
            </div>

            <div className="contact-card">
              <FaMapMarkerAlt className="contact-icon" />
              <h3>Location</h3>
              <a href="https://maps.app.goo.gl/1Z6bVBK8JVLiqXovJ" target="_blank" rel="noopener noreferrer">
                View on Map
              </a>
            </div>
          </div>

          <div className="business-owner">
            <p>Proprietor: <strong>Anshul Naik</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
