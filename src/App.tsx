import { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useRoutes,
} from 'react-router-dom';

import Loader from './common/Loader';
import routes from './routes/routes';

import DefaultLayout from './layout/DefaultLayout';
import ClienteLayout from './layout/ClienteLayout';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './Context/ProtectedRoute';
import LoginPage from './pages/Authentication/LoginPage';
import UnauthorizedPage from './Context/UnauthorizedPage';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const routing = useRoutes(routes);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>
      <Routes>
        {/* Rutas protegidas para administradores */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <DefaultLayout>{routing}</DefaultLayout>
            </ProtectedRoute>
          }
        />

        {/* Rutas para clientes (puedes decidir si requieren autenticación o no) */}
        <Route
          path="/cliente/*"
          element={<ClienteLayout>{routing}</ClienteLayout>}
        />

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/cliente" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
