# ShopWave — Full-Stack E-Commerce App

A complete, beginner-friendly e-commerce application built with **React**, **Node.js/Express**, and **MongoDB**.

---

## 📁 Folder Structure

```
ecommerce/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (name, email, password hash)
│   │   ├── Product.js       # Product schema (name, price, category, stock)
│   │   └── Order.js         # Order schema (items, shipping, totals)
│   ├── routes/
│   │   ├── auth.js          # POST /register, POST /login, GET /profile
│   │   ├── products.js      # CRUD products + seed route
│   │   ├── cart.js          # Cart info route
│   │   └── orders.js        # Create and fetch orders
│   ├── middleware/
│   │   └── auth.js          # JWT protect + admin middleware
│   ├── server.js            # Express app entry point
│   ├── .env.example         # Environment variables template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js/css    # Sticky navbar with cart badge
    │   │   ├── Footer.js/css    # Footer
    │   │   └── ProductCard.js/css # Product grid card
    │   ├── context/
    │   │   ├── AuthContext.js   # Global user auth state
    │   │   └── CartContext.js   # Global cart state (localStorage)
    │   ├── pages/
    │   │   ├── Home.js/css      # Product listing + search + filter
    │   │   ├── ProductDetail.js # Single product + add to cart
    │   │   ├── Cart.js          # Cart with qty controls
    │   │   ├── Checkout.js      # Shipping + payment + place order
    │   │   ├── Login.js         # JWT login form
    │   │   ├── Register.js      # User registration form
    │   │   ├── Orders.js        # User's order history
    │   │   └── OrderSuccess.js  # Confirmation page
    │   ├── utils/
    │   │   └── api.js           # Axios instance with JWT interceptor
    │   ├── App.js               # React Router routes
    │   └── index.css            # Global design tokens + utilities
    ├── .env.example
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community  
  OR use **MongoDB Atlas** (free cloud) → https://www.mongodb.com/atlas

---

### Step 1 — Set up the Backend

```bash
cd ecommerce/backend
npm install
```

Create your environment file:
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=pick_any_long_random_string_here
```

Start the backend:
```bash
npm run dev      # with auto-reload (nodemon)
# or
npm start        # production mode
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

### Step 2 — Set up the Frontend

```bash
cd ecommerce/frontend
npm install
```

Create your environment file:
```bash
cp .env.example .env
```

The `.env` file should contain:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

Opens at **http://localhost:3000**

---

### Step 3 — Seed Sample Products

Once the app is running, click **"Load Sample Products"** on the home page,  
or send a POST request:
```bash
curl -X POST http://localhost:5000/api/products/seed
```

This creates 8 sample products across Electronics, Fashion, Home, and Sports.

---

## 🔌 API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/profile` | Get profile (auth required) |

### Products
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products?keyword=watch` | Search products |
| GET | `/api/products?category=Electronics` | Filter by category |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products/seed` | Seed sample products |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Orders
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/orders` | Create order (auth required) |
| GET | `/api/orders/myorders` | Get user's orders (auth required) |
| GET | `/api/orders/:id` | Get order by ID (auth required) |
| GET | `/api/orders` | Get all orders (admin) |

---

## 🗄️ MongoDB Schemas

### User
```js
{ name, email, password (hashed), isAdmin, timestamps }
```

### Product
```js
{ name, description, price, category, image, countInStock, rating, numReviews, reviews[], timestamps }
```

### Order
```js
{ user, orderItems[], shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, isPaid, isDelivered, timestamps }
```

---

## ✨ Features

- ✅ User registration & login with JWT
- ✅ Password hashing with bcrypt
- ✅ Protected routes (auth middleware)
- ✅ Product listing with search & category filter
- ✅ Product detail page
- ✅ Add to cart with quantity control (persisted in localStorage)
- ✅ Checkout with shipping form & payment selection
- ✅ Order creation saved to MongoDB
- ✅ Order history page
- ✅ Responsive design (mobile + desktop)
- ✅ Dark theme with clean design system
- ✅ Sample product seeder

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Styling | Pure CSS with CSS Variables |

---

## 🐛 Troubleshooting

**MongoDB connection error:**  
Make sure MongoDB is running: `mongod` (Mac/Linux) or start from Services (Windows)

**CORS errors:**  
Ensure the backend is running on port 5000 and frontend proxy is set in `package.json`

**"Failed to load products":**  
Check that the backend server is running and `.env` is configured

**Port 3000/5000 already in use:**  
Change PORT in `.env` and update `REACT_APP_API_URL` accordingly
