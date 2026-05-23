import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch {}
    };
    fetch();
  }, [id]);

  return (
    <div className="page">
      <div className="container">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h1 className="success-title">Order Placed!</h1>
          <p className="success-subtitle">Thank you for your purchase. Your order has been received.</p>
          {order && (
            <div className="order-info card">
              <div className="order-info-row">
                <span>Order ID</span>
                <span className="order-id">{order._id}</span>
              </div>
              <div className="order-info-row">
                <span>Total</span>
                <span><strong>${order.totalPrice.toFixed(2)}</strong></span>
              </div>
              <div className="order-info-row">
                <span>Payment</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="order-info-row">
                <span>Shipping to</span>
                <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
              </div>
            </div>
          )}
          <div className="success-actions">
            <Link to="/orders" className="btn btn-outline">View My Orders</Link>
            <Link to="/" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
