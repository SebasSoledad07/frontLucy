import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { usePedidoContext } from '../../Context/PedidoContext';
import { FaInfoCircle } from 'react-icons/fa';
import { useUserContext } from '../../Context/UserContext';
import FacturaPDF from './pdf/FacturaPDF';
import ReportePedidos from './pdf/ReportePedidos';

const Pedidos = () => {
  const { modulo } = useUserContext();
  const { pedidos } = usePedidoContext();

  // Ordenar los pedidos en orden inverso por `id`
  const pedidosOrdenados = [...pedidos].sort((a, b) => b.id - a.id);

  return (
    <div className="container mx-auto ">
      <Breadcrumb pageName="Pedidos" lastPage="" />
      <ReportePedidos pedidos={pedidos}/>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                ID
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                Cliente
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                Estado
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                Total
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                Fecha Registro
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                Detalles
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">
                Factura
              </th>
            </tr>
          </thead>
          <tbody>
            {pedidosOrdenados.map((pedido) => (
              <tr
                key={pedido.id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="py-3 px-4 text-sm text-gray-900 border-b">
                  {pedido.id}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 border-b">
                  {pedido.cliente.nombre} {pedido.cliente.apellido}
                  <p>{pedido.cliente.documento}</p>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 border-b">
                  {pedido?.estados[pedido?.estados.length - 1]?.estado?.nombre}{' '}
                  {
                    pedido?.estados[
                      pedido?.estados.length - 1
                    ].fechaRegistro?.split('T')[0]
                  }
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 border-b">
                  ${pedido.total.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 border-b">
                  {new Date(pedido.fechaRegistro).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 border-b  ">
                  <Link to={`/${modulo}/pedido/informacion/${pedido.ref}`}>
                    <FaInfoCircle className="w-5 h-5 text-blue-500 hover:text-blue-700  cursor-pointer" />
                  </Link>
                  
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 border-b  ">
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
