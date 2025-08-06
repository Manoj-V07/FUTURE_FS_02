const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order with address and payment details
// @access  Public (for demo)
router.post('/', async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      cardDetails
    } = req.body;
    
    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address and payment method are required' });
    }

    // Validate address fields
    const { state, address, city } = shippingAddress;
    if (!state || !address || !city) {
      return res.status(400).json({ message: 'State, address, and city are required' });
    }

    // Validate payment method
    if (!['card', 'cash_on_delivery'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Payment method must be "card" or "cash_on_delivery"' });
    }

    // Validate card details if payment method is card
    if (paymentMethod === 'card') {
      if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
        return res.status(400).json({ message: 'Card details are required for card payment' });
      }
      
      // Basic card validation (for demo purposes)
      if (cardDetails.cardNumber.length < 13 || cardDetails.cardNumber.length > 19) {
        return res.status(400).json({ message: 'Invalid card number' });
      }
      
      if (cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) {
        return res.status(400).json({ message: 'Invalid CVV' });
      }
    }

    // Create order
    const order = new Order({
      userId: 'demo-user', // For demo purposes
      items: items || [],
      shippingAddress: {
        state,
        address,
        city
      },
      paymentMethod,
      cardDetails: paymentMethod === 'card' ? {
        cardNumber: cardDetails.cardNumber.slice(-4), // Store only last 4 digits for security
        expiryDate: cardDetails.expiryDate,
        cardType: cardDetails.cardType || 'credit'
      } : null,
      total: items ? items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0) : 0,
      status: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      isPaid: paymentMethod === 'card' // Assume card payments are paid immediately
    });
    
    const createdOrder = await order.save();
    
    // Clear cart after successful order
    const cart = await Cart.findOne({ userId: 'demo-user' });
    if (cart) {
      cart.products = [];
      await cart.save();
    }
    
    // Return appropriate response based on payment method
    if (paymentMethod === 'cash_on_delivery') {
      res.status(201).json({
        message: 'Your order is placed successfully!',
        orderId: createdOrder._id,
        paymentStatus: 'pending',
        deliveryInstructions: 'Pay cash on delivery'
      });
    } else {
      res.status(201).json({
        message: 'Order placed successfully with card payment!',
        orderId: createdOrder._id,
        paymentStatus: 'paid',
        cardDetails: {
          cardNumber: `****${cardDetails.cardNumber.slice(-4)}`,
          cardType: cardDetails.cardType || 'credit'
        }
      });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get user orders
// @access  Public (for demo)
router.get('/myorders', async (req, res) => {
  try {
    const orders = await Order.find({ userId: 'demo-user' })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Public (for demo)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name image price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 