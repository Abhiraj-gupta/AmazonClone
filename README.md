# Amazon Clone

A full-stack e-commerce web application inspired by Amazon, built to demonstrate modern web development practices including authentication, REST APIs, and relational database design.

The platform allows users to browse products, manage a cart, save items to a wishlist, and authenticate securely.

---

## Live Demo

**Frontend (Vercel)**  
https://abhiraj-amazon-clone.vercel.app/

**Backend API (Render)**  
https://amazonclone-htnz.onrender.com

---

## Core Features

### Authentication
- User registration
- Secure login using **JWT**
- Protected API routes
- Token-based session handling

### Product System
- Product catalog
- Categories
- Ratings and review counts
- Product images

### Shopping Cart
- Add products to cart
- Update quantities
- Remove items
- Real-time updates

### Wishlist
- Save products for later
- Remove items from wishlist
- Stored per authenticated user

---

## Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- REST API architecture
- JWT authentication

### Database
- PostgreSQL
- Neon serverless database

### Deployment
- Frontend → Vercel  
- Backend → Render

---

## API Overview

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### Products
```
GET /api/products
GET /api/products/:id
```

### Cart
```
GET /api/cart
POST /api/cart
DELETE /api/cart/:id
```

### Wishlist
```
GET /api/wishlist
POST /api/wishlist
DELETE /api/wishlist/:id
```

## Project Structure

```
frontend/
  components/
  pages/
  context/
  lib/

backend/
  controllers/
  routes/
  middleware/
  config/

db/
  schema.sql
  seed.sql
```

---

## Environment Variables

Create a `.env` file inside the **backend** directory.

```
DATABASE_URL=your_postgres_connection
JWT_SECRET=your_secret_key
PORT=5000
```

---

## Local Setup

Clone the repository

```
git clone https://github.com/Abhiraj-gupta/AmazonClone.git
```

Install dependencies

### Backend
```
cd backend
npm install
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

---

## What This Project Demonstrates

- Full-stack application architecture
- Secure authentication using JWT
- RESTful API design with Express
- PostgreSQL relational database usage
- Deployment of frontend and backend services
- State management in React applications

---

## Author

**Abhiraj Gupta**

GitHub:  
https://github.com/Abhiraj-gupta
