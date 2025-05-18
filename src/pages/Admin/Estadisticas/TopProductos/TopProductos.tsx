import React, { useMemo } from 'react';
import { Producto } from '../../../../types/Producto';

interface ProductoFactura {
  id: number;
  nombre: string;
  cantidad: number;
  producto: Producto;
}

interface Factura {
  productos: ProductoFactura[];
}

interface TopProductosProps {
  facturas: Factura[];
}

const TopProductos: React.FC<TopProductosProps> = ({ facturas }) => {
  // Calcular productos más vendidos
  const productSales = useMemo(() => {
    const sales: Record<string, number> = {};

    facturas.forEach((factura) => {
      factura.productos.forEach((producto) => {
        const productName = producto.producto.nombre;
        const cantidad = producto.cantidad;

        if (sales[productName]) {
          sales[productName] += cantidad;
        } else {
          sales[productName] = cantidad;
        }
      });
    });

    return Object.entries(sales)
      .map(([name, cantidad]) => ({ name, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad); // Orden de mayor a menor
  }, [facturas]);

  return (
    <div className="p-4 bg-[#FFFFFF] mb-3 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-[#7A5B47] mb-4">
        Productos Más Vendidos
      </h2>

      {/* Tabla de productos más vendidos */}
      <table className="min-w-full divide-y divide-[#F4B1C7] rounded-lg border border-[#F4B1C7] shadow-sm">
        <thead className="bg-[#B695E0]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
              Cantidad Vendida
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F4B1C7]">
          {productSales.map((product) => (
            <tr key={product.name}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#3A3A3A]">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[#C29678]">
                {product.cantidad}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopProductos;
