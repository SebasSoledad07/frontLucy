import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Don't pass the entire location object - only pass pathname as state
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // You can add role-based authorization here if needed
  // For example:
  // if (user.role !== 'admin' && location.pathname.startsWith('/admin')) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
