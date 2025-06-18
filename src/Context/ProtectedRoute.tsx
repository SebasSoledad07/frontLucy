import { Navigate, useLocation } from 'react-router-dom';
// ProtectedRoute.tsx
import React from 'react';

import { useAuth } from './AuthContext';
import Loader from '../common/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredRoles,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow access if user's role is in requiredRoles, or matches requiredRole
  if (
    (requiredRoles && !requiredRoles.includes(user.role)) ||
    (requiredRole && user.role !== requiredRole)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Evitar redirección si ya estás en la ruta correcta
  const adminRoles = [
    'ROLE_ADMINISTRADOR',
    'ROLE_GERENTE_DE_VENTA',
    'ROLE_COORDINADOR_DE_FACTURACION',
    'ROLE_PRODUCT_MANAGER',
  ];

  if (
    adminRoles.includes(user.role) &&
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
