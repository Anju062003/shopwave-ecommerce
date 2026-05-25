import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shipping = cartTotal > 100 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!form.address || !form.city || !form.postalCode || !form.country) {
      setError('Please fill all shipping fields.');
      return false;
    }
    return true;
  };

  const placeOrder = async (paymentResult = null) => {
    try {
      setLoading(true);
      setError('');
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id, name: item.name, image: item.image,
          price: item.price, quantity: item.qty,
        })),
        shippingAddress: form,
        paymentMethod,
        paymentResult,
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      };
      const { data } = await API.post('/api/orders', orderData);
      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    await placeOrder();
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        <div className="checkout-layout">
          <div className="checkout-form">
            <div className="card" style={{padding: 28}}>
              <h3 className="section-title">Shipping Address</h3>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input className="form-input" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" name="city" value={form.city} onChange={handleChange} placeholder="New York" />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input className="form-input" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="10001" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input className="form-input" name="country" value={form.country} onChange={handleChange} placeholder="United States" />
              </div>
            </div>

            <div className="card" style={{padding: 28, marginTop: 16}}>
              <h3 className="section-title">Payment Method</h3>
              {['Cash on Delivery', 'PayPal'].map((method) => (
                <label key={method} className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)} />
                  <span>{method}</span>
                </label>
              ))}

              {paymentMethod === 'PayPal' && (
                <div style={{marginTop: 20}}>
                  <PayPalScriptProvider options={{
                    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                    currency: "INR",
                    intent: "capture",
                    components: "buttons"
                  }}>
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      disabled={!form.address || !form.city || !form.postalCode || !form.country}
                      createOrder={(data, actions) => {
                        if (!validateForm()) return;
                        return actions.order.create({
                          purchase_units: [{
                            amount: { value: total.toFixed(2) }
                          }]
                        });
                      }}
                      onApprove={async (data, actions) => {
                        const details = await actions.order.capture();
                        await placeOrder({
                          id: details.id,
                          status: details.status,
                          email: details.payer.email_address,
                          updateTime: details.update_time,
                        });
                      }}
                      onError={(err) => {
                        setError('PayPal payment failed. Please try again.');
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </div>
          </div>

          <div className="checkout-summary card">
            <h3 className="summary-title">Order Items</h3>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item._id} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.name}</span>
                    <span className="checkout-item-qty">Qty: {item.qty}</span>
                  </div>
                  <span className="checkout-item-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{borderTop:'1px solid var(--border)', margin:'16px 0'}}/>
            <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div style={{borderTop:'1px solid var(--border)', margin:'16px 0'}}/>
            <div className="summary-row" style={{fontWeight:700,fontSize:'1rem'}}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
            {paymentMethod === 'Cash on Delivery' && (
              <button className="btn btn-primary btn-full" style={{marginTop:20}} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}