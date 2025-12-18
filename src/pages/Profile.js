import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaKey } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="not-logged-in">
            <FaUser size={64} />
            <h2>Please Login</h2>
            <p>You need to be logged in to view your profile</p>
            <Link to="/login">
              <Button variant="primary" size="large">Login Now</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading fullScreen />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // TODO: Implement API call to update user profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
    // In real implementation, this would call an API endpoint
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser size={48} />
          </div>
          <div className="profile-header-info">
            <h1>My Profile</h1>
            <p>Manage your account information</p>
          </div>
        </div>

        <div className="profile-layout">
          {/* Profile Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>
                <FaUser /> Personal Information
              </h2>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit /> Edit Profile
                </Button>
              )}
            </div>

            <div className="profile-info-grid">
              <div className="info-item">
                <label>
                  <FaUser /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{user?.name || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label>
                  <FaEnvelope /> Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{user?.email || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label>
                  <FaPhone /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{user?.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item full-width">
                <label>
                  <FaMapMarkerAlt /> Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="profile-input"
                    rows="3"
                  />
                ) : (
                  <p>{user?.address || 'Not provided'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="edit-actions">
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Quick Links Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-card">
              <h3>Quick Actions</h3>
              <div className="quick-links">
                <Link to="/orders" className="quick-link">
                  My Orders
                </Link>
                <Link to="/wishlist" className="quick-link">
                  My Wishlist
                </Link>
                <Link to="/cart" className="quick-link">
                  Shopping Cart
                </Link>
                <Link to="/appointments" className="quick-link">
                  My Appointments
                </Link>
              </div>
            </div>

            <div className="profile-card">
              <h3>Security</h3>
              <Button variant="outline" size="small" className="full-width">
                <FaKey /> Change Password
              </Button>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Member Since</span>
                <span className="stat-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Account Status</span>
                <span className="stat-value status-active">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
