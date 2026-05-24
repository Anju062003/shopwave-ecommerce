const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// GET /api/products — list all with optional search
router.get('/', async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const products = await Product.find({ ...keyword, ...category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/seed — seed sample products
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany();
    const sampleProducts = [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
        price: 299.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        countInStock: 15,
        rating: 4.5,
        numReviews: 12,
      },
      {
        name: 'Mechanical Keyboard RGB',
        description: 'Compact 75% mechanical keyboard with Cherry MX switches, full RGB backlighting, and aluminum frame.',
        price: 149.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
        countInStock: 20,
        rating: 4.7,
        numReviews: 8,
      },
      {
        name: 'Minimalist Leather Watch',
        description: 'Handcrafted genuine leather strap watch with sapphire crystal glass and Swiss quartz movement.',
        price: 189.99,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        countInStock: 10,
        rating: 4.8,
        numReviews: 20,
      },
      {
        name: 'Ladies High Heel Sandals',
        description: 'Elegant high heel sandals designed with premium materials, comfortable fit, stylish straps, and durable outsole ideal for parties and special occasions.',
        price: 99.99,
        category: 'Fashion',  // Electronics, Fashion, Home, or Sports
        image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFkaWVzJTIwc2hvZXN8ZW58MHx8MHx8fDA%3D?w=400',
        countInStock: 20,
        rating: 4.5,
        numReviews: 10,
      },
      {
        name: 'Running Shoes Pro',
        description: 'Lightweight performance running shoes with responsive foam cushioning and breathable mesh upper.',
        price: 129.99,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        countInStock: 30,
        rating: 4.6,
        numReviews: 45,
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: '360-degree sound with deep bass, IP67 waterproof rating, and 24-hour playtime. Perfect for outdoors.',
        price: 89.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        countInStock: 25,
        rating: 4.4,
        numReviews: 33,
      },
      {
        name: 'Ceramic Coffee Mug Set',
        description: 'Set of 4 hand-thrown ceramic mugs in earthy tones. Microwave and dishwasher safe. 12oz each.',
        price: 49.99,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
        countInStock: 50,
        rating: 4.9,
        numReviews: 67,
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Extra-thick 6mm non-slip yoga mat with alignment lines, carrying strap, and eco-friendly TPE material.',
        price: 69.99,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400',
        countInStock: 40,
        rating: 4.5,
        numReviews: 28,
      },
      {
        name: 'Modern Luxury Sofa',
        description: 'Elegant and comfortable modern sofa with premium fabric, soft cushions, sturdy wooden frame, and spacious seating perfect for living rooms and home interiors.',
        price: 99.99,
        category: 'Home',  // Electronics, Fashion, Home, or Sports
        image: 'https://images.unsplash.com/photo-1512212621149-107ffe572d2f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y291Y2h8ZW58MHx8MHx8fDA%3D?w=400',
        countInStock: 20,
        rating: 4.5,
        numReviews: 10,
      },
      {
        name: 'Smart LED Desk Lamp',
        description: 'Touch-controlled LED lamp with adjustable color temperature, USB charging port, and eye-care mode.',
        price: 59.99,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        countInStock: 35,
        rating: 4.3,
        numReviews: 19,
      },
      {
        name: 'Luxury Lounge Chair',
        description: 'Elegant lounge chair featuring soft cushioning, durable fabric upholstery, sturdy frame, and modern design for relaxing and stylish home décor.',
        price: 99.99,
        category: 'Home',  // Electronics, Fashion, Home, or Sports
        image: 'https://plus.unsplash.com/premium_photo-1705169538590-d1a4cecf7bd8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGNoYWlyfGVufDB8fDB8fHww?w=400',
        countInStock: 20,
        rating: 4.5,
        numReviews: 10,
      },
      {
        name: 'Headphone',
        description: 'Lightweight foldable headphones with powerful audio output, comfortable design, and extended battery backup for travel and daily use.',
        price: 99.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhlYWRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D?w=400',
        countInStock: 20,
        rating: 4.5,
        numReviews: 10,
      },
    ];

    const products = await Product.insertMany(sampleProducts);
    res.status(201).json({ message: `${products.length} products seeded!`, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products — admin create
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id — admin update
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id — admin delete
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
