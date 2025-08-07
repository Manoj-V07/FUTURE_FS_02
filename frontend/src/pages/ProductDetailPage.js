import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiTruck, FiShield, FiRotateCcw } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log('Fetching product with ID:', id);
      const response = await axios.get(`/api/products/${id}`);
      console.log('Product data received:', response.data);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      console.error('Error response:', err.response);
      setError('Product not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      // Success message could be shown here
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Breadcrumb */}
              <nav className="text-sm text-gray-500">
                <span onClick={() => navigate('/')} className="cursor-pointer hover:text-primary">
                  Home
                </span>
                {' > '}
                <span onClick={() => navigate('/products')} className="cursor-pointer hover:text-primary">
                  Products
                </span>
                {' > '}
                <span className="text-gray-900">{product.name}</span>
              </nav>

              {/* Product Title */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{product.brand || "Brand not available"}</p>
                <p className="text-gray-600 leading-relaxed">{product.description || "No description"}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} (reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-primary">
                {typeof product.price === "number" && !isNaN(product.price)
                  ? `$${product.price.toFixed(2)}`
                  : "Price not available"}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <FiShoppingCart />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <FiTruck className="w-5 h-5 text-primary" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShield className="w-5 h-5 text-primary" />
                  <span className="text-sm text-gray-600">1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiRotateCcw className="w-5 h-5 text-primary" />
                  <span className="text-sm text-gray-600">30 Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;