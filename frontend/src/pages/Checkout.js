import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import './Checkout.css';

const COUPONS = {
  'FREESHIP': { type: 'shipping', discount: 100, label: 'Free Shipping!' },
  'SAVE10': { type: 'percent', discount: 10, label: '10% off!' },
  'SAVE20': { type: 'percent', discount: 20, label: '20% off!' },
};

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');

  const baseShipping = cartTotal > 100 ? 0 : 9.99;
  const shipping = appliedCoupon?.type === 'shipping' ? 0 : baseShipping;
  const discount = appliedCoupon?.type === 'percent' ? (cartTotal * appliedCoupon.discount / 100) : 0;
  const tax = (cartTotal - discount) * 0.08;
  const total = cartTotal - discount + shipping + tax;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const applyCoupon = () => {
    const code = coupon.toUpperCase().trim();
    if (COUPONS[code]) {
      setAppliedCoupon({ ...COUPONS[code], code });
      setCouponMsg(`✅ Coupon applied: ${COUPONS[code].label}`);
    } else {
      setAppliedCoupon(null);
      setCouponMsg('❌ Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon('');
    setCouponMsg('');
  };

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
              <h3 className="section-title">Coupon Code</h3>
              <div style={{display:'flex', gap:8}}>
                <input
                  className="form-input"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  disabled={!!appliedCoupon}
                  style={{flex:1}}
                />
                {!appliedCoupon ? (
                  <button className="btn btn-primary" onClick={applyCoupon}>Apply</button>
                ) : (
                  <button className="btn btn-outline" onClick={removeCoupon}>Remove</button>
                )}
              </div>
              {couponMsg && (
                <p style={{marginTop:8, color: appliedCoupon ? '#22c55e' : '#ef4444', fontSize:'0.875rem'}}>
                  {couponMsg}
                </p>
              )}
              <p style={{marginTop:8, fontSize:'0.75rem', color:'var(--text-muted)'}}>
                Available codes: FREESHIP, SAVE10, SAVE20
              </p>
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
                    currency: "USD",
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
            {discount > 0 && (
              <div className="summary-row" style={{color:'#22c55e'}}>
                <span>Discount ({appliedCoupon.discount}%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{color: shipping === 0 ? '#22c55e' : 'inherit'}}>
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
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