import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { Carousel } from 'react-responsive-carousel';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { useProductoContext } from '../../../../Context/ProductoContext';
import { useUserContext } from '../../../../Context/UserContext';
import { useCart } from '../../../../Context/CartContext';
import { Producto } from '../../../../types/producto';

// Add categoriaId prop
const CardProducto = ({ categoriaId }: { categoriaId?: number }) => {
  // Only use context if not filtering by categoriaId
  const { categorias } = useProductoContext
    ? useProductoContext()
    : { categorias: [] };
  const { modulo } = useUserContext();
  const { cart, addToCart } = useCart();
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedSubCategoria, setSelectedSubCategoria] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE_URL =
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_URL_BACKEND_PROD
      : import.meta.env.VITE_URL_BACKEND_LOCAL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError('');
      try {
        let url = `${BASE_URL}/api/productos/activos`;
        if (categoriaId) {
          url = `${BASE_URL}/api/productos/categoria/${categoriaId}`;
        } else if (selectedCategoria) {
          url = `${BASE_URL}/api/productos/categoria/${selectedCategoria}`;
        }
        console.log('Fetching productos from:', url);
        // Remove Authorization header for GET requests to /activos and /categoria/*
        const response = await axios.get(url);
        console.log('Productos response:', response.data);
        // Support both array and {data: array}
        const productosData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setProductos(productosData);
        // Log the fetched products
        console.log('Fetched productos:', productosData);
      } catch (err) {
        setError('Error al cargar productos');
        console.error('Error fetching productos:', err);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [categoriaId, selectedCategoria, BASE_URL, token]);

  // Filter by subcategoria on the frontend
  const filteredProductos = productos.filter((producto) => {
    return (
      selectedSubCategoria === '' ||
      (producto.subCategoria &&
        producto.subCategoria.id === parseInt(selectedSubCategoria))
    );
  });

  // Only show selectors if not filtering by categoriaId
  const showSelectors = !categoriaId;

  let payload = null;
  if (token) {
    try {
      payload = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      payload = { error: 'Invalid token' };
    }
  }
  console.log('modulo:', modulo);
  // if (!modulo || modulo === 'null' || modulo === 'undefined') {
  //   return (
  //     <div className="p-4 text-[#7A5B47]">
  //       Cargando información de usuario...
  //       <br />
  //       <span style={{ color: 'red' }}>DEBUG: modulo = {String(modulo)}</span>
  //       <br />
  //       <span style={{ color: 'red' }}>
  //         DEBUG: payload = {JSON.stringify(payload)}
  //       </span>
  //     </div>
  //   );
  // }

  return (
    <div>
      {/* Cards de variantes de productos */}
      <div className="md:flex-wrap gap-3 grid grid-cols-1 md:grid-cols-3 p-4">
        {loading ? (
          <p className="text-[#7A5B47]">Cargando productos...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredProductos.length > 0 ? (
          filteredProductos.flatMap((item) =>
            (item.variante &&
            Array.isArray(item.variante) &&
            item.variante.length > 0
              ? item.variante
              : [{ ...item, isFallback: true }]
            ).map((variante, idx) => (
              <div
                key={variante.id || `${item.id}-fallback`}
                className="bg-[#FFFFFF] shadow-md p-4 border border-[#F4B1C7] rounded-lg"
              >
                <Carousel
                  showThumbs={false}
                  infiniteLoop
                  className="w-full h-36"
                >
                  {item.imagenes && item.imagenes.length > 0
                    ? item.imagenes.map((imagen: any, idx: number) => {
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
                          <div key={idx}>
                            <img
                              src={imageUrl}
                              alt={`${item.nombre} - ${idx + 1}`}
                              className="rounded-md w-full h-36 object-cover"
                              onError={(e) =>
                                (e.currentTarget.src = '/placeholder.png')
                              }
                            />
                          </div>
                        );
                      })
                    : [
                        <div key="placeholder">
                          <img
                            src="/placeholder.png"
                            alt="Sin imagen"
                            className="rounded-md w-full h-36 object-cover"
                          />
                        </div>,
                      ]}
                </Carousel>
                <div className="mt-4">
                  <h3 className="font-semibold text-[#7A5B47] text-lg">
                    {item.nombre.length > 15
                      ? item.nombre.slice(0, 15) + '...'
                      : item.nombre}
                  </h3>
                  {/* Variante info */}
                  {variante.isFallback ? null : (
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
                          {variante.precioVenta?.toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                          })}
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
                  <div className="flex justify-end items-center mt-2">
                    <button
                      className="bg-[#F4B1C7] hover:bg-[#E38AAA] px-3 py-1 rounded font-bold text-white"
                      onClick={() =>
                        addToCart(
                          {
                            ...item,
                            ...(!variante.isFallback && {
                              precioVenta: variante.precioVenta,
                              talla: variante.talla,
                              stockActual: variante.stockActual,
                              porcentajeDescuento: variante.porcentajeDescuento,
                            }),
                          },
                          !variante.isFallback ? variante.talla?.id : undefined,
                        )
                      }
                      disabled={
                        !variante.isFallback && variante.stockActual <= 0
                      }
                    >
                      {!variante.isFallback && variante.stockActual <= 0
                        ? 'Sin stock'
                        : 'Agregar a carrito'}
                    </button>
                  </div>
                </div>
              </div>
            )),
          )
        ) : (
          <div className="flex flex-col justify-center items-center col-span-1 md:col-span-3 bg-[#FFFFFF] shadow-md p-4 border border-[#F4B1C7] rounded-lg min-h-[200px]">
            <img
              src="/placeholder.png"
              alt="Sin productos"
              className="mb-4 w-32 h-32 object-contain"
            />
            <p className="text-[#7A5B47] text-lg">
              No se encontraron productos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardProducto;
