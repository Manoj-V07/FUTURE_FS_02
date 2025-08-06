const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all handler to serve React's index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-gadgets';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log('MongoDB connection error:', err)); 