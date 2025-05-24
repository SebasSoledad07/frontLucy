import { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useProductoContext } from '../../../Context/ProductoContext';
import { SubCategoria } from '../../../types/SubCategoria';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../common/Loader';

const BASE_URL = 'http://13.56.234.70:8080/api';

const RegistrarProducto = () => {
  const token = localStorage.getItem('token');
  const { categorias, fetchProductos } = useProductoContext();
  const [nombre, setNombre] = useState('');
  const [tallaId, setTallaId] = useState<number | undefined>();
  const [observaciones, setObservaciones] = useState('');
  const [genero, setGenero] = useState('');
  const [categoria, setCategoria] = useState('');
  const [subCategoria, setSubCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState<number | undefined>();
  const [precioCompra, setPrecioCompra] = useState<number | undefined>();
  const [precioVenta, setPrecioVenta] = useState<number | undefined>();
  const [visible, setVisible] = useState(false);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [filteredSubCategorias, setFilteredSubCategorias] = useState<
    SubCategoria[]
  >([]);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Filtrar subcategorías basadas en la categoría seleccionada
    if (categoria) {
      const categoriaSeleccionada = categorias?.find(
        (cat) => cat.id === parseInt(categoria),
      );
      setFilteredSubCategorias(categoriaSeleccionada?.subCategorias ?? []);
    } else {
      setFilteredSubCategorias([]);
    }
  }, [categoria, categorias]);

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
    const formData = new FormData();

    formData.append(
      'producto',
      new Blob(
        [
          JSON.stringify({
            nombre,
            subCategoria: {
              id: parseInt(subCategoria),
            },
            descripcion,
            genero,
            visible,
            tallaId,
            categoria,
            precioCompra,
            precioVenta,
            observaciones,
          }),
        ],
        { type: 'application/json' },
      ),
    );

    imagenes.forEach((imagen) => formData.append('files', imagen));

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}productos/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        console.log('Producto guardado:', response.data);
        navigate(-1);
        fetchProductos();
      } else {
        console.error('Error al guardar el producto:', response.data);
        setErrorMsg(response.data.msg);
      }
      console.log('Producto guardado:', response.data);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Registrar producto" lastPage="stock" />
      {loading && <Loader />}
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-9">
          {/* <!-- Registrar Producto Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Registrar Producto
              </h3>
            </div>
            <form onSubmit={handleGuardarProducto}>
              <div className="p-6.5">
                {/* Nombre del Producto */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ingrese el nombre del producto"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>

                {/* Categoría y Subcategoría en la misma fila */}
                <div className="mb-4.5 flex gap-4">
                  <div className="w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Categoría
                    </label>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                    <label className="mb-2.5 block text-black dark:text-white">
                      Subcategoría
                    </label>
                    <select
                      value={subCategoria}
                      onChange={(e) => setSubCategoria(e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
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
                  <label className="mb-2.5 block text-black dark:text-white">
                    Género
                  </label>
                  <select
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  >
                    <option value="">Seleccione un género</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Niños">Niños</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                {/* El resto del formulario */}
                {/* Talla */}
                <div className="mb-4.5"></div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Talla
                </label>
                <input
                  type="text"
                  value={tallaId}
                  onChange={(e) => setTallaId(parseInt(e.target.value))}
                  placeholder="Ingrese la talla"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {/* Precio de Compra y Precio de Venta en la misma fila */}
                <div className="mb-4.5 flex gap-4">
                  <div className="w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Precio de Compra
                    </label>
                    <input
                      type="number"
                      value={precioCompra}
                      onChange={(e) =>
                        setPrecioCompra(parseFloat(e.target.value))
                      }
                      placeholder="Ingrese el precio de compra"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Precio de Venta
                    </label>
                    <input
                      type="number"
                      value={precioVenta}
                      onChange={(e) =>
                        setPrecioVenta(parseFloat(e.target.value))
                      }
                      placeholder="Ingrese el precio de venta"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* Stock y Visible en la misma fila */}
                <div className="mb-4.5 flex gap-4">
                  <div className="w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(parseInt(e.target.value))}
                      placeholder="Ingrese el stock"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-1/2 flex items-center">
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
                  <label className="mb-2.5 block text-black dark:text-white">
                    Descripción
                  </label>
                  <textarea
                    rows={4}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ingrese una descripción"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  ></textarea>
                </div>
                {errorMsg && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                    {errorMsg}
                  </div>
                )}
                {/* Observaciones */}
                <div className="mb-4.5"></div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Observaciones
                </label>
                <input
                  type="text"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ingrese observaciones"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />

                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
                >
                  Guardar Producto
                </button>
              </div>
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
                  Agregar Imagen
                </label>
                <input
                  type="file"
                  accept="image/*" // Aceptar solo archivos de imagen
                  multiple
                  onChange={handleAgregarImagen}
                  className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                />
              </div>

              {imagenes.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-black dark:text-white mb-2">
                    Imágenes Agregadas:
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
      </div>
    </>
  );
};

export default RegistrarProducto;
