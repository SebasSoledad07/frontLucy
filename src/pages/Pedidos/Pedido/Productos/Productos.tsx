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
            <div className="w-32 h-32 flex-shrink-0 bg-gray-100 flex items-center justify-center">
              {producto?.imagenes?.[0]?.imagen ? (
                <img
                  src={producto.imagenes[0].imagen}
                  alt={producto.nombre}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-sm text-gray-500">Sin imagen</span>
              )}
            </div>

            <div className="ml-6 flex-grow">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                {producto.nombre}
              </h2>

              <Link
                className="underline text-blue-600 font-bold"
                to={`/cliente/producto/${producto.id}/informacion`}
              >
                <p className="text-base text-gray-700 mb-1">
                  {producto.descripcion}
                </p>
              </Link>

              <p className="text-xs text-gray-600 mb-1">
                Categoría: {producto?.subcategoria?.categoria?.nombre} -{' '}
                {producto?.subcategoria?.nombre}
              </p>

              <p className="text-xs text-gray-600">
                Género: {producto.genero} | Activo: {producto.activo ? 'Sí' : 'No'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Productos;

