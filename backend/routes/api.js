const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid product ID' });
  }
});

// Register user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }
  // Check for duplicate username
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  const user = new User({ username, password });
  await user.save();
  res.json({ message: 'User registered' });
});

// Login user (very basic, no tokens)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  if (user.password !== password) {
    return res.status(400).json({ message: 'Incorrect password' });
  }
  res.json({ message: 'Login successful' });
});

// Get cart items
router.get('/cart', async (req, res) => {
  console.log('Cart GET route called');
  const userId = 'demo-user';
  
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
      await cart.save();
    }

    // Populate product details for frontend
    await cart.populate('products.productId');
    const items = cart.products.map(item => ({
      _id: item._id,
      product: item.productId, // This should now be the full product object
      quantity: item.quantity
    }));
    const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    console.log('Sending cart response:', { items, total });
    res.json({ items, total });
  } catch (error) {
    console.error('Error loading cart:', error);
    res.status(500).json({ message: 'Failed to load cart' });
  }
});

// Add to cart
router.post('/cart', async (req, res) => {
  console.log('Cart POST route called with body:', req.body);
  const userId = 'demo-user';
  const { productId, quantity } = req.body;
  console.log('productId:', productId, 'quantity:', quantity);
  
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, products: [] });

    // Check if product already in cart
    const existing = cart.products.find(p => p.productId.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
    await cart.save();

    // Populate product details for frontend
    await cart.populate('products.productId');
    const items = cart.products.map(item => ({
      _id: item._id,
      product: item.productId, // This should now be the full product object
      quantity: item.quantity
    }));
    const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    console.log('Sending response:', { items, total });
    res.json({ items, total });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Failed to add to cart' });
  }
});

// Update cart item quantity
router.put('/cart/:itemId', async (req, res) => {
  const userId = 'demo-user';
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.products.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (quantity <= 0) {
      item.remove();
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('products.productId');

    const items = cart.products.map(item => ({
      _id: item._id,
      product: item.productId,
      quantity: item.quantity
    }));
    const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    res.json({ items, total });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/cart/:itemId', async (req, res) => {
  const userId = 'demo-user';
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(item => item._id.toString() !== itemId);
    await cart.save();
    await cart.populate('products.productId');

    const items = cart.products.map(item => ({
      _id: item._id,
      product: item.productId,
      quantity: item.quantity
    }));
    const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    res.json({ items, total });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Failed to remove from cart' });
  }
});

// Clear cart
router.delete('/cart', async (req, res) => {
  const userId = 'demo-user';

  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.products = [];
      await cart.save();
    }

    res.json({ items: [], total: 0 });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

// Place order
router.post('/order', async (req, res) => {
  const userId = 'demo-user';
  const { products } = req.body;
  
  try {
    const order = new Order({ userId, products });
    await order.save();
    
    // Clear cart after order
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.products = [];
      await cart.save();
    }
    
    res.json({ message: 'Order placed successfully', orderId: order._id });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

module.exports = router;