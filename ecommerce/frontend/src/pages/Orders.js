import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="page"><div className="spinner"/></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No orders yet</p>
            <Link to="/" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-row card">
                <div className="order-row-main">
                  <div>
                    <span className="order-row-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-row-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="order-row-items">
                    {order.orderItems.map((item) => (
                      <img key={item._id} src={item.image} alt={item.name} className="order-thumb" />
                    ))}
                    <span className="order-item-count">{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="order-row-meta">
                  <span className="order-row-total">${order.totalPrice.toFixed(2)}</span>
                  <span className={`order-status ${order.isDelivered ? 'delivered' : order.isPaid ? 'paid' : 'pending'}`}>
                    {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
