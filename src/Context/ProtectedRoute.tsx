import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'ROLE_ADMINISTRADOR' | 'ROLE_CLIENTE';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isAdmin, isCliente } = useAuth();

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar el rol requerido si se especifica uno
  if (requiredRole) {
    if (
      (requiredRole === 'ROLE_ADMINISTRADOR' && !isAdmin()) ||
      (requiredRole === 'ROLE_CLIENTE' && !isCliente())
    ) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
