import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useRoutes,
  Outlet,
} from 'react-router-dom';
import { useEffect, useState } from 'react';

import RegistrarVendedor from './pages/Vendedor/registrar/RegistrarVendedor';
import RegistrarProducto from './pages/stock/registrar/RegistrarProducto';
import Estadisiticas from './pages/Admin/Estadisticas/Estadisiticas';
import EditarVendedor from './pages/Vendedor/editar/EditarVendedor';
import PedidoEmpleado from './pages/Pedidos/Pedido/Pedido';
import LoginAdmin from './pages/Authentication/LoginAdmin';
import UnauthorizedPage from './Context/UnauthorizedPage';
import ProtectedRoute from './Context/ProtectedRoute';
import Vendedores from './pages/Vendedor/Vendedores';
import { CartProvider } from './Context/CartContext';
import { AuthProvider } from './Context/AuthContext';
import ECommerce from './pages/Dashboard/ECommerce';
import DefaultLayout from './layout/DefaultLayout';
import ClienteLayout from './layout/ClienteLayout';
import Pedidos from './pages/Pedidos/Pedidos';
import Inventario from './pages/stock/Stock';
import { routes } from './routes/routes';
import Loader from './common/Loader';
import Perfil from './pages/Perfil';

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
      <CartProvider>
        <Routes>
          {/* Rutas protegidas para administradores y otros roles */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute
                requiredRoles={[
                  'ROLE_ADMINISTRADOR',
                  'ROLE_GERENTE_DE_VENTA',
                  'ROLE_COORDINADOR_DE_FACTURACION',
                  'ROLE_PRODUCT_MANAGER',
                ]}
              >
                <DefaultLayout>
                  <Outlet />
                </DefaultLayout>
              </ProtectedRoute>
            }
          >
            <Route path="" element={<ECommerce />} />
            <Route path="stock" element={<Inventario />} />
            <Route path="stock/registrar" element={<RegistrarProducto />} />
            <Route path="vendedores" element={<Vendedores />} />
            <Route
              path="vendedores/registrar"
              element={<RegistrarVendedor />}
            />
            <Route path="vendedores/:id/editar" element={<EditarVendedor />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="pedidos/:id" element={<PedidoEmpleado />} />
            <Route path="estadisticas" element={<Estadisiticas />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>

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
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
