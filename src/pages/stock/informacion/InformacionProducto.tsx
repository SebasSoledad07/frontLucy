import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { Carousel } from 'react-responsive-carousel';
import { useParams } from 'react-router-dom';

import { useProductoContext } from '../../../Context/ProductoContext';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { Producto } from '../../../types/producto';

const InformacionProducto = () => {
  const { productos } = useProductoContext();
  const { id } = useParams<{ id: string }>();
  const idNumber: number = parseInt(id ?? '0', 10);
  const producto: Producto | undefined = productos?.find(
    (item: Producto) => item.id === idNumber,
  );

  if (!producto) {
    return <p>Producto no encontrado</p>;
  }

  return (
    <>
      <Breadcrumb pageName="Información producto" lastPage="stock" />
      <div className="mx-auto p-8 max-w-7xl">
        <div className="flex md:flex-row flex-col gap-8">
          <div className="md:w-1/2">
            {producto.imagenes?.length > 0 && (
              <Carousel autoPlay infiniteLoop className="rounded-lg">
                {producto.imagenes.map((imagen, idx) => (
                  <div key={idx}>
                    <img
                      src={imagen.imagenes}
                      alt={`${producto.nombre} - ${idx + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </Carousel>
            )}
          </div>
          <div className="md:w-1/2">
            <h1 className="mb-4 font-bold text-3xl">{producto.nombre}</h1>
            <p className="mb-4 text-gray-700 text-lg">
              Subcategoría: {producto.subCategoria?.nombre || 'N/A'}
            </p>
            <p className="mb-2 text-gray-700 text-lg">
              Stock: {producto.activo}
            </p>
            <p className="mb-6 text-gray-700 text-lg">
              Descripción: {producto.descripcion}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InformacionProducto;
