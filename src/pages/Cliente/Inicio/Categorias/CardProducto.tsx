import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { FaInfoCircle, FaEdit } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { useProductoContext } from '../../../../Context/ProductoContext';
import { useUserContext } from '../../../../Context/UserContext';
import { Producto } from '../../../../types/producto';

// Add categoriaId prop
const CardProducto = ({ categoriaId }: { categoriaId?: number }) => {
  // Only use context if not filtering by categoriaId
  const { categorias } = useProductoContext
    ? useProductoContext()
    : { categorias: [] };
  const { modulo } = useUserContext();
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
  if (!modulo || modulo === 'null' || modulo === 'undefined') {
    return (
      <div className="p-4 text-[#7A5B47]">
        Cargando información de usuario...
        <br />
        <span style={{ color: 'red' }}>DEBUG: modulo = {String(modulo)}</span>
        <br />
        <span style={{ color: 'red' }}>
          DEBUG: payload = {JSON.stringify(payload)}
        </span>
      </div>
    );
  }

  return (
    <div>
      {showSelectors && (
        <div className="flex md:flex-row flex-col gap-4 mb-4 ml-4">
          <select
            value={selectedCategoria}
            onChange={(e) => {
              setSelectedCategoria(e.target.value);
              setSelectedSubCategoria('');
            }}
            className="bg-white p-2 border border-[#F4B1C7] rounded-md focus:ring-[#B695E0] focus:ring-2 text-[#7A5B47]"
          >
            <option value="">Todas las Categorías</option>
            {categorias?.map((categoria) => (
              <option key={categoria.id} value={categoria.id?.toString()}>
                {categoria.nombre}
              </option>
            ))}
          </select>

          <select
            value={selectedSubCategoria}
            onChange={(e) => setSelectedSubCategoria(e.target.value)}
            className="bg-white p-2 border border-[#F4B1C7] rounded-md focus:ring-[#B695E0] focus:ring-2 text-[#7A5B47]"
            disabled={!selectedCategoria}
          >
            <option value="">Todas las Subcategorías</option>
            {selectedCategoria &&
              categorias
                ?.find(
                  (categoria) => categoria.id === parseInt(selectedCategoria),
                )
                ?.subCategorias?.map((subCategoria) => (
                  <option
                    key={subCategoria.id}
                    value={subCategoria.id.toString()}
                  >
                    {subCategoria.nombre}
                  </option>
                ))}
          </select>
        </div>
      )}

      {/* Cards de productos */}
      <div className="md:flex-wrap gap-3 grid grid-cols-1 md:grid-cols-3 p-4">
        {loading ? (
          <p className="text-[#7A5B47]">Cargando productos...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredProductos.length > 0 ? (
          filteredProductos.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFFFF] shadow-md p-4 border border-[#F4B1C7] rounded-lg"
            >
              <div className="flex justify-end items-center">
                <Link
                  to={`/${modulo}/stock/${item.id}/informacion`}
                  className="text-[#B199E1] hover:text-[#A27FD6]"
                >
                  <FaInfoCircle size={20} />
                </Link>
                {modulo === 'admin' && (
                  <Link
                    to={`/${modulo}/stock/${item.id}/editar`}
                    className="ml-4 text-[#F4B1C7] hover:text-[#E38AAA]"
                  >
                    <FaEdit size={20} />
                  </Link>
                )}
              </div>
              <Carousel showThumbs={false} infiniteLoop className="w-full h-36">
                {item.imagenes && item.imagenes.length > 0
                  ? item.imagenes.map((imagen: any, idx: number) => {
                      let imageUrl = '/placeholder.png';
                      if (typeof imagen === 'object') {
                        if (imagen.data) {
                          // Render base64 jpg
                          imageUrl = `data:image/jpeg;base64,${imagen.data}`;
                        } else if (imagen.url) {
                          imageUrl = imagen.url.startsWith('http')
                            ? imagen.url
                            : `${BASE_URL}/${imagen.url}`;
                        }
                      }
                      return (
                        <div key={idx}>
                          <img
                            src={imageUrl}
                            alt={`${item.nombre} - ${idx + 1}`}
                            className="rounded-md w-full h-36 object-cover"
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
                <div className="flex justify-between">
                  <p className="text-[#7A5B47] text-sm">Stock:</p>
                  <strong className="text-[#7A5B47] text-sm">
                    {item.stock}{' '}
                    {/* Assuming 'stock' is the correct property */}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#7A5B47] text-sm">Visible:</p>
                  <p className="text-[#7A5B47] text-sm">
                    {item.activo ? 'Sí' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[#7A5B47]">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
};

export default CardProducto;
