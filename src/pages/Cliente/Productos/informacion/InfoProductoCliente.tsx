import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useClienteContext } from '../../../../Context/ClienteContext';
import { Producto } from '../../../../types/Producto';
import { motion } from 'framer-motion';

const InfoProductoCliente = () => {
  const { productos, agregarAlCarrito } = useClienteContext();
  const { id } = useParams<{ id: string }>();
  const idNumber: number = parseInt(id ?? '0', 10);

  const producto: Producto | undefined = productos?.find(
    (item: Producto) => item.id === idNumber,
  );

  if (!producto) {
    return (
      <p className="text-center text-red-500 font-semibold mt-8">
        Producto no encontrado
      </p>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="flex flex-col md:flex-row gap-8"
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
          <p className="font-bold text-lg text-gray-700 mb-4">
            {/* Aquí solo mostramos el ID de la subcategoría, porque no tienes nombre */}
            Subcategoría ID: {producto.subcategoriaId}
          </p>

          <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>

          <p className="text-lg mb-2">PRECIO: ${producto.precioVenta}</p>
          <p className="text-lg mb-2">STOCK: {producto.agregarStock}</p>

          <button
            onClick={() => agregarAlCarrito(producto.id)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Agregar al carrito
          </button>

          {/* Aquí no tienes campo recomendado, lo elimino */}

          <p className="text-lg text-gray-700 mt-6">
            <strong>Descripción:</strong> {producto.descripcion}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default InfoProductoCliente;
