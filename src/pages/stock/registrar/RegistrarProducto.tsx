import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { SubCategoria } from '../../../types/SubCategoria';
import { Categoria } from '../../../types/Categoria';
import { Talla } from '../../../types/Talla';
import Loader from '../../../common/Loader';

const BASE_URL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_URL_BACKEND_PROD
    : import.meta.env.VITE_URL_BACKEND_LOCAL;

const RegistrarProducto = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // FIX: Renamed state variables to reflect they hold IDs for clarity
  const [categoriaId, setCategoriaId] = useState('');
  const [subCategoriaId, setSubCategoriaId] = useState('');

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filteredSubCategorias, setFilteredSubCategorias] = useState<
    SubCategoria[]
  >([]);
  const [tallas, setTallas] = useState<Talla[]>([]);

  const [nombre, setNombre] = useState('');
  const [tallaId, setTallaId] = useState<number | undefined>();
  const [observaciones, setObservaciones] = useState('');
  const [genero, setGenero] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState<number | undefined>();
  const [precioCompra, setPrecioCompra] = useState<number | undefined>();
  const [precioVenta, setPrecioVenta] = useState<number | undefined>();
  const [visible, setVisible] = useState(false);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [agregarStock, setAgregarStock] = useState<number | undefined>();

  // Redirigir si no hay token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/categorias`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };
    if (token) {
      fetchCategorias();
    }
  }, [token]);

  // Fetch subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (categoriaId) {
      const fetchSubcategorias = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/subcategorias/categoria/${categoriaId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          setFilteredSubCategorias(response.data);
        } catch (error) {
          setFilteredSubCategorias([]);
          console.error('Error al obtener subcategorías:', error);
        }
      };
      fetchSubcategorias();
    } else {
      setFilteredSubCategorias([]);
    }
  }, [categoriaId, token]);

  // Fetch tallas al montar el componente
  useEffect(() => {
    const fetchTallas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/tallas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTallas(response.data);
      } catch (error) {
        console.error('Error al obtener tallas:', error);
      }
    };
    if (token) {
      fetchTallas();
    }
  }, [token]);

  const handleAgregarImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes([...imagenes, ...Array.from(e.target.files)]);
    }
  };

  const handleEliminarImagen = (index: number) => {
    setImagenes(imagenes.filter((_, i) => i !== index));
  };

  const handleGuardarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    if (!agregarStock || agregarStock <= 0) {
      setErrorMsg('La cantidad a agregar debe ser mayor a 0.');
      return;
    }
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('genero', genero);
    formData.append('activo', String(visible));
    formData.append('observaciones', observaciones);
    if (tallaId !== undefined) formData.append('tallaId', String(tallaId));
    if (precioCompra !== undefined)
      formData.append('precioCompra', String(precioCompra));
    if (precioVenta !== undefined)
      formData.append('precioVenta', String(precioVenta));
    formData.append('agregarStock', String(agregarStock));
    if (subCategoriaId) formData.append('subcategoriaId', subCategoriaId);
    imagenes.forEach((imagen) => formData.append('imagenes', imagen));

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/productos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        console.log('Producto guardado:', response.data);
        navigate(-1);
      } else {
        const msg = response.data?.error || 'Error al guardar el producto';
        setErrorMsg(msg);
        console.error('Error al guardar el producto:', response.data);
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.error ||
        'Error inesperado al guardar el producto.';
      setErrorMsg(msg);
      console.error('Error al guardar el producto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Registrar producto" lastPage="stock" />
      {loading && <Loader />}
      <div className="gap-9 grid grid-cols-1 sm:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-9">
          {/* <!-- Registrar Producto Form --> */}
          <div className="bg-white dark:bg-boxdark shadow-default border border-stroke dark:border-strokedark rounded-sm">
            <div className="px-6.5 py-4 border-stroke dark:border-strokedark border-b">
              <h3 className="font-medium text-black dark:text-white">
                Registrar Producto
              </h3>
            </div>
            <form onSubmit={handleGuardarProducto}>
              <div className="p-6.5">
                {/* Nombre del Producto */}
                <div className="mb-4.5">
                  <label className="block mb-2.5 text-black dark:text-white">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ingrese el nombre del producto"
                    className="bg-transparent disabled:bg-whiter dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition disabled:cursor-default"
                    required
                  />
                </div>

                {/* Categoría y Subcategoría en la misma fila */}
                {/* Categoría y Subcategoría */}
                <div className="flex gap-4 mb-4.5">
                  <div className="w-1/2">
                    <label className="block mb-2.5 text-black dark:text-white">
                      Categoría
                    </label>
                    <select
                      value={categoriaId}
                      onChange={(e) => setCategoriaId(e.target.value)}
                      className="bg-transparent disabled:bg-whiter dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition disabled:cursor-default"
                      required
                    >
                      <option value="">Seleccione una categoría</option>
                      {categorias?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/2">
                    <label className="block mb-2.5 text-black dark:text-white">
                      Subcategoría
                    </label>
                    <select
                      value={subCategoriaId}
                      onChange={(e) => setSubCategoriaId(e.target.value)}
                      className="bg-transparent disabled:bg-whiter dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition disabled:cursor-default"
                      required
                      disabled={
                        !categoriaId || filteredSubCategorias.length === 0
                      }
                    >
                      <option value="">Seleccione una subcategoría</option>
                      {filteredSubCategorias.map((subCat) => (
                        <option key={subCat.id} value={subCat.id}>
                          {subCat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Género */}
                <div className="mb-4.5">
                  <label className="block mb-2.5 text-black dark:text-white">
                    Género
                  </label>
                  <select
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    className="bg-transparent disabled:bg-whiter dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition disabled:cursor-default"
                    required
                  >
                    <option value="">Seleccione un género</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Niños">Niños</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                {/* Talla */}
                <div className="mb-4.5">
                  <label className="block mb-2.5 text-black dark:text-white">
                    Talla
                  </label>
                  <select
                    value={tallaId || ''}
                    onChange={(e) => setTallaId(parseInt(e.target.value))}
                    className="bg-transparent disabled:bg-whiter dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition disabled:cursor-default"
                    required
                  >
                    <option value="">Seleccione una talla</option>
                    {tallas.map((talla) => (
                      <option key={talla.id} value={talla.id}>
                        {talla.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Precio de Compra y Precio de Venta en la misma fila */}
                <div className="flex gap-4 mb-4.5">
                  <div className="w-1/2">
                    <label className="block mb-2.5 text-black dark:text-white">
                      Precio de Compra
                    </label>
                    <input
                      type="number"
                      value={precioCompra}
                      onChange={(e) =>
                        setPrecioCompra(parseFloat(e.target.value))
                      }
                      placeholder="Ingrese el precio de compra"
                      className="bg-transparent disabled:bg-whiter dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition disabled:cursor-default"
                    />
                  </div>

                  <div className="w-1/2">
                    <label className="block mb-2.5 text-black dark:text-white">
                      Precio de Venta
                    </label>
                    <input
                      type="number"
                      value={precioVenta}
                      onChange={(e) =>
                        setPrecioVenta(parseFloat(e.target.value))
                      }
                      placeholder="Ingrese el precio de venta"
                      className="bg-transparent disabled:bg-whiter dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition disabled:cursor-default"
                    />
                  </div>
                </div>

                {/* Stock y Visible en la misma fila */}
                <div className="flex gap-4 mb-4.5">
                  <div className="w-1/2">
                    <label className="block mb-2.5 text-black dark:text-white">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(parseInt(e.target.value))}
                      placeholder="Ingrese el stock"
                      className="bg-transparent disabled:bg-whiter dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition disabled:cursor-default"
                    />
                  </div>

                  <div className="flex items-center w-1/2">
                    <input
                      type="checkbox"
                      checked={visible}
                      onChange={(e) => setVisible(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-black dark:text-white">
                      ¿Producto visible?
                    </span>
                  </div>
                </div>

                {/* Descripción al final */}
                <div className="mb-6">
                  <label className="block mb-2.5 text-black dark:text-white">
                    Descripción
                  </label>
                  <textarea
                    rows={4}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ingrese una descripción"
                    className="bg-transparent disabled:bg-whiter dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition disabled:cursor-default"
                    required
                  ></textarea>
                </div>
                {errorMsg && (
                  <div className="bg-red-100 mb-4 p-2 rounded-md text-red-700">
                    {errorMsg}
                  </div>
                )}
                {/* Observaciones */}
                <div className="mb-4.5"></div>
                <label className="block mb-2.5 text-black dark:text-white">
                  Observaciones
                </label>
                <input
                  type="text"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ingrese observaciones"
                  className="bg-transparent disabled:bg-whiter dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition disabled:cursor-default"
                />
                {/* Stock a agregar */}
                <div className="mb-4.5">
                  <label className="block mb-2.5 text-black dark:text-white">
                    Stock a agregar
                  </label>
                  <input
                    type="number"
                    value={agregarStock === undefined ? '' : agregarStock}
                    onChange={(e) => setAgregarStock(Number(e.target.value))}
                    placeholder="Ingrese la cantidad a agregar"
                    min={1}
                    className="bg-transparent disabled:bg-whiter dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition disabled:cursor-default"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex justify-center bg-primary hover:bg-opacity-90 p-3 rounded w-full font-medium text-white"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          <div className="bg-white dark:bg-boxdark shadow-default border border-stroke dark:border-strokedark rounded-sm">
            <div className="px-6.5 py-4 border-stroke dark:border-strokedark border-b">
              <h3 className="font-medium text-black dark:text-white">
                Imágenes
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="block mb-3 text-black dark:text-white">
                  Agregar Imagen
                </label>
                <input
                  type="file"
                  accept="image/*" // Aceptar solo archivos de imagen
                  multiple
                  onChange={handleAgregarImagen}
                  className="disabled:bg-whiter dark:bg-form-input dark:file:bg-white/30 file:bg-[#EEEEEE] file:mr-4 p-3 file:px-2.5 file:py-1 border border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:file:border-strokedark file:border-[0.5px] file:border-stroke file:focus:border-primary file:rounded rounded-md outline-none w-full dark:file:text-white file:text-sm transition disabled:cursor-default"
                />
              </div>

              {imagenes.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-black dark:text-white">
                    Imágenes Agregadas:
                  </h4>
                  <ul>
                    {imagenes.map((imagen, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center mb-2"
                      >
                        <span className="text-black dark:text-white">
                          {imagen.name}
                        </span>
                        <button
                          onClick={() => handleEliminarImagen(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrarProducto;
