// ProtectedRoute.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // If not authenticated, render nothing (as navigation will redirect to login)
  if (!isAuthenticated) {
    return null;
  }

  return children; // Render the protected page if authenticated
};

export default ProtectedRoute;
