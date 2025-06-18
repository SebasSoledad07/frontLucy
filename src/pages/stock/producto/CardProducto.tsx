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
  const [selectedVariante, setSelectedVariante] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [imagenesEliminadas, setImagenesEliminadas] = useState<any[]>([]);
  const [nuevasImagenes, setNuevasImagenes] = useState<File[]>([]);
  const [agregarStock, setAgregarStock] = useState('');

  // Open modal and set producto/variante
  const handleEditClick = async (producto: any, variante?: any) => {
    setSelectedProducto(producto);
    setSelectedVariante(variante || null);
    setImagenesEliminadas([]);
    setNuevasImagenes([]);
    setAgregarStock('');
    try {
      const response = await axios.get(
        `${BASE_URL}/api/productos/${producto.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = response.data;
      let varianteToEdit = variante;
      if (!varianteToEdit && data.variante && Array.isArray(data.variante)) {
        varianteToEdit = data.variante[0];
      }
      setEditForm({
        ...data,
        categoriaId: data.subCategoria?.categoria?.id || '',
        subcategoriaId: data.subCategoria?.id || '',
        variante: varianteToEdit || {},
        imagenes: data.imagenes || [],
      });
    } catch (e) {
      let varianteToEdit = variante;
      if (
        !varianteToEdit &&
        producto.variante &&
        Array.isArray(producto.variante)
      ) {
        varianteToEdit = producto.variante[0];
      }
      setEditForm({
        ...producto,
        categoriaId: producto.subCategoria?.categoria?.id || '',
        subcategoriaId: producto.subCategoria?.id || '',
        variante: varianteToEdit || {},
        imagenes: producto.imagenes || [],
      });
    }
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

  // Save changes (PUT to backend with FormData)
  const handleSave = async () => {
    if (!selectedProducto) return;
    const formData = new FormData();
    formData.append('nombre', editForm.nombre || '');
    formData.append('subcategoriaId', editForm.subcategoriaId || '');
    formData.append('descripcion', editForm.descripcion || '');
    formData.append('activo', editForm.activo ? 'true' : 'false');
    formData.append('tallaId', editForm.variante?.talla?.id || '');
    formData.append('precioCompra', editForm.variante?.precioCompra || '');
    formData.append('precioVenta', editForm.variante?.precioVenta || '');
    formData.append('observaciones', editForm.observaciones || '');
    // Agregar Stock
    formData.append('agregarStock', agregarStock || '0');
    // Nuevas imágenes
    nuevasImagenes.forEach((img) => {
      formData.append('imagenes', img);
    });
    // Imágenes a eliminar
    imagenesEliminadas.forEach((id) => {
      formData.append('imagenesEliminadas', id);
    });
    try {
      await axios.put(
        `${BASE_URL}/api/productos/${selectedProducto.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setEditModalOpen(false);
      // Optionally, refresh product list here
    } catch (error) {
      alert('Error al actualizar el producto');
    }
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
                  onChange={(e) => {
                    setEditForm((prev: any) => ({
                      ...prev,
                      categoriaId: e.target.value,
                      subcategoriaId: '', // reset subcategoria
                    }));
                  }}
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
              {/* Agregar Stock */}
              <div>
                <label className="block font-medium text-sm">
                  Agregar Stock
                </label>
                <input
                  type="number"
                  name="agregarStock"
                  placeholder="Cantidad a agregar"
                  value={agregarStock}
                  onChange={(e) => setAgregarStock(e.target.value)}
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
              {/* Imágenes */}
              <div>
                <label className="block font-medium text-sm">Imágenes</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editForm.imagenes && editForm.imagenes.length > 0 ? (
                    editForm.imagenes.map((img: any, idx: number) => (
                      <div key={idx} className="group relative">
                        <img
                          src={
                            img.url
                              ? img.url.startsWith('http')
                                ? img.url
                                : `${BASE_URL}/${img.url}`
                              : '/placeholder.png'
                          }
                          alt={`Imagen ${idx + 1}`}
                          className="border rounded w-16 h-h-64 object-cover"
                        />
                        <button
                          type="button"
                          className="top-0 right-0 absolute flex justify-center items-center bg-red-500 opacity-80 hover:opacity-100 rounded-full w-5 h-5 text-white text-xs"
                          title="Eliminar imagen"
                          onClick={() => {
                            setImagenesEliminadas((prev) => [...prev, img.id]);
                            setEditForm((prev: any) => ({
                              ...prev,
                              imagenes: prev.imagenes.filter(
                                (_: any, i: number) => i !== idx,
                              ),
                            }));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400">No hay imágenes</span>
                  )}
                  {/* Nuevas imágenes preview */}
                  {nuevasImagenes.map((file, idx) => (
                    <div key={idx} className="group relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Nueva Imagen ${idx + 1}`}
                        className="border rounded w-16 h-64 object-cover"
                      />
                      <button
                        type="button"
                        className="top-0 right-0 absolute flex justify-center items-center bg-red-500 opacity-80 hover:opacity-100 rounded-full w-5 h-5 text-white text-xs"
                        title="Eliminar imagen"
                        onClick={() => {
                          setNuevasImagenes((prev) =>
                            prev.filter((_, i) => i !== idx),
                          );
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setNuevasImagenes((prev) => [
                        ...prev,
                        ...Array.from(e.target.files),
                      ]);
                    }
                  }}
                  className="mb-2"
                />
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
          filteredProductos.map((item) =>
            (item.variante &&
            Array.isArray(item.variante) &&
            item.variante.length > 0
              ? item.variante
              : [{ ...item, isFallback: true }]
            ).map((variante: any, idx: number) => (
              <div
                key={variante.id || `${item.id}-fallback`}
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
                    onClick={() => handleEditClick(item, variante)}
                    title="Editar"
                  >
                    <FaEdit size={20} />
                  </button>
                </div>
                <Carousel
                  showThumbs={false}
                  infiniteLoop
                  className="w-full h-64"
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
                              alt={`Imagen ${idx + 1}`}
                              className="rounded-md w-full h-64 object-cover"
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
                            className="rounded-md w-full h-64 object-cover"
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
                        <span>{variante.precioVenta}</span>
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
              </div>
            )),
          )
        ) : (
          <p className="text-[#7A5B47]">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
};

export default CardProducto;
