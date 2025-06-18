import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
import { BiSolidLike } from 'react-icons/bi';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { useCart } from '../../../../Context/CartContext';

const ProductList: React.FC<{
  filteredProductos: any[];
  formatCurrency: (value: number) => string;
}> = ({ filteredProductos, formatCurrency }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<any>(null);
  const [selectedVariante, setSelectedVariante] = useState<any>(null);

  // Form state for editing
  const [editForm, setEditForm] = useState<any>({});

  // Open modal and set producto/variante
  const handleEditClick = (producto: any, variante: any) => {
    setSelectedProducto(producto);
    setSelectedVariante(variante);
    setEditForm({
      nombre: producto.nombre,
      marca: producto.marca?.nombre || '',
      recomendado: producto.recomendado || false,
      talla: variante.talla?.nombre || '',
      stockActual: variante.stockActual,
      precioVenta: variante.precioVenta,
      porcentajeDescuento: variante.porcentajeDescuento,
    });
    setEditModalOpen(true);
  };

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Save changes (for now, just close modal)
  const handleSave = () => {
    // Here you would update the producto/variante in your backend or state
    setEditModalOpen(false);
  };

  return (
    <div>
      {/* DEBUG: Show modal state */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          background: 'yellow',
          padding: '2px 8px',
          fontSize: 12,
        }}
      >
        Modal: {editModalOpen ? 'OPEN' : 'CLOSED'}
      </div>
      {/* Edit Modal */}
      {editModalOpen && (
        <div className="z-[9999] fixed inset-0 flex justify-center items-center bg-black bg-opacity-60">
          <div className="relative bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
            <button
              className="top-2 right-2 absolute text-gray-500 hover:text-gray-700"
              onClick={() => setEditModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="mb-4 font-bold text-xl">Editar Producto</h2>
            <form className="space-y-3">
              <div>
                <label className="block font-medium text-sm">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={editForm.nombre}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block font-medium text-sm">Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={editForm.marca}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block font-medium text-sm">Recomendado</label>
                <input
                  type="checkbox"
                  name="recomendado"
                  checked={editForm.recomendado}
                  onChange={handleFormChange}
                  className="ml-2"
                />
              </div>
              <div>
                <label className="block font-medium text-sm">Talla</label>
                <input
                  type="text"
                  name="talla"
                  value={editForm.talla}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block font-medium text-sm">Stock</label>
                <input
                  type="number"
                  name="stockActual"
                  value={editForm.stockActual}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block font-medium text-sm">
                  Precio Venta
                </label>
                <input
                  type="number"
                  name="precioVenta"
                  value={editForm.precioVenta}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block font-medium text-sm">% Descuento</label>
                <input
                  type="number"
                  name="porcentajeDescuento"
                  value={editForm.porcentajeDescuento}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                />
              </div>
              <button
                type="button"
                className="bg-blue-600 mt-2 px-4 py-2 rounded w-full text-white"
                onClick={handleSave}
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
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
                    // Removed onClickItem for informacion routing
                  >
                    {producto.imagenes.map((imagen: any, i: number) => {
                      let imageUrl = '/placeholder.png';
                      if (typeof imagen === 'object') {
                        if (imagen.data) {
                          imageUrl = `data:image/jpeg;base64,${imagen.data}`;
                        } else if (imagen.url) {
                          imageUrl = imagen.url.startsWith('http')
                            ? imagen.url
                            : `${imagen.url}`;
                        }
                      }
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
                            onError={(e) =>
                              (e.currentTarget.src = '/placeholder.png')
                            }
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
                    // Removed onClick for informacion routing
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
