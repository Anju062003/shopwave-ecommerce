import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link to="/" className="footer-logo">Shop<span>Wave</span></Link>
        <p className="footer-copy">© 2024 ShopWave. Built with React, Node.js & MongoDB.</p>
      </div>
    </footer>
  );
}
