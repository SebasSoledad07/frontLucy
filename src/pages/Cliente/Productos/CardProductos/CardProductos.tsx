import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
import { BiSolidLike } from 'react-icons/bi';
import { motion } from 'framer-motion';

import { useCart } from '../../../../Context/CartContext';

const ProductList: React.FC<{
  filteredProductos: any[];
  formatCurrency: (value: number) => string;
}> = ({ filteredProductos, formatCurrency }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div>
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 dark:bg-slate-900 p-4 dark:border dark:border-t">
        {filteredProductos.length > 0 ? (
          filteredProductos.flatMap((producto, index) => {
            const variantes =
              producto.variante && Array.isArray(producto.variante)
                ? producto.variante
                : [{ ...producto, isFallback: true }];
            return variantes.map((variante: any, idx: number) => (
              <motion.div
                key={variante.id || `${producto.id}-fallback`}
                className="relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + idx) * 0.05 }}
              >
                {producto.imagenes?.length > 0 ? (
                  <Carousel
                    showThumbs={false}
                    infiniteLoop
                    className="rounded-lg"
                    onClickItem={() =>
                      navigate(`/cliente/producto/${producto.id}/informacion`)
                    }
                  >
                    {producto.imagenes.map((imagen: any, i: number) => {
                      let imageUrl = '/placeholder.png';

                      return (
                        <div
                          key={i}
                          style={{ width: '300px', height: '300px' }}
                        >
                          <img
                            src={imageUrl}
                            alt={`${producto.nombre ?? 'Producto'} - ${i + 1}`}
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
                      src="/placeholder.png"
                      alt={producto.nombre ?? 'Producto'}
                      className="rounded-lg w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div
                    onClick={() =>
                      navigate(`/cliente/producto/${producto.id}/informacion`)
                    }
                    className="cursor-pointer"
                  >
                    <h3 className="mb-2 font-semibold text-lg">
                      {producto.nombre && producto.nombre.length > 22
                        ? producto.nombre.substring(0, 22) + '...'
                        : producto.nombre ?? 'Sin nombre'}
                    </h3>
                    <div className="flex justify-between">
                      <p className="mb-2 text-gray-600">
                        {producto.marca?.nombre ?? ''}{' '}
                      </p>
                      {producto.recomendado && (
                        <BiSolidLike
                          className="text-blue-700"
                          title="Recomendado"
                        />
                      )}
                    </div>
                    {/* Variante info */}
                    {!variante.isFallback && (
                      <>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-bold">Talla:</span>
                          <span>{variante.talla?.nombre}</span>
                        </div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-bold">Stock:</span>
                          <span>{variante.stockActual}</span>
                        </div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-bold">Precio:</span>
                          <span>
                            {formatCurrency(variante.precioVenta || 0)}
                          </span>
                        </div>
                        {variante.porcentajeDescuento > 0 && (
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-bold text-green-600">
                              Descuento:
                            </span>
                            <span className="text-green-600">
                              {variante.porcentajeDescuento}%
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 mt-2 px-4 py-2 rounded w-full font-medium text-white"
                    onClick={() => {
                      addToCart(
                        {
                          ...producto,
                          precio: !variante.isFallback
                            ? variante.precioVenta
                            : producto.precio,
                          precioVenta: !variante.isFallback
                            ? variante.precioVenta
                            : producto.precioVenta,
                          talla: !variante.isFallback
                            ? variante.talla
                            : undefined,
                          stockActual: !variante.isFallback
                            ? variante.stockActual
                            : undefined,
                          porcentajeDescuento: !variante.isFallback
                            ? variante.porcentajeDescuento
                            : undefined,
                          imagenes: producto.imagenes,
                        },
                        !variante.isFallback ? variante.talla?.id : undefined,
                      );
                    }}
                    disabled={!variante.isFallback && variante.stockActual <= 0}
                  >
                    {!variante.isFallback && variante.stockActual <= 0
                      ? 'Sin stock'
                      : 'Agregar al carrito'}
                  </button>
                </div>
              </motion.div>
            ));
          })
        ) : (
          <p className="text-[#7A5B47]">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
