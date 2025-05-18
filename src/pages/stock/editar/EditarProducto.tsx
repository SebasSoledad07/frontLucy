import { useState, useEffect, useMemo } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useProductoContext } from '../../../Context/ProductoContext';
import { SubCategoria } from '../../../types/SubCategoria';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Producto } from '../../../types/producto';
import { FaEdit } from 'react-icons/fa';
import Loader from '../../../common/Loader';
import { ProductoImagen } from '../../../types/productoImagen';
import EditarProductoImagen from './EditarProdcutoImagen';

const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;

const EditarProducto = () => {
  const { productos, categorias, marcas, catalogos, fetchProductos } =
    useProductoContext();
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
    marca: producto?.marca.id?.toString() || '',
    catalogo: producto?.catalogo.id?.toString() || '',
    descripcion: producto?.descripcion || '',
    stock: producto?.stock || 0,
    precioCompra: producto?.precioCompra || 0,
    precioVenta: producto?.precioVenta || 0,
    visible: producto?.visible || false,
    recomendado: producto?.recomendado || false,
  });

  const [imagenes, setImagenes] = useState<File[]>([]);
  const [imagenesExistentes, setImagenesExistentes] = useState<
    ProductoImagen[]
  >(producto?.imagenes || []);
  const [filteredSubCategorias, setFilteredSubCategorias] = useState<
    SubCategoria[]
  >([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [productoImagen, setProductoImagen] = useState<ProductoImagen | null>(
    null,
  );
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

  const handleGuardarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    const formData = new FormData();

    formData.append(
      'producto',
      new Blob(
        [
          JSON.stringify({
            ...formValues,
            subCategoria: { id: parseInt(formValues.subCategoria) },
            marca: { id: parseInt(formValues.marca) },
            catalogo: { id: parseInt(formValues.catalogo) },
          }),
        ],
        { type: 'application/json' },
      ),
    );

    imagenes?.forEach((imagen) => formData.append('files', imagen));
    console.log(formValues);
    console.log(imagenes);

    try {
      setLoading(true);
      const response = await axios.put(`${BASE_URL}producto/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response.data.success) {
        navigate(-1);
        fetchProductos();
      } else {
        setErrorMsg(response.data.msg);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Editar producto" lastPage="stock" />
      {loading && <Loader />}
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
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
                  label: 'Marca',
                  name: 'marca',
                  type: 'select',
                  value: formValues.marca,
                  options: marcas,
                  required: true,
                },
                {
                  label: 'Catálogo',
                  name: 'catalogo',
                  type: 'select',
                  value: formValues.catalogo,
                  options: catalogos,
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
              ].map(({ label, name, type, value, options, required }) => (
                <div key={name} className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    {label}
                  </label>
                  {type === 'select' ? (
                    <select
                      name={name}
                      value={value}
                      onChange={handleInputChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required={required}
                    />
                  ) : (
                    <input
                      name={name}
                      type={type}
                      value={value}
                      onChange={handleInputChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required={required}
                    />
                  )}
                </div>
              ))}
              <div className="mb-4.5 flex items-center">
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
              <div className="mb-4.5 flex items-center">
                <input
                  name="recomendado"
                  type="checkbox"
                  checked={formValues.recomendado}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-black dark:text-white">
                  ¿Producto recomendado?
                </span>
              </div>
              {errorMsg && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                  {errorMsg}
                </div>
              )}
              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
              >
                Actualizar información
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Imágenes
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Imágenes Existentes
                </label>
                <ul>
                  {imagenesExistentes.map((productoImagen, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between mb-2"
                    >
                      <img
                        src={productoImagen.imagen}
                        alt={`Imagen ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        className="text-blue-500 hover:text-blue-700 ml-4"
                        onClick={() => toggleModal(productoImagen)}
                      >
                        <FaEdit />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Agregar Nueva Imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAgregarImagen}
                  className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                />
              </div>
              {imagenes.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-black dark:text-white mb-2">
                    Imágenes Nuevas Agregadas:
                  </h4>
                  <ul>
                    {imagenes.map((imagen, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between mb-2"
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
