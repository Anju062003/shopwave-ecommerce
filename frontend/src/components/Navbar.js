import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          Shop<span>Wave</span>
        </Link>

        <div className="navbar-links">

          <Link to="/" className="nav-link">Products</Link>
          <Link to="/contact" className="nav-link">Contact</Link>

          <Link to="/cart" className="nav-link cart-link">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Cart
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="nav-dropdown">
              <button className="nav-link nav-user" onClick={() => setMenuOpen(!menuOpen)}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {user.name.split(' ')[0]}
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {menuOpen && (
                <div className="dropdown-menu">
                  <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    My Orders
                  </Link>
                  <Link to="/contact" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    Contact
                  </Link>

                  {/* Admin Dashboard - only visible to admin users */}
                  {user?.isAdmin && (
                    <Link to="/admin" className="dropdown-item admin-link" onClick={() => setMenuOpen(false)}>
                      ⚙️ Admin Dashboard
                    </Link>
                  )}

                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
          )}

        </div>
      </div>
    </nav>
  );
}