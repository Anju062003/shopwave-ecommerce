import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/api/products/${id}`);
        setProduct(data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  if (loading) return <div className="page"><div className="spinner"/></div>;
  if (!product) return null;

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <div className="detail-grid">
          <div className="detail-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="detail-info">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>
            <div className="detail-rating">
              <span className="stars">{stars}</span>
              <span className="detail-reviews">{product.numReviews} reviews</span>
            </div>
            <p className="detail-price">${product.price.toFixed(2)}</p>
            <p className="detail-desc">{product.description}</p>
            <div className="detail-stock">
              {product.countInStock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.countInStock} available)</span>
              ) : (
                <span className="out-stock">✗ Out of Stock</span>
              )}
            </div>
            {product.countInStock > 0 && (
              <div className="detail-actions">
                <div className="qty-control">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))}>+</button>
                </div>
                <button className={`btn btn-primary ${added ? 'btn-added' : ''}`} onClick={handleAdd}>
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            )}
            <button className="btn btn-outline" style={{marginTop: 12}} onClick={() => navigate('/cart')}>
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
