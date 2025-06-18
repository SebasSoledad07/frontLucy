import PedidoProducto from './PedidoProducto';
import Administrativo from './Administrativo';
import Factura from './Factura';

export interface Pedido {
  id: number;
  factura: Factura;
  estado: string;
  fechaCreacion: string;
  fechaEntrega?: string | null;
  responsable: Administrativo;
  items: PedidoProducto[];
}

export default Pedido;
