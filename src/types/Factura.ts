import Cliente from './Cliente';
import FacturaProducto from './FacturaProducto';

interface Factura {
  metodoPago: string;
  productos: FacturaProducto[];
  cliente: Cliente;
}

export default Factura;
