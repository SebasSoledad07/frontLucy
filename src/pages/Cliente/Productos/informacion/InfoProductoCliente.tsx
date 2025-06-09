import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { Carousel } from 'react-responsive-carousel';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useClienteContext } from '../../../../Context/ClienteContext';
import { Producto } from '../../../../types/producto';

const InfoProductoCliente = () => {
  const { productos, agregarAlCarrito } = useClienteContext();
  const { id } = useParams<{ id: string }>();
  const idNumber: number = parseInt(id ?? '0', 10);

  const producto: Producto | undefined = productos?.find(
    (item: Producto) => item.id === idNumber,
  );

  if (!producto) {
    return (
      <p className="mt-8 font-semibold text-red-500 text-center">
        Producto no encontrado
      </p>
    );
  }

  return (
    <motion.div
      className="mx-auto p-8 max-w-7xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="flex md:flex-row flex-col gap-8"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {/* Carrusel de imágenes */}
        <motion.div className="md:w-1/2" whileHover={{ scale: 1.05 }}>
          {producto.imagenes?.length > 0 && (
            <Carousel
              autoPlay
              infiniteLoop
              showThumbs={false}
              className="rounded-lg"
            >
              {producto.imagenes.map((imagen, idx) => (
                <div key={idx}>
                  <img
                    src={URL.createObjectURL(imagen)}
                    alt={`${producto.nombre} - ${idx + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </Carousel>
          )}
        </motion.div>

        {/* Información del producto */}
        <motion.div
          className="md:w-1/2"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 80 }}
        >
          <p className="mb-4 font-bold text-gray-700 text-lg">
            {/* Aquí solo mostramos el ID de la subcategoría, porque no tienes nombre */}
            Subcategoría ID: {producto.subcategoriaId}
          </p>

          <h1 className="mb-4 font-bold text-3xl">{producto.nombre}</h1>

          <p className="mb-2 text-lg">PRECIO: ${producto.precioVenta}</p>
          <p className="mb-2 text-lg">STOCK: {producto.agregarStock}</p>

          <button
            onClick={() => agregarAlCarrito(producto.id)}
            className="bg-blue-600 hover:bg-blue-700 mt-4 px-4 py-2 rounded-lg text-white"
          >
            Agregar al carrito
          </button>

          {/* Aquí no tienes campo recomendado, lo elimino */}

          <p className="mt-6 text-gray-700 text-lg">
            <strong>Descripción:</strong> {producto.descripcion}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default InfoProductoCliente;
