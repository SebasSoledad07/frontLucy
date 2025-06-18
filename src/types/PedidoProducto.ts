import { Producto } from './producto';

export interface PedidoProducto {
  id: number;
  pedidoId: number;
  producto: Producto;
  tallaId: number;
  cantidad: number;
}

export default PedidoProducto;
