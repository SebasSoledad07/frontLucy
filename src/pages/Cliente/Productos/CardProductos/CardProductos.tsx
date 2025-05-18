import { motion } from 'framer-motion';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
import { useClienteContext } from '../../../../Context/ClienteContext';
import { BiSolidLike } from 'react-icons/bi';

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
    <div className="grid  p-4  grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  dark:bg-slate-900 dark:border-t dark:border">
      {filteredProductos?.map((producto, index) => (
        <motion.div
          key={producto.id}
          className="relative overflow-hidden "
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
              {producto.imagenes.map((imagen: any, idx: number) => (
                <div key={idx} style={{ width: '300px', height: '300px' }}>
                  <img
                    src={imagen.imagen}
                    alt={`${producto.nombre} - ${idx + 1}`}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div style={{ width: '300px', height: '300px' }}>
              <img
                src="/placeholder.jpg"
                alt={producto.nombre}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          )}

          <div className="p-4">
            <div
              onClick={() => handleClick(producto.id)}
              className="cursor-pointer"
            >
              <h3 className="mb-2 text-lg font-semibold">
                {producto.nombre.length > 22
                  ? producto.nombre.substring(0, 22) + '...'
                  : producto.nombre}
              </h3>
              <div className='flex justify-between'>
              <p className="mb-2 text-gray-600">{producto.marca.nombre} </p>
              {producto.recomendado && <BiSolidLike className='text-blue-700' title="Recomendado" />}
              </div>
              
              <p className="mb-2 text-gray-800 font-semibold">
                {formatCurrency(producto.precioVenta || 0)}
              </p>
            </div>
            <button className="mt-2 w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
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
