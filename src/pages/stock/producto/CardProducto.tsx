import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { FaInfoCircle, FaEdit } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { SubCategoria } from '../../../types/SubCategoria';
import { Categoria } from '../../../types/Categoria';
import { Producto } from '../../../types/producto';

// Add categoriaId prop
const CardProducto = ({ categoriaId }: { categoriaId?: number }) => {
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedSubCategoria, setSelectedSubCategoria] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriasLoading, setCategoriasLoading] = useState(true);
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
        let url = `${BASE_URL}/api/productos/todos`;
        if (categoriaId) {
          url = `${BASE_URL}/api/productos/categoria/${categoriaId}`;
        } else if (selectedSubCategoria) {
          url = `${BASE_URL}/api/productos/subcategoria/${selectedSubCategoria}`;
        } else if (selectedCategoria) {
          url = `${BASE_URL}/api/productos/categoria/${selectedCategoria}`;
        }
        console.log('Fetching productos from:', url);
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
  }, [categoriaId, selectedCategoria, selectedSubCategoria, BASE_URL, token]);

  // Fetch categorias without authorization
  useEffect(() => {
    const fetchCategorias = async () => {
      setCategoriasLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/categorias`);
        setCategorias(response.data.data || []);
      } catch (err) {
        setCategorias([]);
      } finally {
        setCategoriasLoading(false);
      }
    };
    fetchCategorias();
  }, [BASE_URL]);

  // Fetch all subcategorias on mount (not just for selectedCategoria)
  useEffect(() => {
    const fetchSubCategorias = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/subcategorias`);
        setSubCategorias(response.data.data || []);
      } catch (err) {
        setSubCategorias([]);
      }
    };
    fetchSubCategorias();
  }, [BASE_URL]);

  // Filtering logic
  const filteredProductos = productos.filter((producto) => {
    // Categoria filter
    const matchCategoria = selectedCategoria
      ? producto.categoriaId?.toString() === selectedCategoria ||
        producto.categoria?.id?.toString() === selectedCategoria
      : true;
    // Subcategoria filter: check producto and variantes
    const matchSubCategoria = selectedSubCategoria
      ? producto.subcategoriaId?.toString() === selectedSubCategoria ||
        producto.subCategoria?.id?.toString() === selectedSubCategoria ||
        (producto.variante &&
          Array.isArray(producto.variante) &&
          producto.variante.some(
            (v) =>
              v.subcategoriaId?.toString() === selectedSubCategoria ||
              v.subCategoria?.id?.toString() === selectedSubCategoria,
          ))
      : true;
    return matchCategoria && matchSubCategoria;
  });

  // Subcategoria selector: show all, or filter by selectedCategoria if desired
  const subcategoriasToShow = selectedCategoria
    ? subCategorias.filter(
        (sub) =>
          sub.categoriaId?.toString() === selectedCategoria ||
          sub.categoria?.id?.toString() === selectedCategoria,
      )
    : subCategorias;

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

  console.log('Categorias from context:', categorias);
  console.log('Subcategorias fetched:', subCategorias);

  return (
    <div>
      {showSelectors && (
        <div className="flex md:flex-row flex-col gap-4 mb-4 ml-4">
          {categoriasLoading ? (
            <span className="text-[#7A5B47]">Cargando categorías...</span>
          ) : (
            <select
              value={selectedCategoria}
              onChange={(e) => {
                setSelectedCategoria(e.target.value);
                setSelectedSubCategoria('');
              }}
              className="bg-white p-2 border border-[#F4B1C7] rounded-md focus:ring-[#B695E0] focus:ring-2 text-[#7A5B47]"
            >
              <option value="">Todas las Categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id?.toString()}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedSubCategoria}
            onChange={(e) => setSelectedSubCategoria(e.target.value)}
            className="bg-white p-2 border border-[#F4B1C7] rounded-md focus:ring-[#B695E0] focus:ring-2 text-[#7A5B47]"
            disabled={subcategoriasToShow.length === 0}
          >
            <option value="">Todas las Subcategorías</option>
            {subcategoriasToShow.map((subCategoria) => (
              <option key={subCategoria.id} value={subCategoria.id.toString()}>
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
                  to={`/stock/${item.id}/informacion`}
                  className="text-[#B199E1] hover:text-[#A27FD6]"
                >
                  <FaInfoCircle size={20} />
                </Link>
                <Link
                  to={`/stock/${item.id}/editar`}
                  className="ml-4 text-[#F4B1C7] hover:text-[#E38AAA]"
                >
                  <FaEdit size={20} />
                </Link>
              </div>
              <Carousel showThumbs={false} infiniteLoop className="w-full h-36">
                {item.imagenes && item.imagenes.length > 0
                  ? item.imagenes.map((imagen: any, idx: number) => {
                      let imageUrl = '/placeholder.png';
                      if (typeof imagen === 'object' && imagen.url) {
                        if (
                          imagen.url.startsWith('data:image/jpeg;base64,') ||
                          imagen.url.startsWith('/9j/') // common base64 JPG prefix
                        ) {
                          // If already a data URL or raw base64, use as is
                          imageUrl = imagen.url.startsWith(
                            'data:image/jpeg;base64,',
                          )
                            ? imagen.url
                            : `data:image/jpeg;base64,${imagen.url}`;
                        } else {
                          // If url is relative, prepend BASE_URL
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
