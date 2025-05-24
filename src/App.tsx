import { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useRoutes,
} from 'react-router-dom';

import Loader from './common/Loader';
import { routes } from './routes/routes';

import DefaultLayout from './layout/DefaultLayout';
import ClienteLayout from './layout/ClienteLayout';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './Context/ProtectedRoute';
import UnauthorizedPage from './Context/UnauthorizedPage';
import Inventario from './pages/stock/Stock';
import RegistrarProducto from './pages/stock/registrar/RegistrarProducto';
import Vendedores from './pages/Vendedor/Vendedores';
import RegistrarVendedor from './pages/Vendedor/registrar/RegistrarVendedor';
import EditarVendedor from './pages/Vendedor/editar/EditarVendedor';
import Pedidos from './pages/Pedidos/Pedidos';
import PedidoEmpleado from './pages/Pedidos/Pedido/Pedido';
import Estadisiticas from './pages/Admin/Estadisticas/Estadisiticas';
import Perfil from './pages/Perfil';
import LoginAdmin from './pages/Authentication/LoginAdmin';

import ECommerce from './pages/Dashboard/ECommerce';

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
            <ProtectedRoute requiredRole="ROLE_ADMINISTRADOR">
              <DefaultLayout>
                <Routes>
                  <Route path="/" element={<ECommerce />} />
                  <Route path="/stock" element={<Inventario />} />
                  <Route
                    path="/stock/registrar'"
                    element={<RegistrarProducto />}
                  />

                  <Route path="/vendedores" element={<Vendedores />} />
                  <Route
                    path="/vendedores/registrar"
                    element={<RegistrarVendedor />}
                  />
                  <Route
                    path="/vendedores/editar/:id"
                    element={<EditarVendedor />}
                  />
                  <Route path="/pedidos" element={<Pedidos />} />
                  <Route path="/pedidos/:id" element={<PedidoEmpleado />} />
                  <Route path="/estadisticas" element={<Estadisiticas />} />
                  <Route path="/perfil" element={<Perfil />} />
                </Routes>
              </DefaultLayout>
            </ProtectedRoute>
          }
        />

        {/* Rutas para clientes (puedes decidir si requieren autenticación o no) */}
        <Route
          path="/cliente/*"
          element={<ClienteLayout>{routing}</ClienteLayout>}
        />
        <Route path="/login/admin" element={<LoginAdmin />} />

        {/* Rutas públicas */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/cliente" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
