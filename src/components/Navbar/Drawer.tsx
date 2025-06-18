import { FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { MdClose, MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { FC, useMemo } from 'react';

import { useCart } from '../../Context/CartContext';

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
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const total = getTotalPrice();

  const renderCarritoItem = (item) => {
    const producto = item.producto;
    return (
      <div key={producto.id} className="mt-3 mb-4">
        <div className="flex justify-between">
          <img
            src={
              producto.imagenes[0]?.url ||
              producto.imagenes[0]?.name ||
              '/placeholder.png'
            }
            alt={producto.nombre}
            className="rounded-lg w-30 h-30"
          />
          <div className="flex-1 p-1">
            <div className="flex justify-between p-1">
              <span>{producto.nombre}</span>
              <span>{formatCurrency(producto.precioVenta)}</span>
            </div>
            <div>
              <div className="relative flex items-center max-w-[8rem]">
                <button
                  type="button"
                  onClick={() => updateQuantity(producto.id, item.quantity - 1)}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 p-2 border rounded-s-lg h-7"
                  disabled={item.quantity <= 1}
                >
                  <FaMinus />
                </button>
                <input
                  type="text"
                  value={item.quantity}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-700 py-1.5 border w-full h-7 text-sm text-center"
                />
                <button
                  type="button"
                  onClick={() => updateQuantity(producto.id, item.quantity + 1)}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 p-2 border rounded-e-lg h-7"
                >
                  <FaPlus />
                </button>
                <button
                  type="button"
                  onClick={() => removeFromCart(producto.id)}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 ml-1 p-2 border rounded-lg h-7 text-red-900"
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
          className="flex justify-center items-center bg-transparent hover:bg-gray-200 rounded-lg w-8 h-8 text-red-400 text-sm"
        >
          <MdClose className="text-xl" />
        </button>
      </header>

      <div
        className="mt-3 mb-6 text-gray-500 dark:text-gray-400 text-sm"
        style={{
          overflowY: 'auto',
          maxHeight: '470px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {cart && cart.length > 0 ? (
          cart.map(renderCarritoItem)
        ) : (
          <p>No hay productos en el carrito.</p>
        )}
      </div>

      <footer className="bottom-0 left-0 fixed dark:bg-gray-800 p-4 w-full">
        <div className="flex justify-between gap-2 mb-2 text-xl">
          <strong>TOTAL: </strong>
          <span className="font-bold">
            {formatCurrency(
              cart.reduce(
                (sum, item) => sum + item.producto.precioVenta * item.quantity,
                0,
              ),
            )}
          </span>
        </div>
        <div className="gap-4 grid grid-cols-2">
          <button
            onClick={onClose}
            className="bg-white hover:bg-gray-100 px-4 py-2 border rounded-lg font-medium text-gray-900 text-sm"
          >
            Continuar
          </button>
          {cart && cart.length > 0 && (
            <button
              onClick={() => {
                navigate('/cliente/pago');
                onClose();
              }}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg font-medium text-white text-sm"
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
