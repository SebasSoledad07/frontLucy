import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EstadoPedido from './Estado/Estado';
import { FaUser } from 'react-icons/fa';
import { MdOutlinePayments } from 'react-icons/md';
import Productos from './Productos/Productos';
import ExperienciaCompra from './Experiencia/ExperienciaCompra';


const PedidoCliente = () => {
  const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;
  const [pedidoCliente, setPedidoCliente] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { ref } = useParams();
  useEffect(() => {
    console.log(pedidoCliente);
    if(pedidoCliente?.data?.experienciaCompra===null){
      setIsOpen(true);
    }else{
      
    setIsOpen(false);
    }
  }, [pedidoCliente]);
  useEffect(() => {
    // Fetch order details by reference
    if (!ref) return;
    axios
      .get(BASE_URL + 'factura/cliente/ref/informacion/' + ref)
      .then((response) => {
        console.log(response.data);
        setPedidoCliente(response.data);
      })
      .catch((error) => {
        console.error('Error fetching order details:', error);
      });
  }, [ref]);



  if (!pedidoCliente)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Buscando referencia...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-8 border rounded-lg mt-10">
      <h1 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4 flex justify-between items-center">
        PEDIDO
        <span>{ref}</span>
      </h1>
      {isOpen === true && (
        <ExperienciaCompra isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      <div className="mb-8 border-b">
        <EstadoPedido estados={pedidoCliente?.data?.estados} />
        <div className="justify-center text-center mb-4">
          {pedidoCliente?.data?.guia !== null && (
            <h2 className="text-xl font-semibold text-gray-700  text-center uppercase">
              N° GUIA {pedidoCliente?.data?.guia}
            </h2>
          )}

          {pedidoCliente?.data?.paginaSeguimiento !== null && (
            <Link
              to={pedidoCliente?.data?.paginaSeguimiento}
              target="_blank"
              className="text-xl font-semibold text-blue-700 mb-0 text-center mb-4 uppercase"
            >
              Rastrear el envío
            </Link>
          )}
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center uppercase">
        Información del Pedido
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
        <div className="mb-8">
          <h3 className=" font-semibold text-gray-700 mb-4 flex items-center">
            <FaUser className="mr-2" />
            CLIENTE
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <p>
              <span className="font-bold">Nombre:</span>{' '}
              {pedidoCliente?.data?.cliente?.nombre}{' '}
              {pedidoCliente?.data?.cliente?.apellido}
            </p>
            <p>
              <span className="font-bold">Celular:</span>{' '}
              {pedidoCliente?.data?.cliente?.celular}
            </p>

            <p>
              <span className="font-bold">Email:</span>{' '}
              {pedidoCliente?.data?.cliente?.email}
            </p>
          </div>
        </div>

        <div>
          <h3 className=" font-semibold text-gray-700 mb-4 flex items-center">
            <MdOutlinePayments className="mr-2" /> PAGO
          </h3>
          <div className="flex justify-between   mb-2 gap-2">
            <h2 className=" font-bold text-gray-700 ">Metodo: </h2>
            <p className="text-gray-800  ">{pedidoCliente?.data?.metodoPago}</p>
          </div>

          <div className="flex justify-between  mb-2 gap-2">
            <h2 className=" font-bold text-gray-700 ">Total: </h2>
            <p className="text-gray-800  ">$ {pedidoCliente?.data?.total}</p>
          </div>
        </div>
      </div>

      <Productos productos={pedidoCliente?.data?.productos} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
        <div className="mb-8">
          <h3 className=" font-semibold text-gray-700 mb-4 flex items-center">
            DIRECCIÓN DE ENVIO
          </h3>
          <p>
            {pedidoCliente?.data?.cliente?.nombre}{' '}
            {pedidoCliente?.data?.cliente?.apellido}{' '}
          </p>
          <p>{pedidoCliente?.data?.cliente?.direccion} </p>
          <p>{pedidoCliente?.data?.cliente?.departamento} </p>
          <p>{pedidoCliente?.data?.cliente?.ciudad}</p>
          <p>{pedidoCliente?.data?.cliente?.celular}</p>
        </div>
        <div>
          <h3 className=" font-semibold text-gray-700 mb-4 flex items-center">
            RESUMEN PAGO
          </h3>

          <div className="flex justify-between   mb-2 gap-2">
            <h2 className=" font-bold text-gray-700 ">Metodo: </h2>
            <p className="text-gray-800  ">{pedidoCliente?.data?.metodoPago}</p>
          </div>
          <div className="flex justify-between  mb-2 gap-2">
            <h2 className=" font-bold text-gray-700 ">SubTotal: </h2>
            <p className="text-gray-800  ">$ {pedidoCliente?.data?.total}</p>
          </div>
          <div className="flex justify-between  mb-2 gap-2 border-b">
            <h2 className=" font-bold text-gray-700 ">Envio: </h2>
            <p className="text-gray-800  ">$ {pedidoCliente?.data?.envio}</p>
          </div>

          <div className="flex justify-between  mb-2 gap-2 mt-1">
            <h2 className=" font-bold text-gray-700 ">Total: </h2>
            <p className="text-gray-800  ">$ {pedidoCliente?.data?.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoCliente;
