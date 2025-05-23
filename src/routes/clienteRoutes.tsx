import { RouteObject } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Inicio from '../pages/Cliente/Inicio';
import PQR from '../pages/Cliente/PQR/PQR';
import PreguntasFrecuentres from '../pages/Cliente/Preguntas/PreguntasFrecuentres';
import PedidoCliente from '../pages/Cliente/Pedido/Pedido';
import Checkout from '../pages/Cliente/Pago/Checkout';
import InfoProductoCliente from '../pages/Cliente/Productos/informacion/InfoProductoCliente';
import Productos from '../pages/Cliente/Productos/Productos';
import ResetPassword from '../pages/Authentication/ResetPassword';
import Login from '../pages/Authentication/Login';

export const clienteRoutes: RouteObject[] = [
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
];
export default clienteRoutes;
