import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [seeding, setSeeding] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/api/products');
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      setError('Failed to load products. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    let result = products;
    if (category !== 'All') result = result.filter((p) => p.category === category);
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, category, products]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await API.post('/api/products/seed');
      await fetchProducts();
    } catch {
      setError('Failed to seed products.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="home-hero">
          <h1 className="page-title">Discover Products</h1>
          <p className="page-subtitle">Curated essentials for modern living</p>
        </div>

        <div className="home-controls">
          <div className="search-wrap">
            <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-tab ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛍️</div>
            <p>No products found.</p>
            {products.length === 0 && (
              <button className="btn btn-primary" onClick={handleSeed} disabled={seeding}>
                {seeding ? 'Seeding...' : 'Load Sample Products'}
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="results-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
            <div className="products-grid">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
