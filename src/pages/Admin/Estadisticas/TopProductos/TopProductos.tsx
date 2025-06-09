import React, { useMemo } from 'react';

import { Producto } from '../../../../types/producto';

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
    <div className="bg-[#FFFFFF] shadow-sm mb-3 p-4 rounded-lg">
      <h2 className="mb-4 font-bold text-[#7A5B47] text-xl">
        Productos Más Vendidos
      </h2>

      {/* Tabla de productos más vendidos */}
      <table className="shadow-sm border border-[#F4B1C7] rounded-lg divide-y divide-[#F4B1C7] min-w-full">
        <thead className="bg-[#B695E0]">
          <tr>
            <th className="px-6 py-3 font-medium text-white text-xs text-left uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 font-medium text-white text-xs text-right uppercase tracking-wider">
              Cantidad Vendida
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F4B1C7]">
          {productSales.map((product) => (
            <tr key={product.name}>
              <td className="px-6 py-4 font-medium text-[#3A3A3A] text-sm whitespace-nowrap">
                {product.name}
              </td>
              <td className="px-6 py-4 text-[#C29678] text-sm text-right whitespace-nowrap">
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
