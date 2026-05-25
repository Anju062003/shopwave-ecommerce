import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import './Admin.css';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    category: 'Electronics', image: '', countInStock: ''
  });
  const [message, setMessage] = useState('');

  // Protect admin page
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => { fetchData(); }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'products') {
        const { data } = await API.get('/api/products');
        setProducts(data);
      } else {
        const { data } = await API.get('/api/orders');
        setOrders(data);
      }
    } catch {}
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      setMessage('Product deleted!');
      setTimeout(() => setMessage(''), 2000);
    } catch {}
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/api/products', {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock)
      });
      setProducts([...products, data]);
      setShowForm(false);
      setForm({ name: '', description: '', price: '', category: 'Electronics', image: '', countInStock: '' });
      setMessage('Product added!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to add product.');
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  if (!user?.isAdmin) return null;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card card">
            <span className="stat-icon">📦</span>
            <div>
              <p className="stat-value">{products.length}</p>
              <p className="stat-label">Total Products</p>
            </div>
          </div>
          <div className="stat-card card">
            <span className="stat-icon">🛒</span>
            <div>
              <p className="stat-value">{orders.length}</p>
              <p className="stat-label">Total Orders</p>
            </div>
          </div>
          <div className="stat-card card">
            <span className="stat-icon">💰</span>
            <div>
              <p className="stat-value">${totalRevenue.toFixed(2)}</p>
              <p className="stat-label">Total Revenue</p>
            </div>
          </div>
        </div>

        {message && <div className="alert alert-success">{message}</div>}

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
            Products
          </button>
          <button className={`admin-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            Orders
          </button>
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          <>
            <div className="admin-toolbar">
              <p>{products.length} products</p>
              <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : '+ Add Product'}
              </button>
            </div>

            {/* Add Product Form */}
            {showForm && (
              <div className="card admin-form">
                <h3>Add New Product</h3>
                <form onSubmit={handleAddProduct}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Product Name</label>
                      <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-input" name="category" value={form.category} onChange={handleChange}>
                        <option>Electronics</option>
                        <option>Fashion</option>
                        <option>Home</option>
                        <option>Sports</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-input" name="description" value={form.description} onChange={handleChange} rows={3} required />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Price ($)</label>
                      <input className="form-input" type="number" name="price" value={form.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stock</label>
                      <input className="form-input" type="number" name="countInStock" value={form.countInStock} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input className="form-input" name="image" value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
                  </div>
                  <button className="btn btn-primary" type="submit">Add Product</button>
                </form>
              </div>
            )}

            {/* Products Table */}
            {loading ? <div className="spinner" /> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td><img src={p.image} alt={p.name} className="admin-thumb" /></td>
                        <td className="admin-product-name">{p.name}</td>
                        <td><span className="admin-badge">{p.category}</span></td>
                        <td>${p.price.toFixed(2)}</td>
                        <td>{p.countInStock}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <>
            {loading ? <div className="spinner" /> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td className="order-id-cell">#{o._id.slice(-8).toUpperCase()}</td>
                        <td>{o.user?.name || 'N/A'}</td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td>${o.totalPrice.toFixed(2)}</td>
                        <td>
                          <span className={`order-status ${o.isDelivered ? 'delivered' : o.isPaid ? 'paid' : 'pending'}`}>
                            {o.isDelivered ? 'Delivered' : o.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
