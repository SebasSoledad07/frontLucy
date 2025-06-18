import { RouteObject } from 'react-router-dom';

import InfoProductoCliente from '../pages/Cliente/Productos/informacion/InfoProductoCliente';
import PreguntasFrecuentres from '../pages/Cliente/Preguntas/PreguntasFrecuentres';
import InformacionProducto from '../pages/stock/informacion/InformacionProducto';
import RegistrarVendedor from '../pages/Vendedor/registrar/RegistrarVendedor';
import RegistrarProducto from '../pages/stock/registrar/RegistrarProducto';
import RegistrarCliente from '../pages/Authentication/RegistrarCliente';
import Estadisiticas from '../pages/Admin/Estadisticas/Estadisiticas';
import EditarVendedor from '../pages/Vendedor/editar/EditarVendedor';
import ResetPassword from '../pages/Authentication/ResetPassword';
import EditarProducto from '../pages/stock/editar/EditarProducto';
import Productos from '../pages/Cliente/Productos/Productos';
import PedidoEmpleado from '../pages/Pedidos/Pedido/Pedido';
import LoginAdmin from '../pages/Authentication/LoginAdmin';
import PedidoCliente from '../pages/Cliente/Pedido/Pedido';
import Vendedores from '../pages/Vendedor/Vendedores';
import Checkout from '../pages/Cliente/Pago/Checkout';
import ECommerce from '../pages/Dashboard/ECommerce';
import Login from '../pages/Authentication/Login';
import PageTitle from '../components/PageTitle';
import Pedidos from '../pages/Pedidos/Pedidos';
import Inicio from '../pages/Cliente/Inicio';
import PQR from '../pages/Cliente/PQR/PQR';
import Stock from '../pages/stock/Stock';
import Perfil from '../pages/Perfil';

export const routes: RouteObject[] = [
  {
    path: '/login/admin',
    element: (
      <>
        <PageTitle title="Lucy Mundo de Pijamas Login Admin" />
        <LoginAdmin />
      </>
    ),
  },
  {
    path: '/admin/',
    element: (
      <>
        <PageTitle title="Lucy Mundo de Pijamas eCommerce Dashboard " />
        <ECommerce />
      </>
    ),
  },
  {
    path: '/admin/stock',
    element: (
      <>
        <PageTitle title="Stock " />
        <Stock />
      </>
    ),
  },
  {
    path: '/admin/stock/registrar',
    element: (
      <>
        <PageTitle title="Stock Registrar Producto" />
        <RegistrarProducto />
      </>
    ),
  },
  {
    path: '/admin/stock/:id/editar',
    element: (
      <>
        <PageTitle title="Stock Registrar Producto" />
        <EditarProducto />
      </>
    ),
  },
  {
    path: '/admin/stock/:id/informacion',
    element: (
      <>
        <PageTitle title="Stock Registrar Producto" />
        <InformacionProducto />
      </>
    ),
  },
  {
    path: '/admin/vendedores',
    element: (
      <>
        <PageTitle title="Perfil" />
        <Vendedores />
      </>
    ),
  },
  {
    path: '/admin/vendedores/registrar',
    element: (
      <>
        <PageTitle title="Perfil" />
        <RegistrarVendedor />
      </>
    ),
  },
  {
    path: '/admin/vendedores/:id/editar',
    element: (
      <>
        <PageTitle title="Perfil" />
        <EditarVendedor />
      </>
    ),
  },
  {
    path: '/admin/pedidos',
    element: (
      <>
        <PageTitle title="Preguntas Frecuentes" />
        <Pedidos />
      </>
    ),
  },
  {
    path: '/admin/pedido/informacion/:ref',
    element: (
      <>
        <PageTitle title="Preguntas Frecuentes" />
        <PedidoEmpleado />
      </>
    ),
  },

  {
    path: '/admin/perfil',
    element: (
      <>
        <PageTitle title="Perfil" />
        <Perfil />
      </>
    ),
  },
  {
    path: '/admin/estadisticas',
    element: (
      <>
        <PageTitle title="Estadisticas" />
        <Estadisiticas />
      </>
    ),
  },
  {
    path: '/vendedor/',
    element: (
      <>
        <PageTitle title="eCommerce Dashboard " />
        <ECommerce />
      </>
    ),
  },
  {
    path: '/vendedor/pedidos',
    element: (
      <>
        <PageTitle title="Preguntas Frecuentes" />
        <Pedidos />
      </>
    ),
  },
  {
    path: '/vendedor/pedido/informacion/:ref',
    element: (
      <>
        <PageTitle title="Preguntas Frecuentes" />
        <PedidoEmpleado />
      </>
    ),
  },

  {
    path: '/vendedor/stock',
    element: (
      <>
        <PageTitle title="Stock " />
        <Stock />
      </>
    ),
  },
  {
    path: '/vendedor/stock/registrar',
    element: (
      <>
        <PageTitle title="Stock Registrar Producto" />
        <RegistrarProducto />
      </>
    ),
  },
  {
    path: '/vendedor/stock/:id/editar',
    element: (
      <>
        <PageTitle title="Stock Registrar Producto" />
        <EditarProducto />
      </>
    ),
  },
  {
    path: '/vendedor/stock/:id/informacion',
    element: (
      <>
        <PageTitle title="Stock Registrar Producto" />
        <InformacionProducto />
      </>
    ),
  },
  {
    path: '/vendedor/perfil',
    element: (
      <>
        <PageTitle title="Perfil" />
        <Perfil />
      </>
    ),
  },
  {
    path: '/cliente/',
    element: (
      <>
        <PageTitle title="Lucy Mundo de Pijamas" />
        <Inicio />
      </>
    ),
  },
  {
    path: '/cliente/login',
    element: (
      <>
        <PageTitle title="Lucy Mundo de Pijamas Login " />
        <Login />
      </>
    ),
  },
  {
    path: '/cliente/reset-password',
    element: (
      <>
        <PageTitle title="Lucy Mundo de Pijamas Reset Password " />
        <ResetPassword />
      </>
    ),
  },
  {
    path: '/cliente/productos',
    element: (
      <>
        <PageTitle title="Lucy Mundo de Pijamas Productos" />
        <Productos />
      </>
    ),
  },
  {
    path: '/cliente/producto/:id/informacion',
    element: (
      <>
        <PageTitle title="Lucy Mundo de Pijamas" />
        <InfoProductoCliente />
      </>
    ),
  },
  {
    path: '/cliente/pago',
    element: (
      <>
        <PageTitle title="Lucy Mundo de Pijamas Pago pedido " />
        <Checkout />
      </>
    ),
  },
  {
    path: '/cliente/pedido/:ref',
    element: (
      <>
        <PageTitle title="Lucy Mundo de Pijamas Pedido" />
        <PedidoCliente />
      </>
    ),
  },
  {
    path: '/cliente/preguntas-frecuentes',
    element: (
      <>
        <PageTitle title="Lucy Mundo de Pijamas Preguntas Frecuentes " />
        <PreguntasFrecuentres />
      </>
    ),
  },
  {
    path: '/cliente/pqr',
    element: (
      <>
        <PageTitle title="Lucy Mundo de Pijamas PQR " />
        <PQR />
      </>
    ),
  },
  {
    path: '/cliente/registrar-cliente',
    element: (
      <>
        <PageTitle title="Registrar Cliente" />
        <RegistrarCliente />
      </>
    ),
  },
];
