import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios default headers
  useEffect(() => {
    //console.log('AuthContext: Token changed to:', state.token);
    //console.log('AuthContext: isAuthenticated:', state.isAuthenticated);
    
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
      //console.log('AuthContext: Set axios header and localStorage token');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      //console.log('AuthContext: Removed axios header and localStorage token');
    }
  }, [state.token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (state.token) {
        try {
          const response = await axios.get('/api/auth/profile');
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data,
              token: state.token
            }
          });
        } catch (error) {
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: {
            _id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role
          },
          token: response.data.token
        }
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      });
      return { success: false, error: message };
    }
  };

  const signup = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await axios.post('/api/auth/signup', userData);
      console.log('Signup response:', response.data);
      
      const payload = {
        user: {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        },
        token: response.data.token
      };
      
      console.log('Dispatching LOGIN_SUCCESS with payload:', payload);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload
      });
      
      console.log('Signup successful, token set:', response.data.token);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      const message = error.response?.data?.message || 'Signup failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    signup,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 