import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaBox } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import './Orders.css';

const Orders = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="not-logged-in">
            <FaShoppingBag size={64} />
            <h2>Please Login</h2>
            <p>You need to be logged in to view your orders</p>
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
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>
            <FaShoppingBag /> My Orders
          </h1>
          <p>Track and manage your orders</p>
        </div>

        <div className="empty-orders">
          <FaBox size={80} />
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Start shopping now!</p>
          <Link to="/products">
            <Button variant="primary" size="large">Browse Products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Orders;
