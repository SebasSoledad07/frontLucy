// ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loader from '../common/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Evitar redirección si ya estás en la ruta correcta
  if (
    user.role === 'ROLE_ADMINISTRADOR' &&
    !location.pathname.startsWith('/admin')
  ) {
    return <Navigate to="/admin" replace />;
  }

  if (
    user.role === 'ROLE_CLIENTE' &&
    !location.pathname.startsWith('/cliente')
  ) {
    return <Navigate to="/cliente" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
