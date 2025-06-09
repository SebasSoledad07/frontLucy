import { useMemo } from "react";
import ChartThree from "../../../components/Charts/ChartThree";
import { usePedidoContext } from "../../../Context/PedidoContext";
import ChartTwo from "../../../components/Charts/ChartTwo";
import TopProductos from "./TopProductos/TopProductos";

const Estadisticas = () => {
  const { pedidos }: { pedidos: any[] } = usePedidoContext();

  const productSales = useMemo(() => {
    const sales: Record<string, number> = {}; // Objeto para almacenar las ventas

    pedidos?.forEach((pedido: any) => {
      pedido.productos.forEach((prod: any) => {
        const productName = prod.producto?.nombre || "Producto Desconocido"; // Validación básica
        const cantidad = prod.cantidad || 0;

        if (sales[productName]) {
          sales[productName] += cantidad;
        } else {
          sales[productName] = cantidad;
        }
      });
    });

    return Object.entries(sales).map(([name, cantidad]) => ({
      name,
      cantidad,
    }));
  }, [pedidos]);

  return (
    <div>
      <TopProductos facturas={pedidos} />
        <ChartTwo  facturas={pedidos} />
      <ChartThree productSales={productSales} />
    </div>
  );
};

export default Estadisticas;
