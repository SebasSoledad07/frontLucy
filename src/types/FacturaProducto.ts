import { Producto } from "./producto";

interface FacturaProducto {
    id: number;
  producto: Producto;
  cantidad: number;
}

export default FacturaProducto;