import { useMemo, useEffect, useState } from 'react';

import ChartVentasPorMes from '../../../components/Charts/ChartVentasPorMes';
import { usePedidoContext } from '../../../Context/PedidoContext';
import ChartThree from '../../../components/Charts/ChartThree';
import ChartTwo from '../../../components/Charts/ChartTwo';
import TopProductos from './TopProductos/TopProductos';
import { useAuth } from '../../../Context/AuthContext';

const BASE_URL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_URL_BACKEND_PROD
    : import.meta.env.VITE_URL_BACKEND_LOCAL;

const Estadisticas = () => {
  const { pedidos }: { pedidos: any[] } = usePedidoContext();
  const { user } = useAuth();
  const [ventasPorMes, setVentasPorMes] = useState<
    { mes: number; total: number }[]
  >([]);
  const [ventasError, setVentasError] = useState<string | null>(null);

  const productSales = useMemo(() => {
    const sales: Record<string, number> = {}; // Objeto para almacenar las ventas

    pedidos?.forEach((pedido: any) => {
      if (Array.isArray(pedido.productos)) {
        pedido.productos.forEach((prod: any) => {
          const productName = prod.producto?.nombre || 'Producto Desconocido'; // Validación básica
          const cantidad = prod.cantidad || 0;

          if (sales[productName]) {
            sales[productName] += cantidad;
          } else {
            sales[productName] = cantidad;
          }
        });
      }
    });

    return Object.entries(sales).map(([name, cantidad]) => ({
      name,
      cantidad,
    }));
  }, [pedidos]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setVentasError('No autenticado');
      setVentasPorMes([]);
      return;
    }
    fetch(`${BASE_URL}/api/reportes/ventas-mes`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('No autorizado o error de red');
        return res.json();
      })
      .then((data) => setVentasPorMes(Array.isArray(data) ? data : []))
      .catch((err) => {
        setVentasError('No autorizado o error de red');
        setVentasPorMes([]);
        console.error('Error fetching ventas por mes:', err);
      });
  }, []);

  return (
    <div>
      <ChartThree productSales={productSales} />
      {ventasError ? (
        <div className="my-4 font-bold text-red-500">{ventasError}</div>
      ) : (
        <ChartVentasPorMes data={ventasPorMes} />
      )}
    </div>
  );
};

export default Estadisticas;
