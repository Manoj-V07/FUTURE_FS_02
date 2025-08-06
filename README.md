# 🛍️ TechGadgets - E-commerce Web App

A modern, responsive e-commerce web application for selling electronic gadgets built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## ✨ Features

### 🔹 Frontend
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Beautiful animations and transitions using Framer Motion
- **Product Catalog**: Browse products by category with search and filtering
- **Shopping Cart**: Add, remove, and update cart items
- **User Authentication**: JWT-based login/signup system
- **Order Management**: View order history and track orders
- **Real-time Updates**: Live cart updates and stock management

### 🔹 Backend
- **RESTful API**: Complete CRUD operations for products, users, cart, and orders
- **JWT Authentication**: Secure user authentication and authorization
- **MongoDB Integration**: NoSQL database with Mongoose ODM
- **Input Validation**: Express-validator for data validation
- **Error Handling**: Comprehensive error handling and logging
- **Admin Features**: Admin-only routes for product management

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
ecommerce-gadgets/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config.env
│   ├── server.js
│   ├── seedData.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ProductCard.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── ProtectedRoute.js
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ProductsPage.js
│   │   │   ├── ProductDetailPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── OrderPage.js
│   │   │   └── OrdersPage.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-gadgets
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce-gadgets
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in the config file.

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend (port 5000) and frontend (port 3000) servers concurrently.

### Manual Setup (Alternative)

If you prefer to set up frontend and backend separately:

#### Backend Setup
```bash
cd backend
npm install
npm run seed
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📊 Sample Data

The application comes with pre-seeded data including:

### Admin User
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: Admin

### Sample Products
- iPhone 15 Pro
- MacBook Air M2
- Samsung Galaxy S24 Ultra
- Sony WH-1000XM5 Headphones
- iPad Pro 12.9-inch
- Apple Watch Series 9
- Canon EOS R6 Mark II
- PlayStation 5
- AirPods Pro 2nd Generation
- Dell XPS 13 Plus

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run install-all` - Install dependencies for all packages
- `npm run seed` - Seed the database with sample data

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart` - Add item to cart (protected)
- `PUT /api/cart/:itemId` - Update cart item (protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/myorders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `PUT /api/orders/:id/pay` - Mark order as paid (protected)
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/deliver` - Mark order as delivered (admin only)

## 🎨 Customization

### Styling
- Modify `frontend/tailwind.config.js` for theme customization
- Update `frontend/src/index.css` for custom CSS classes
- Use Tailwind CSS utility classes for responsive design

### Adding New Features
- Create new components in `frontend/src/components/`
- Add new pages in `frontend/src/pages/`
- Create new API routes in `backend/routes/`
- Add new models in `backend/models/`

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Express-validator for data validation
- **CORS Protection**: Cross-origin resource sharing configuration
- **Protected Routes**: Role-based access control

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Build the application: `npm run build`
3. Deploy to platforms like Heroku, Vercel, or AWS

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to platforms like Netlify, Vercel, or AWS S3

### Database Deployment
- Use MongoDB Atlas for cloud database hosting
- Update the `MONGODB_URI` in production environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify all environment variables are set correctly
4. Check that all dependencies are installed

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search and filtering
- [ ] Admin dashboard
- [ ] Real-time chat support
- [ ] Multi-language support
- [ ] PWA features
- [ ] Analytics integration

---

**Happy Coding! 🚀** 