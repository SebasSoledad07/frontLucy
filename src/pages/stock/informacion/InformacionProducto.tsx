import { useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useProductoContext } from '../../../Context/ProductoContext';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
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
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            {producto.imagenes?.length > 0 && (
              <Carousel autoPlay infiniteLoop className="rounded-lg ">
                {producto.imagenes.map((imagen, idx) => (
                  <div key={idx}>
                    <img
                      src={imagen.imagen}
                      alt={`${producto.nombre} - ${idx + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </Carousel>
            )}
          </div>
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>
            <p className="text-lg text-gray-700 mb-4">
              Subcategoría: {producto.subCategoria?.nombre || 'N/A'}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              Stock: {producto.activo}
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Descripción: {producto.descripcion}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InformacionProducto;
