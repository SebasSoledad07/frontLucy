

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export const AdminRoute = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAdmin() ? <Outlet /> : <Navigate to="/cliente" />;
};

export default AdminRoute;