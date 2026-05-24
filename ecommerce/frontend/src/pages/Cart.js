import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <h1 className="page-title">Your Cart</h1>
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <Link to="/" className="btn btn-primary">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const shipping = cartTotal > 100 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Your Cart</h1>
        <p className="page-subtitle">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <Link to={`/products/${item._id}`}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/products/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <span className="cart-item-category">{item.category}</span>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-control-sm">
                    <button onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                  </div>
                  <span className="cart-item-price">${(item.price * item.qty).toFixed(2)}</span>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary card">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{color:'var(--success)'}}>Free</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-divider"/>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {cartTotal <= 100 && (
              <p className="free-shipping-note">Add ${(100 - cartTotal).toFixed(2)} more for free shipping!</p>
            )}
            <button className="btn btn-primary btn-full" style={{marginTop: 16}} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <Link to="/" className="btn btn-outline btn-full" style={{marginTop: 8}}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
