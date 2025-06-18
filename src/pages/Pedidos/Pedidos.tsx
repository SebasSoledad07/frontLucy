import { FaInfoCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { usePedidoContext } from '../../Context/PedidoContext';
import { useUserContext } from '../../Context/UserContext';
import ReportePedidos from './pdf/ReportePedidos';
import FacturaPDF from './pdf/FacturaPDF';

const ESTADO_PEDIDO_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

const Pedidos = () => {
  const { modulo } = useUserContext();
  const { pedidos, fetchPedidos } = usePedidoContext();
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [clienteFiltro, setClienteFiltro] = useState('');

  // Fetch pedidos when estadoFiltro changes
  useEffect(() => {
    fetchPedidos(estadoFiltro || undefined);
  }, [estadoFiltro]);

  // Ordenar y filtrar los pedidos
  const pedidosFiltrados = [...pedidos]
    .filter((pedido) => {
      if (!clienteFiltro) return true;
      const cliente = pedido.factura?.cliente;
      if (!cliente) return false;
      const nombreCompleto =
        `${cliente.nombre} ${cliente.apellido}`.toLowerCase();
      return nombreCompleto.includes(clienteFiltro.toLowerCase());
    })
    .sort((a, b) => b.id - a.id);

  return (
    <div className="mx-auto container">
      <Breadcrumb pageName="Pedidos" lastPage="" />
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block font-medium text-gray-700 text-sm">
            Estado:
          </label>
          <select
            className="px-2 py-1 border rounded"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="ENVIADO">Enviado</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
        <div>
          <label className="block font-medium text-gray-700 text-sm">
            Cliente:
          </label>
          <input
            className="px-2 py-1 border rounded"
            type="text"
            placeholder="Buscar cliente..."
            value={clienteFiltro}
            onChange={(e) => setClienteFiltro(e.target.value)}
          />
        </div>
      </div>
      <ReportePedidos pedidos={pedidosFiltrados} />
      <div className="max-w-full overflow-x-auto">
        <table className="border w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="bg-gray-2 dark:bg-meta-4 text-left">
              <th className="px-4 py-3 border-b font-medium text-gray-700 text-sm text-left">
                ID
              </th>
              <th className="px-4 py-3 border-b font-medium text-gray-700 text-sm text-left">
                Cliente
              </th>
              <th className="px-4 py-3 border-b font-medium text-gray-700 text-sm text-left">
                Estado
              </th>
              <th className="px-4 py-3 border-b font-medium text-gray-700 text-sm text-left">
                Total
              </th>
              <th className="px-4 py-3 border-b font-medium text-gray-700 text-sm text-left">
                Fecha Registro
              </th>
              <th className="px-4 py-3 border-b font-medium text-gray-700 text-sm text-left">
                Detalles
              </th>
              <th className="px-4 py-3 border-b font-medium text-gray-700 text-sm text-left">
                Factura
              </th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((pedido) => (
              <tr
                key={pedido.id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-4 py-3 border-b text-gray-900 text-sm">
                  {pedido.id}
                </td>
                <td className="px-4 py-3 border-b text-gray-900 text-sm">
                  {pedido.factura && pedido.factura.cliente ? (
                    <>
                      {pedido.factura.cliente.nombre}{' '}
                      {pedido.factura.cliente.apellido}
                      <p>{pedido.factura.cliente.documento}</p>
                    </>
                  ) : (
                    <span className="text-red-500">Sin cliente</span>
                  )}
                </td>
                <td className="px-4 py-3 border-b text-gray-900 text-sm">
                  {ESTADO_PEDIDO_LABELS[pedido.estado] || pedido.estado}
                </td>
                <td className="px-4 py-3 border-b text-gray-900 text-sm">
                  {pedido.totalPedido !== undefined
                    ? `$${pedido.totalPedido.toLocaleString()}`
                    : 'N/A'}
                </td>
                <td className="px-4 py-3 border-b text-gray-900 text-sm">
                  {pedido.fechaCreacion
                    ? pedido.fechaCreacion.replace('T', ' ').substring(0, 19)
                    : 'N/A'}
                </td>
                <td className="px-4 py-3 border-b text-gray-900 text-sm">
                  <Link
                    to={`/${modulo}/pedido/informacion/${
                      pedido.factura?.referencia || pedido.id
                    }`}
                  >
                    <FaInfoCircle className="w-5 h-5 text-blue-500 hover:text-blue-700 cursor-pointer" />
                  </Link>
                </td>
                <td className="px-4 py-3 border-b text-gray-900 text-sm">
                  <FacturaPDF factura={pedido} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pedidos;
