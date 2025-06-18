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

  // Fetch categorias with axios and Authorization header (like RegistrarProducto)
  useEffect(() => {
    const fetchCategorias = async () => {
      setCategoriasLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/categorias`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // RegistrarProducto expects response.data to be the array
        setCategorias(response.data);
      } catch (err) {
        setCategorias([]);
      } finally {
        setCategoriasLoading(false);
      }
    };
    if (token) fetchCategorias();
  }, [BASE_URL, token]);

  // Fetch subcategorias: if selectedCategoria, fetch only those, else fetch all (like RegistrarProducto)
  useEffect(() => {
    const fetchSubCategorias = async () => {
      try {
        let url = `${BASE_URL}/api/subcategorias`;
        if (selectedCategoria) {
          url = `${BASE_URL}/api/subcategorias/categoria/${selectedCategoria}`;
        }
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubCategorias(response.data);
      } catch (err) {
        setSubCategorias([]);
      }
    };
    if (token) fetchSubCategorias();
  }, [BASE_URL, token, selectedCategoria]);

  // Filtering logic
  const filteredProductos = productos.filter((producto) => {
    // Categoria filter
    const matchCategoria = selectedCategoria
      ? producto.subCategoria?.categoria?.id?.toString() === selectedCategoria
      : true;
    // Subcategoria filter: check producto
    const matchSubCategoria = selectedSubCategoria
      ? producto.subCategoria?.id?.toString() === selectedSubCategoria
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

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});

  // Open modal and set producto/variante
  const handleEditClick = (producto: any) => {
    setSelectedProducto(producto);
    setEditForm({
      ...producto,
      variante:
        producto.variante && Array.isArray(producto.variante)
          ? producto.variante[0]
          : {},
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
      {/* Edit Modal */}
      {editModalOpen && (
        <div className="z-[9999] fixed inset-0 flex justify-center items-center bg-black bg-opacity-60">
          <div className="relative bg-white shadow-lg p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <button
              className="top-2 right-2 absolute text-gray-500 hover:text-gray-700"
              onClick={() => setEditModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="mb-4 font-bold text-xl">Editar Producto</h2>
            <form className="space-y-3">
              {/* Nombre del Producto */}
              <div>
                <label className="block font-medium text-sm">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ingrese el nombre del producto"
                  value={editForm.nombre || ''}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                />
              </div>
              {/* Categoría */}
              <div>
                <label className="block font-medium text-sm">Categoría</label>
                <select
                  name="categoriaId"
                  value={editForm.categoriaId || ''}
                  onChange={(e) =>
                    setEditForm((prev: any) => ({
                      ...prev,
                      categoriaId: e.target.value,
                    }))
                  }
                  className="p-2 border rounded w-full"
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {/* Subcategoría */}
              <div>
                <label className="block font-medium text-sm">
                  Subcategoría
                </label>
                <select
                  name="subcategoriaId"
                  value={editForm.subcategoriaId || ''}
                  onChange={(e) =>
                    setEditForm((prev: any) => ({
                      ...prev,
                      subcategoriaId: e.target.value,
                    }))
                  }
                  className="p-2 border rounded w-full"
                >
                  <option value="">Seleccione una subcategoría</option>
                  {subCategorias
                    .filter((sub) =>
                      editForm.categoriaId
                        ? sub.categoria?.id === Number(editForm.categoriaId)
                        : true,
                    )
                    .map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nombre}
                      </option>
                    ))}
                </select>
              </div>
              {/* Género */}
              <div>
                <label className="block font-medium text-sm">Género</label>
                <select
                  name="genero"
                  value={editForm.genero || ''}
                  onChange={(e) =>
                    setEditForm((prev: any) => ({
                      ...prev,
                      genero: e.target.value,
                    }))
                  }
                  className="p-2 border rounded w-full"
                >
                  <option value="">Seleccione un género</option>
                  <option value="Niño">Niño</option>
                  <option value="Niña">Niña</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
              {/* Talla */}
              <div>
                <label className="block font-medium text-sm">Talla</label>
                <select
                  name="tallaId"
                  value={editForm.variante?.talla?.id || ''}
                  onChange={(e) => {
                    setEditForm((prev: any) => ({
                      ...prev,
                      variante: {
                        ...prev.variante,
                        talla: {
                          ...prev.variante?.talla,
                          id: e.target.value,
                        },
                      },
                    }));
                  }}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Seleccione una talla</option>
                  {/* You may want to map available tallas here if you have them */}
                  {editForm.variante && editForm.variante.talla && (
                    <option value={editForm.variante.talla.id}>
                      {editForm.variante.talla.nombre}
                    </option>
                  )}
                </select>
              </div>
              {/* Precio de Compra */}
              <div>
                <label className="block font-medium text-sm">
                  Precio de Compra
                </label>
                <input
                  type="number"
                  name="precioCompra"
                  placeholder="Ingrese el precio de compra"
                  value={editForm.variante?.precioCompra || ''}
                  onChange={(e) =>
                    setEditForm((prev: any) => ({
                      ...prev,
                      variante: {
                        ...prev.variante,
                        precioCompra: e.target.value,
                      },
                    }))
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
              {/* Precio de Venta */}
              <div>
                <label className="block font-medium text-sm">
                  Precio de Venta
                </label>
                <input
                  type="number"
                  name="precioVenta"
                  placeholder="Ingrese el precio de venta"
                  value={editForm.variante?.precioVenta || ''}
                  onChange={(e) =>
                    setEditForm((prev: any) => ({
                      ...prev,
                      variante: {
                        ...prev.variante,
                        precioVenta: e.target.value,
                      },
                    }))
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
              {/* Stock */}
              <div>
                <label className="block font-medium text-sm">Stock</label>
                <input
                  type="number"
                  name="stockActual"
                  placeholder="Ingrese el stock"
                  value={editForm.variante?.stockActual || ''}
                  onChange={(e) =>
                    setEditForm((prev: any) => ({
                      ...prev,
                      variante: {
                        ...prev.variante,
                        stockActual: e.target.value,
                      },
                    }))
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
              {/* ¿Producto visible? */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="activo"
                  checked={!!editForm.activo}
                  onChange={handleFormChange}
                  className="mr-2"
                />
                <label className="font-medium text-sm">
                  ¿Producto visible?
                </label>
              </div>
              {/* Descripción */}
              <div>
                <label className="block font-medium text-sm">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  placeholder="Ingrese una descripción"
                  value={editForm.descripcion || ''}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                />
              </div>
              {/* Observaciones */}
              <div>
                <label className="block font-medium text-sm">
                  Observaciones
                </label>
                <input
                  type="text"
                  name="observaciones"
                  placeholder="Ingrese observaciones"
                  value={editForm.observaciones || ''}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                />
              </div>
              {/* Stock a agregar */}
              <div>
                <label className="block font-medium text-sm">
                  Stock a agregar
                </label>
                <input
                  type="number"
                  name="stockAgregar"
                  placeholder="Ingrese la cantidad a agregar"
                  value={editForm.stockAgregar || ''}
                  onChange={handleFormChange}
                  className="p-2 border rounded w-full"
                />
              </div>
              {/* Imágenes */}
              <div>
                <label className="block font-medium text-sm">Imágenes</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editForm.imagenes && editForm.imagenes.length > 0 ? (
                    editForm.imagenes.map((img: any, idx: number) => (
                      <img
                        key={idx}
                        src={
                          img.url
                            ? img.url.startsWith('http')
                              ? img.url
                              : `${BASE_URL}/${img.url}`
                            : '/placeholder.png'
                        }
                        alt={`Imagen ${idx + 1}`}
                        className="border rounded w-16 h-16 object-cover"
                      />
                    ))
                  ) : (
                    <span className="text-gray-400">No hay imágenes</span>
                  )}
                </div>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                  // onClick={handleAddImage} // Implementar lógica de agregar imagen
                >
                  Agregar Imagen
                </button>
              </div>
              <button
                type="button"
                className="bg-blue-600 mt-2 px-4 py-2 rounded w-full text-white"
                onClick={handleSave}
              >
                Guardar Producto
              </button>
            </form>
          </div>
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
                <button
                  className="ml-4 text-[#F4B1C7] hover:text-[#E38AAA]"
                  onClick={() => handleEditClick(item)}
                  title="Editar"
                >
                  <FaEdit size={20} />
                </button>
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
