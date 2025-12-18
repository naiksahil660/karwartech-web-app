import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTools } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import './Appointments.css';

const Appointments = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="appointments-page">
        <div className="container">
          <div className="not-logged-in">
            <FaCalendarAlt size={64} />
            <h2>Please Login</h2>
            <p>You need to be logged in to view your appointments</p>
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

  return (
    <div className="appointments-page">
      <div className="container">
        <div className="appointments-header">
          <h1>
            <FaCalendarAlt /> My Appointments
          </h1>
          <p>Manage your service appointments and repairs</p>
        </div>

        <div className="empty-appointments">
          <FaTools size={80} />
          <h2>No Appointments Yet</h2>
          <p>You haven't booked any service appointments. Need a repair?</p>
          <Link to="/services">
            <Button variant="primary" size="large">Book Service</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
