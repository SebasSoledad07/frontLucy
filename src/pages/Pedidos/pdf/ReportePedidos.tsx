import React, { useState, useMemo } from 'react';
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf';

interface Producto {
  cantidad: number;
  precio: number;
  total: number;
  producto: {
    nombre: string;
    precioCompra: number;
    precioVenta: number;
  };
}

interface Pedido {
  id: number;
  fechaRegistro: string;
  productos: Producto[];
}

interface ReportePedidosProps {
  pedidos: Pedido[];
}

const ReportePedidos: React.FC<ReportePedidosProps> = ({ pedidos }) => {
  const [filtro, setFiltro] = useState<'diario' | 'semanal' | 'mensual'>(
    'diario',
  );
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [semanaSeleccionada, setSemanaSeleccionada] = useState<string>('');
  const [mesSeleccionado, setMesSeleccionado] = useState<string>('');

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((pedido) => {
      const fechaPedido = new Date(pedido.fechaRegistro);
      if (filtro === 'diario' && fechaSeleccionada) {
        return pedido.fechaRegistro?.split('T')[0] === fechaSeleccionada;
      } else if (filtro === 'semanal' && semanaSeleccionada) {
        const [año, semana] = semanaSeleccionada.split('-W').map(Number);
        const fechaInicioSemana = new Date(año, 0, 1 + (semana - 1) * 7);
        const fechaFinSemana = new Date(fechaInicioSemana);
        fechaFinSemana.setDate(fechaInicioSemana.getDate() + 6);

        return (
          fechaPedido >= fechaInicioSemana && fechaPedido <= fechaFinSemana
        );
      } else if (filtro === 'mensual' && mesSeleccionado) {
        const [año, mes] = mesSeleccionado.split('-').map(Number);
        return (
          fechaPedido.getFullYear() === año &&
          fechaPedido.getMonth() === mes - 1
        );
      }
      return false;
    });
  }, [pedidos, filtro, fechaSeleccionada, semanaSeleccionada, mesSeleccionado]);

  const totales = useMemo(() => {
    let totalVenta = 0;
    let totalCompra = 0;

    pedidosFiltrados.forEach((pedido) => {
      pedido.productos.forEach((producto) => {
        totalVenta += producto.producto.precioVenta * producto.cantidad;
        totalCompra += producto.producto.precioCompra * producto.cantidad;
      });
    });

    return {
      totalVenta,
      totalCompra,
      ganancia: totalVenta - totalCompra,
    };
  }, [pedidosFiltrados]);

  const generarPDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('Informe de Ventas', 14, 20);

    // Filtro seleccionado
    doc.setFontSize(12);
    const filtroTexto =
      filtro === 'diario'
        ? `Fecha: ${fechaSeleccionada}`
        : filtro === 'semanal'
        ? `Semana: ${semanaSeleccionada}`
        : `Mes: ${mesSeleccionado}`;
    doc.text(`Filtro: ${filtroTexto}`, 14, 30);

    // Totales
    doc.text(`Total Venta: $${totales.totalVenta.toFixed(2)}`, 14, 40);
    doc.text(`Total Compra: $${totales.totalCompra.toFixed(2)}`, 14, 50);
    doc.text(`Ganancia: $${totales.ganancia.toFixed(2)}`, 14, 60);

    // Detalle de pedidos
    const rows = pedidosFiltrados.flatMap((pedido) =>
      pedido.productos.map((producto) => [
        new Date(pedido.fechaRegistro).toLocaleDateString(),
        producto.producto.nombre,
        producto.cantidad,
        `$${producto.producto.precioCompra.toFixed(2)}`,
        `$${producto.producto.precioVenta.toFixed(2)}`,
        `$${(
          producto.producto.precioVenta - producto.producto.precioCompra
        ).toFixed(2)}`,
      ]),
    );

    autoTable(doc, {
      startY: 70,
      head: [
        [
          'Fecha',
          'Producto',
          'Cantidad',
          'Precio Compra',
          'Precio Venta',
          'Ganancia',
        ],
      ],
      body: rows,
    });

    // Descargar PDF
    doc.save(`Reporte-${filtro}.pdf`);
  };

  const filtroValido =
    (filtro === 'diario' && fechaSeleccionada) ||
    (filtro === 'semanal' && semanaSeleccionada) ||
    (filtro === 'mensual' && mesSeleccionado);

  return (
    <div>
      {/* <p className="mb-3 text-semibold">
        Para generar un <strong> informe</strong>, seleccione un filtro y un
        rango de fecha (dia , semana o mes).
      </p> */}
      <div className="flex justify-between">
        {/* Selector de filtro */}
        <div className="mb-4">
          <label htmlFor="filtro" className="mr-2">
            Seleccionar filtro:
          </label>
          <select
            id="filtro"
            value={filtro}
            onChange={(e) =>
              setFiltro(e.target.value as 'diario' | 'semanal' | 'mensual')
            }
            className="px-2 py-1 border rounded"
          >
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
          </select>
        </div>
        {/* Inputs dinámicos según el filtro */}
        {filtro === 'diario' && (
          <div className="mb-4">
            <label htmlFor="fecha" className="mr-2">
              Seleccionar fecha:
            </label>
            <input
              type="date"
              id="fecha"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="px-2 py-1 border rounded"
            />
          </div>
        )}
        {filtro === 'semanal' && (
          <div className="mb-4">
            <label htmlFor="semana" className="mr-2">
              Seleccionar semana:
            </label>
            <input
              type="week"
              id="semana"
              value={semanaSeleccionada}
              onChange={(e) => setSemanaSeleccionada(e.target.value)}
              className="px-2 py-1 border rounded"
            />
          </div>
        )}
        {filtro === 'mensual' && (
          <div className="mb-4">
            <label htmlFor="mes" className="mr-2">
              Seleccionar mes:
            </label>
            <input
              type="month"
              id="mes"
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(e.target.value)}
              className="px-2 py-1 border rounded"
            />
          </div>
        )}
        {/* Botón para generar PDF
        <button
          className={`block w-auto py-1 mb-3 px-1 font-medium text-sm text-center active:shadow-none rounded-lg shadow ${
            filtroValido
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500'
          }`}
          onClick={generarPDF}
          disabled={!filtroValido}
        >
          Descargar Informe
        </button> */}
      </div>
    </div>
  );
};

export default ReportePedidos;
