import { FC, useMemo } from 'react';
import { FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { MdClose, MdDelete } from 'react-icons/md';
import { useClienteContext } from '../../Context/ClienteContext';
import Carrito from '../../types/Carrito';
import { useNavigate } from 'react-router-dom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number | undefined) =>
  typeof value === 'number'
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    : '';

const Drawer: FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { carrito, productos, actualizarCantidadCarrito, quitarDelCarrito } =
    useClienteContext();
  const navigate = useNavigate();
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
            src={producto.imagenes[0]?.name}
            alt={producto.nombre}
            className="w-30 h-30 rounded-lg"
          />
          <div className="p-1 flex-1">
            <div className="flex justify-between p-1">
              <span>{producto.nombre}</span>
              <span>{formatCurrency(producto.precioVenta)}</span>
            </div>
            <div>
              <div className="relative flex items-center max-w-[8rem]">
                <button
                  type="button"
                  onClick={() => updateQuantity(item, -1)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 border rounded-s-lg p-2 h-7"
                >
                  <FaMinus />
                </button>
                <input
                  type="text"
                  value={item.cantidad}
                  readOnly
                  className="bg-gray-50 border text-center h-7 text-sm w-full py-1.5 dark:bg-gray-700"
                />
                <button
                  type="button"
                  onClick={() => updateQuantity(item, 1)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 border rounded-e-lg p-2 h-7"
                >
                  <FaPlus />
                </button>
                <button
                  type="button"
                  onClick={() => quitarDelCarrito(item.id)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-red-900 border rounded-lg p-2 h-7 ml-1"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
          id="drawer-example"
      className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } bg-white text-gray-900 w-100 dark:bg-slate-900 dark:border-r dark:border`}
      aria-labelledby="drawer-label"
    >
      <header className="flex justify-between items-center">
        <h5
          id="drawer-label"
          className="inline-flex items-center mb-4 font-semibold text-gray-900 dark:text-gray-100"
        >
          <FaShoppingBag className="mr-2" /> CARRITO DE COMPRAS
        </h5>
        <button
          type="button"
          onClick={onClose}
          className="text-red-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 flex items-center justify-center"
        >
          <MdClose className="text-xl" />
        </button>
      </header>

      <div
        className="mb-6 mt-3 text-sm text-gray-500 dark:text-gray-400"
        style={{
            overflowY: 'auto',
            maxHeight: '470px',
            scrollbarWidth: 'none', // Para Firefox
            msOverflowStyle: 'none', // Para Internet Explorer y Edge Legacy
          }}
      >
        {carrito && carrito.length > 0 ? (
          carrito.map(renderCarritoItem)
        ) : (
          <p>No hay productos en el carrito.</p>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 w-full p-4 dark:bg-gray-800">
        <div className="flex justify-between text-xl  mb-2 gap-2">
          <strong>TOTAL: </strong>
          <span className="font-bold">{formatCurrency(total)}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border rounded-lg hover:bg-gray-100"
          >
            Continuar
          </button>
          {carrito && carrito.length > 0 && (
        
            <button
              onClick={() => {navigate('/cliente/pago')
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800"
            >
              PAGAR PEDIDO
            </button>
          )}
          
        
        </div>
      </footer>
    </div>
  );
};

export default Drawer;
