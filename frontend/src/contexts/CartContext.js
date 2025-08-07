import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'CART_LOADED':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        loading: false,
        error: null
      };
    case 'CART_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        loading: false
      };
    case 'UPDATE_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        loading: false
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        loading: false
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        loading: false
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Define loadCart before useEffect
  const loadCart = async () => {
    if (!isAuthenticated) return;
    dispatch({ type: 'CART_LOADING' });
    try {
      const response = await axios.get('/api/cart');
      dispatch({
        type: 'CART_LOADED',
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: 'CART_ERROR',
        payload: 'Failed to load cart'
      });
    }
  };

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    console.log('addToCart called, isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) {
      console.log('User not authenticated, cannot add to cart');
      dispatch({
        type: 'CART_ERROR',
        payload: 'Please login to add items to cart'
      });
      return { success: false, error: 'Please login to add items to cart' };
    }

    dispatch({ type: 'CART_LOADING' });
    
    try {
      const response = await axios.post('/api/cart', { productId, quantity });
      dispatch({
        type: 'ADD_TO_CART',
        payload: response.data
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      dispatch({
        type: 'CART_ERROR',
        payload: message
      });
      return { success: false, error: message };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) return { success: false, error: 'Not authenticated' };

    dispatch({ type: 'CART_LOADING' });
    
    try {
      const response = await axios.put(`/api/cart/${itemId}`, { quantity });
      dispatch({
        type: 'UPDATE_CART',
        payload: response.data
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      dispatch({
        type: 'CART_ERROR',
        payload: message
      });
      return { success: false, error: message };
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return { success: false, error: 'Not authenticated' };

    dispatch({ type: 'CART_LOADING' });
    
    try {
      const response = await axios.delete(`/api/cart/${itemId}`);
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: response.data
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from cart';
      dispatch({
        type: 'CART_ERROR',
        payload: message
      });
      return { success: false, error: message };
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return { success: false, error: 'Not authenticated' };

    dispatch({ type: 'CART_LOADING' });
    
    try {
      await axios.delete('/api/cart');
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      dispatch({
        type: 'CART_ERROR',
        payload: message
      });
      return { success: false, error: message };
    }
  };

  const getCartItemCount = () => {
    return (state.items || []).reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items: state.items,
    total: state.total,
    loading: state.loading,
    error: state.error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 