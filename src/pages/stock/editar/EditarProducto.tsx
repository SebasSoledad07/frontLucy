import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';

import { useProductoContext } from '../../../Context/ProductoContext';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { ProductoImagen } from '../../../types/productoImagen';
import { SubCategoria } from '../../../types/SubCategoria';
import EditarProductoImagen from './EditarProdcutoImagen';
import { Producto } from '../../../types/producto';
import Loader from '../../../common/Loader';

const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;

const EditarProducto = () => {
  const { productos, categorias, fetchProductos } = useProductoContext();
  const token = localStorage.getItem('token');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const producto = useMemo(
    () =>
      productos?.find((item: Producto) => item.id === parseInt(id ?? '0', 10)),
    [productos, id],
  );

  const [formValues, setFormValues] = useState({
    id: producto?.id || 0,
    nombre: producto?.nombre || '',
    categoria: producto?.subCategoria?.categoria?.id?.toString() || '',
    subCategoria: producto?.subCategoria.id?.toString() || '',
    descripcion: producto?.descripcion || '',
    stock: producto?.agregarStock || 0,
    precioCompra: producto?.precioCompra || 0,
    precioVenta: producto?.precioVenta || 0,
    visible: producto?.activo || false,
    tallaId: producto?.tallaId?.toString() || '',
    observaciones: producto?.observaciones || '',
  });

  const [imagenes, setImagenes] = useState<File[]>([]);
  // Helper to map string[] or File[] to ProductoImagen[] for UI compatibility
  function mapImagenesToProductoImagen(imagenes: any): ProductoImagen[] {
    if (!imagenes) return [];
    // If already ProductoImagen[]
    if (Array.isArray(imagenes) && imagenes[0] && 'imagenes' in imagenes[0]) {
      return imagenes as ProductoImagen[];
    }
    // If string[] (URLs)
    if (Array.isArray(imagenes) && typeof imagenes[0] === 'string') {
      return imagenes.map((url: string, idx: number) => ({
        id: idx,
        nombre: '',
        descripcion: '',
        genero: '',
        activo: true,
        fechaCreacion: [],
        subcategoriaId: 0,
        imagenes: [{ imagen: url }],
      }));
    }
    // If File[] or unknown, return empty
    return [];
  }

  const [imagenesExistentes, setImagenesExistentes] = useState<
    ProductoImagen[]
  >(mapImagenesToProductoImagen(producto?.imagenes));
  const [filteredSubCategorias, setFilteredSubCategorias] = useState<
    SubCategoria[]
  >([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [productoImagen, setProductoImagen] = useState<ProductoImagen | null>(
    null,
  );
  const [imagenesEliminadas, setImagenesEliminadas] = useState<number[]>([]);
  const toggleModal = (productoImagen: ProductoImagen | null) => {
    setProductoImagen(productoImagen);
    setModalOpen(true);
  };
  useEffect(() => {
    if (formValues.categoria) {
      const categoriaSeleccionada = categorias?.find(
        (cat) => cat.id === parseInt(formValues.categoria),
      );
      setFilteredSubCategorias(categoriaSeleccionada?.subCategorias ?? []);
    } else {
      setFilteredSubCategorias([]);
    }
  }, [formValues.categoria, categorias]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAgregarImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImagenes((prev) => [
        ...prev,
        ...(e.target.files ? Array.from(e.target.files) : []),
      ]);
    }
  };

  const handleEliminarImagen = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEliminarImagenExistente = (id: number) => {
    setImagenesExistentes((prev) => prev.filter((img) => img.id !== id));
    setImagenesEliminadas((prev) => [...prev, id]);
  };

  const handleGuardarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    const formData = new FormData();

    // Build DTO payload
    const productoDto = {
      nombre: formValues.nombre,
      subcategoriaId: parseInt(formValues.subCategoria),
      descripcion: formValues.descripcion,
      activo: formValues.visible, // visible -> activo
      imagenesEliminadas,
      tallaId: formValues.tallaId ? parseInt(formValues.tallaId) : undefined,
      precioCompra: formValues.precioCompra,
      precioVenta: formValues.precioVenta,
      agregarStock: formValues.stock,
      observaciones: formValues.observaciones,
    };

    formData.append(
      'producto',
      new Blob([JSON.stringify(productoDto)], { type: 'application/json' }),
    );
    imagenes?.forEach((imagen) => formData.append('imagenes', imagen));

    try {
      setLoading(true);
      const response = await axios.put(`${BASE_URL}producto/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        navigate(-1);
        fetchProductos();
      } else {
        setErrorMsg(response.data.msg);
      }
    } catch (error) {
      setErrorMsg('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Editar producto" lastPage="stock" />
      {loading && <Loader />}
      <div className="gap-9 grid grid-cols-1 sm:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-9">
          <div className="bg-white dark:bg-boxdark shadow-default border border-stroke dark:border-strokedark rounded-sm">
            <div className="px-6.5 py-4 border-stroke dark:border-strokedark border-b">
              <h3 className="font-medium text-black dark:text-white">
                Editar Producto
              </h3>
            </div>
            <form onSubmit={handleGuardarProducto} className="p-6.5">
              {[
                {
                  label: 'Nombre del Producto',
                  name: 'nombre',
                  type: 'text',
                  value: formValues.nombre,
                  required: true,
                },
                {
                  label: 'Categoría',
                  name: 'categoria',
                  type: 'select',
                  value: formValues.categoria,
                  options: categorias,
                  required: true,
                },
                {
                  label: 'Subcategoría',
                  name: 'subCategoria',
                  type: 'select',
                  value: formValues.subCategoria,
                  options: filteredSubCategorias,
                  required: true,
                },
                {
                  label: 'Precio de Compra',
                  name: 'precioCompra',
                  type: 'number',
                  value: formValues.precioCompra,
                },
                {
                  label: 'Precio de Venta',
                  name: 'precioVenta',
                  type: 'number',
                  value: formValues.precioVenta,
                },
                {
                  label: 'Stock',
                  name: 'stock',
                  type: 'number',
                  value: formValues.stock,
                },
                {
                  label: 'Descripción',
                  name: 'descripcion',
                  type: 'textarea',
                  value: formValues.descripcion,
                  required: true,
                },
                {
                  label: 'Talla',
                  name: 'tallaId',
                  type: 'text',
                  value: formValues.tallaId,
                },
                {
                  label: 'Observaciones',
                  name: 'observaciones',
                  type: 'textarea',
                  value: formValues.observaciones,
                },
              ].map(({ label, name, type, value, options, required }) => (
                <div key={name} className="mb-4.5">
                  <label className="block mb-2.5 text-black dark:text-white">
                    {label}
                  </label>
                  {type === 'select' ? (
                    <select
                      name={name}
                      value={value}
                      onChange={handleInputChange}
                      className="bg-transparent dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:border-form-stroke dark:focus:border-primary rounded outline-none w-full text-black dark:text-white transition dark"
                      required={required}
                    >
                      <option value="">Seleccione {label.toLowerCase()}</option>
                      {options?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.nombre}
                        </option>
                      ))}
                    </select>
                  ) : type === 'textarea' ? (
                    <textarea
                      name={name}
                      rows={4}
                      value={value}
                      onChange={handleInputChange}
                      className="bg-transparent dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition"
                      required={required}
                    />
                  ) : (
                    <input
                      name={name}
                      type={type}
                      value={value}
                      onChange={handleInputChange}
                      className="bg-transparent dark:bg-form-input px-5 py-3 border-[1.5px] border-stroke focus:border-primary active:border-primary dark:focus:border-primary dark:border-form-strokedark rounded outline-none w-full text-black dark:text-white transition"
                      required={required}
                    />
                  )}
                </div>
              ))}
              <div className="flex items-center mb-4.5">
                <input
                  name="visible"
                  type="checkbox"
                  checked={formValues.visible}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-black dark:text-white">
                  ¿Producto visible?
                </span>
              </div>
              {errorMsg && (
                <div className="bg-red-100 mb-4 p-2 rounded-md text-red-700">
                  {errorMsg}
                </div>
              )}
              <button
                type="submit"
                className="flex justify-center bg-primary hover:bg-opacity-90 p-3 rounded w-full font-medium text-white"
              >
                Actualizar información
              </button>
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
                  Imágenes Existentes
                </label>
                <ul>
                  {imagenesExistentes.map((productoImagen, index) => (
                    <li
                      key={productoImagen.id}
                      className="flex justify-between items-center mb-2"
                    >
                      {/* Show all images for this ProductoImagen */}
                      {productoImagen.imagenes &&
                      productoImagen.imagenes.length > 0 ? (
                        productoImagen.imagenes.map((imgObj, idx) => (
                          <img
                            key={idx}
                            src={imgObj.imagen}
                            alt={`Imagen ${index + 1}`}
                            className="mr-2 rounded w-20 h-20 object-cover"
                          />
                        ))
                      ) : (
                        <span className="text-gray-500">Sin imagen</span>
                      )}
                      <div className="flex gap-2">
                        <button
                          className="ml-4 text-blue-500 hover:text-blue-700"
                          onClick={() => toggleModal(productoImagen)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleEliminarImagenExistente(productoImagen.id)
                          }
                          type="button"
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="block mb-3 text-black dark:text-white">
                  Agregar Nueva Imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAgregarImagen}
                  className="dark:bg-form-input dark:file:bg-white/30 file:bg-[#EEEEEE] file:mr-4 p-3 file:px-2.5 file:py-1 border border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:file:border-strokedark file:border-[0.5px] file:border-stroke file:focus:border-primary file:rounded rounded-md outline-none w-full dark:file:text-white file:text-sm transition"
                />
              </div>
              {imagenes.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-black dark:text-white">
                    Imágenes Nuevas Agregadas:
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
        {productoImagen && (
          <EditarProductoImagen
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            productoImagen={productoImagen}
          />
        )}
      </div>
    </>
  );
};

export default EditarProducto;
