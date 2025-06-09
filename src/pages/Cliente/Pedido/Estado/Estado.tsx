// Nuevo componente EstadoPedido
import { useState } from 'react';

const EstadoPedido = ({ estados }: { estados: any[] }) => {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const estadosBase = ['RECIBIDO', 'PREPARACION', 'ENVIADO', 'ENTREGADO'];
  const estadoActual = estados[estados.length - 1]?.estado?.nombre;
  let estadosAMostrar = [...estadosBase];
  if (estadoActual === 'CANCELADO' || estadoActual === 'DEVOLUCION') {
    estadosAMostrar.push('EXCEPCION', estadoActual);
  } else if (!estadosBase.includes(estadoActual)) {
    estadosAMostrar.push(estadoActual);
  }


  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center uppercase">
        Estado del Pedido
      </h2>
      <ul
        aria-label="Steps"
        className="items-center text-gray-600 font-medium md:flex"
      >
        {estadosAMostrar?.map((estado, idx) => (
          <li
            key={idx}
            className="flex gap-x-3 md:flex-col md:flex-1 md:gap-x-0"
          >
            <div className="flex flex-col items-center md:flex-row md:flex-1">
              <hr
                className={`w-full border hidden md:block ${
                  idx === 0 ? 'border-none' : ''
                } ${
                  idx <=
                  estados.findIndex((e) => e.estado?.nombre === estadoActual)
                    ? 'border-green-600'
                    : ''
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${
                  idx <=
                  estados.findIndex((e) => e.estado?.nombre === estadoActual)
                    ? 'bg-gray-600 border-green-600'
                    : ''
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full bg-green-600 ${
                    estado !== estadoActual ? 'hidden' : ''
                  }`}
                ></span>
                {estado !== estadoActual && estadosBase.includes(estado) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </div>
              <hr
                className={`h-12 border md:w-full md:h-auto ${
                  idx + 1 === estadosAMostrar.length ? 'border-none' : ''
                } ${
                  idx <=
                  estados.findIndex((e) => e.estado?.nombre === estadoActual)
                    ? 'border-green-600'
                    : ''
                }`}
              />
            </div>
            <div className="h-8 flex justify-center items-center md:mt-3 md:h-auto">
              <h3
                className={`text-sm ${
                  idx <=
                  estados.findIndex((e) => e.estado?.nombre === estadoActual)
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {estado}
              </h3>
            </div>
          </li>
        ))}
      </ul>
    

      <div className="mb-8 w-full">
        <div className='flex justify-end '>
        <strong
        typeof="button"
          className="  px-4 py-2 rounded mt-4 cursor-pointer underline"
          onClick={() => setMostrarHistorial(!mostrarHistorial)}
        >
          {mostrarHistorial ? 'Ocultar Historial' : 'Ver Historial'}
        </strong>
        </div>
        {mostrarHistorial && (
          <div className="mt-4">
            <table className="table-xl border-collapse ">
              <thead>
                <tr>
                  <th className="px-4 py-2">   HISTORIAL DE ESTADOS</th>
                </tr>
              </thead>
              <tbody>
                {estados.map((estado, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{estado?.estado?.nombre}</td>
                    <td className="px-4 py-2">
                      {new Date(estado?.fechaRegistro).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{estado?.decipcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadoPedido;
