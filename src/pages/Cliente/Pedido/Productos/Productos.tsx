import { Link } from 'react-router-dom';

const Productos = ({ productos }: { productos: any[] }) => {
  return (
    <div className="mb-8">
      {productos?.map((producto: any, index: number) => (
        <div
          key={index}
          className="border-t border-b border-gray-300 py-4 mb-4"
        >
          <div className="flex items-center">
            <div className="w-32 h-32 flex-shrink-0">
              <img
                src={producto?.producto?.imagenes?.[0]?.imagen}
                alt={producto.producto.nombre}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="ml-6 flex-grow">
        
              <h2 className="text-lg font-bold text-gray-800 mb-2">
               
                  {producto?.producto?.marca?.nombre}
                
              </h2>
              <Link
                  className="underline text-blue-600 font-bold"
                  to={`/cliente/producto/${producto?.producto?.id}/informacion`}
                >
              <p className="text-base text-gray-700 mb-1">
                {producto?.producto?.nombre}
              </p>
              </Link>
              <p className="text-xs text-gray-600 mb-1">
                Categoria: {producto?.producto?.subCategoria?.categoria?.nombre}{' '}
                {producto?.producto?.subCategoria?.nombre}
              </p>
              <p className="text-xs text-gray-600">
                Catalogo: {producto?.producto?.catalogo?.nombre}
              </p>
            </div>
            <div className="  ml-6">
              <table className="table-auto w-full">
                <thead>
                  {' '}
                  <tr>
                    <td className="px-4 py-2">
                      <span className="font-bold">Precio</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="font-bold">Cantidad</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="font-bold">Subtotal</span>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2">
                      <span>${producto?.precio}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span>{producto?.cantidad}</span>
                    </td>
                    <td className="px-4 py-2">
                      ${producto?.precio * producto?.cantidad}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Productos;
