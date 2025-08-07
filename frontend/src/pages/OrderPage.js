import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCreditCard, FiTruck, FiArrowLeft, FiLock } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const OrderPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, clearCart, loading: cartLoading } = useCart();
  
  // Debug logging
  console.log('OrderPage - User:', user);
  console.log('OrderPage - Is Authenticated:', isAuthenticated);
  console.log('OrderPage - Cart Items:', items);
  console.log('OrderPage - Cart Loading:', cartLoading);
  
  const [formData, setFormData] = useState({
    shippingAddress: {
      address: user?.address || '',
      city: '',
      state: ''
    },
    paymentMethod: 'cash_on_delivery',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate shipping address
    if (!formData.shippingAddress.address.trim()) {
      newErrors['shippingAddress.address'] = 'Address is required';
    }
    if (!formData.shippingAddress.city.trim()) {
      newErrors['shippingAddress.city'] = 'City is required';
    }
    if (!formData.shippingAddress.state.trim()) {
      newErrors['shippingAddress.state'] = 'State is required';
    }
    
    // Validate payment information
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }
      
      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Please enter expiry date in MM/YY format';
      }
      
      if (!formData.cardCVC.trim()) {
        newErrors.cardCVC = 'CVC is required';
      } else if (!/^\d{3,4}$/.test(formData.cardCVC)) {
        newErrors.cardCVC = 'Please enter a valid CVC';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate order placement - just show success message
      setTimeout(() => {
        setLoading(false);
        alert('Your order is placed successfully!');
        
        // Clear cart after successful order
        clearCart();
        
        // Navigate back to home
        navigate('/', { replace: true });
      }, 1000);
      
    } catch (error) {
      console.error('Error placing order:', error);
      setErrors({ 
        submit: 'Failed to place order. Please try again.' 
      });
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardExpiry: formatted
    }));
  };

  // Show loading state while cart is loading
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to checkout</p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-primary hover:text-primary-dark mb-4"
          >
            <FiArrowLeft />
            Back to Cart
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Shipping Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiTruck className="text-primary" />
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.address"
                        value={formData.shippingAddress.address}
                        onChange={handleChange}
                        className={`input-field ${errors['shippingAddress.address'] ? 'border-red-300' : ''}`}
                        placeholder="Enter your street address"
                      />
                      {errors['shippingAddress.address'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.address']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.city"
                        value={formData.shippingAddress.city}
                        onChange={handleChange}
                        className={`input-field ${errors['shippingAddress.city'] ? 'border-red-300' : ''}`}
                        placeholder="City"
                      />
                      {errors['shippingAddress.city'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.city']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="shippingAddress.state"
                        value={formData.shippingAddress.state}
                        onChange={handleChange}
                        className={`input-field ${errors['shippingAddress.state'] ? 'border-red-300' : ''}`}
                        placeholder="State"
                      />
                      {errors['shippingAddress.state'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.state']}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiCreditCard className="text-primary" />
                    Payment Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === 'card'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          Credit/Debit Card
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash_on_delivery"
                            checked={formData.paymentMethod === 'cash_on_delivery'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          Cash on Delivery
                        </label>
                      </div>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            className={`input-field ${errors.cardNumber ? 'border-red-300' : ''}`}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                          {errors.cardNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            className={`input-field ${errors.cardName ? 'border-red-300' : ''}`}
                            placeholder="John Doe"
                          />
                          {errors.cardName && (
                            <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleExpiryChange}
                            className={`input-field ${errors.cardExpiry ? 'border-red-300' : ''}`}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {errors.cardExpiry && (
                            <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVC
                          </label>
                          <input
                            type="text"
                            name="cardCVC"
                            value={formData.cardCVC}
                            onChange={handleChange}
                            className={`input-field ${errors.cardCVC ? 'border-red-300' : ''}`}
                            placeholder="123"
                            maxLength="4"
                          />
                          {errors.cardCVC && (
                            <p className="mt-1 text-sm text-red-600">{errors.cardCVC}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {errors.submit}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiLock />
                      Place Order
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage; 