import { useMemo } from 'react';
import { useClienteContext } from '../../../../Context/ClienteContext';
import Carrito from '../../../../types/Carrito';

const formatCurrency = (value: number | undefined) =>
  typeof value === 'number'
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    : '';

const Productos = () => {
    const BASE_ENVIO = 42000;
  const { carrito, productos, actualizarCantidadCarrito, quitarDelCarrito } =
    useClienteContext();

  const total = useMemo(() => {
    return carrito?.reduce((sum, item) => {
      const producto = productos?.find((prod) => prod.id === item.id);
      return sum + (producto?.precioVenta || 0) * item.cantidad;
    }, 0);
  }, [carrito, productos]);

  const updateQuantity = (item: Carrito, delta: number) => {
    const nuevaCantidad = item.cantidad + delta;
    actualizarCantidadCarrito(item.id, nuevaCantidad > 0 ? nuevaCantidad : 0);
  };

  const renderCarritoItem = (item: Carrito) => {
    const producto = productos?.find((prod) => prod.id === item.id);

    if (!producto) return null;

    return (
      <div key={item.id} className="mb-4 mt-3">
        <div className="flex justify-between">
          <img
            src={producto.imagenes[0]?.imagen}
            alt={producto.nombre}
            className="w-30 h-30 rounded-lg"
          />
          <div className="p-1 flex-1">
            <div className="flex justify-between p-1">
              <span>{producto.nombre}</span>
              <span>{formatCurrency(producto.precioVenta)}</span>
            </div>
            <div className='flex justify-end'>
                <span>Cantidad:</span>
                <span className='ml-3'>{item.cantidad}</span>

            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="max-w-xl mx-auto ">
        <h1 className="text-2xl font-bold mb-4">Productos</h1>
      {carrito && carrito.length > 0 ? (
        carrito.map(renderCarritoItem)
      ) : (
        <p>No hay productos en el carrito.</p>
      )}
      <div className="flex justify-between text-lg  mb-2 gap-2">
        <span>SubTotal:</span>
        <span>{formatCurrency(total)} </span>
      </div>
      <div className="flex justify-between text-lg  mb-2 gap-2">
        <span>Envio:</span>
        <span>{formatCurrency(BASE_ENVIO)} </span>
      </div>
      <div className="flex justify-between border-t text-lg mt-2 mb-2 gap-2">
        
        <strong>TOTAL: </strong>
        <span className="font-bold">{formatCurrency(total ? total + BASE_ENVIO : 0)}</span>
      </div>
    </div>
  );
};

export default Productos;
