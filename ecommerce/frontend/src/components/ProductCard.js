import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-card-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-card-category">{product.category}</span>
      </Link>
      <div className="product-card-body">
        <Link to={`/products/${product._id}`} className="product-card-name">{product.name}</Link>
        <div className="product-card-meta">
          <span className="stars">{stars}</span>
          <span className="product-card-reviews">({product.numReviews})</span>
        </div>
        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => addToCart(product)}
            disabled={product.countInStock === 0}
          >
            {product.countInStock === 0 ? 'Out of Stock' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
