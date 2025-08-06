import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    

    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await signup(formData);
      if (result.success) {
        // Wait a moment for the auth state to update
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      }
    } catch (err) {
      // Error is handled by the auth context
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-600">Join us and start shopping</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
                         {/* Name Field */}
             <div>
               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                 Full Name
               </label>
               <input
                 id="name"
                 name="name"
                 type="text"
                 autoComplete="name"
                 required
                 value={formData.name}
                 onChange={handleChange}
                 className={`input-field ${validationErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                 placeholder="Enter your full name"
               />
               {validationErrors.name && (
                 <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
               )}
             </div>

                         {/* Email Field */}
             <div>
               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                 Email Address
               </label>
               <input
                 id="email"
                 name="email"
                 type="email"
                 autoComplete="email"
                 required
                 value={formData.email}
                 onChange={handleChange}
                 className={`input-field ${validationErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                 placeholder="Enter your email"
               />
               {validationErrors.email && (
                 <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
               )}
             </div>



                         {/* Password Field */}
             <div>
               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                 Password
               </label>
               <div className="relative">
                 <input
                   id="password"
                   name="password"
                   type={showPassword ? 'text' : 'password'}
                   autoComplete="new-password"
                   required
                   value={formData.password}
                   onChange={handleChange}
                   className={`input-field pr-10 ${validationErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                   placeholder="Create a password"
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
                 >
                   {showPassword ? (
                     <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                   ) : (
                     <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                   )}
                 </button>
               </div>
               {validationErrors.password && (
                 <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
               )}
             </div>

                         {/* Confirm Password Field */}
             <div>
               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                 Confirm Password
               </label>
               <div className="relative">
                 <input
                   id="confirmPassword"
                   name="confirmPassword"
                   type={showConfirmPassword ? 'text' : 'password'}
                   autoComplete="new-password"
                   required
                   value={formData.confirmPassword}
                   onChange={handleChange}
                   className={`input-field pr-10 ${validationErrors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                   placeholder="Confirm your password"
                 />
                 <button
                   type="button"
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
                 >
                   {showConfirmPassword ? (
                     <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                   ) : (
                     <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                   )}
                 </button>
               </div>
               {validationErrors.confirmPassword && (
                 <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
               )}
             </div>



            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <FiUser />
                  Create Account
                </>
              )}
            </button>
          </form>



          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary-dark"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignupPage; 