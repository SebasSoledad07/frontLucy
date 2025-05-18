import { useProductoContext } from '../../../Context/ProductoContext';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaInfoCircle, FaEdit } from 'react-icons/fa';
import { useUserContext } from '../../../Context/UserContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const CardProducto = () => {
  const { productos, categorias} = useProductoContext();
  const { modulo } = useUserContext();
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedSubCategoria, setSelectedSubCategoria] = useState('');
  

  const filteredProductos = (productos || []).filter((producto) => {
    return (
      (selectedCategoria === '' ||
        producto.subCategoria.categoria.id === parseInt(selectedCategoria)) &&
      (selectedSubCategoria === '' ||
        producto.subCategoria.id === parseInt(selectedSubCategoria))
    );
  });

  return (
  <div>
    {/* Selectores */}
    <div className="flex flex-col md:flex-row gap-4 mb-4 ml-4">
      <select
        value={selectedCategoria}
        onChange={(e) => {
          setSelectedCategoria(e.target.value);
          setSelectedSubCategoria('');
        }}
        className="border border-[#F4B1C7] bg-white p-2 rounded-md text-[#7A5B47] focus:ring-2 focus:ring-[#B695E0]"
      >
        <option value="">Todas las Categorías</option>
        {categorias?.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </select>

      <select
        value={selectedSubCategoria}
        onChange={(e) => setSelectedSubCategoria(e.target.value)}
        className="border border-[#F4B1C7] bg-white p-2 rounded-md text-[#7A5B47] focus:ring-2 focus:ring-[#B695E0]"
        disabled={!selectedCategoria}
      >
        <option value="">Todas las Subcategorías</option>
        {selectedCategoria &&
          categorias
            ?.find((categoria) => categoria.id === parseInt(selectedCategoria))
            ?.subCategorias?.map((subCategoria) => (
              <option key={subCategoria.id} value={subCategoria.id}>
                {subCategoria.nombre}
              </option>
            ))}
      </select>
    </div>

    {/* Cards de productos */}
    <div className="grid grid-cols-1 md:grid-cols-3 md:flex-wrap gap-3 p-4">
      {filteredProductos.length > 0 ? (
        filteredProductos.map((item, index) => (
          <div
            key={index}
            className="border border-[#F4B1C7] bg-[#FFFFFF] rounded-lg p-4 shadow-md"
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
                  className="text-[#F4B1C7] hover:text-[#E38AAA] ml-4"
                >
                  <FaEdit size={20} />
                </Link>
              )}
            </div>
            <Carousel showThumbs={false} infiniteLoop className="w-full h-36">
              {item.imagenes.map((imagen, idx) => (
                <div key={idx}>
                  <img
                    src={URL.createObjectURL(imagen)}
                    alt={`${item.nombre} - ${idx + 1}`}
                    className="w-full h-36 object-cover rounded-md"
                  />
                </div>
              ))}
            </Carousel>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-[#7A5B47]">
                {item.nombre.length > 15
                  ? item.nombre.slice(0, 15) + '...'
                  : item.nombre}
              </h3>
              <div className="flex justify-between">
                <p className="text-sm text-[#7A5B47]">Stock:</p>
                <strong className="text-sm text-[#7A5B47]">
                  {item.activo}
                </strong>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-[#7A5B47]">Visible:</p>
                <p className="text-sm text-[#7A5B47]">
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
