import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
import { BiSolidLike } from 'react-icons/bi';
import { motion } from 'framer-motion';

import { useClienteContext } from '../../../../Context/ClienteContext';

const ProductList: React.FC<{
  filteredProductos: any[];
  formatCurrency: (value: number) => string;
}> = ({ filteredProductos, formatCurrency }) => {
  const { agregarAlCarrito } = useClienteContext();
  const navigate = useNavigate();
  const handleClick = (id: number) => {
    navigate(`/cliente/producto/${id}/informacion`);
  };
  return (
    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 dark:bg-slate-900 p-4 dark:border dark:border-t">
      {filteredProductos?.map((producto, index) => (
        <motion.div
          key={producto.id}
          className="relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          {producto.imagenes?.length > 0 ? (
            <Carousel
              showThumbs={false}
              infiniteLoop
              className="rounded-lg"
              onClickItem={() => handleClick(producto.id)}
            >
              {producto.imagenes.map((imagen: any, idx: number) => {
                let imageUrl = '/placeholder.jpg';
                if (typeof imagen === 'object') {
                  if (imagen.data) {
                    imageUrl = `data:image/jpeg;base64,${imagen.data}`;
                  } else if (imagen.url) {
                    imageUrl = imagen.url.startsWith('http')
                      ? imagen.url
                      : `/` + imagen.url.replace(/^\//, '');
                  }
                } else if (typeof imagen === 'string') {
                  imageUrl = imagen;
                }
                return (
                  <div key={idx} style={{ width: '300px', height: '300px' }}>
                    <img
                      src={imageUrl}
                      alt={`${producto.nombre} - ${idx + 1}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </Carousel>
          ) : (
            <div style={{ width: '300px', height: '300px' }}>
              <img
                src="/placeholder.jpg"
                alt={producto.nombre}
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-4">
            <div
              onClick={() => handleClick(producto.id)}
              className="cursor-pointer"
            >
              <h3 className="mb-2 font-semibold text-lg">
                {producto.nombre.length > 22
                  ? producto.nombre.substring(0, 22) + '...'
                  : producto.nombre}
              </h3>
              <div className="flex justify-between">
                <p className="mb-2 text-gray-600">{producto.marca.nombre} </p>
                {producto.recomendado && (
                  <BiSolidLike className="text-blue-700" title="Recomendado" />
                )}
              </div>

              <p className="mb-2 font-semibold text-gray-800">
                {formatCurrency(producto.precioVenta || 0)}
              </p>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 mt-2 px-4 py-2 rounded w-full font-medium text-white"
              onClick={() => agregarAlCarrito(producto.id)}
            >
              Agregar al carrito
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductList;
