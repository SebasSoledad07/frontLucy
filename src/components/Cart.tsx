import React from 'react';

import { useCart } from '../../Context/CartContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();

  if (cart.length === 0) {
    return <div className="p-4">El carrito está vacío.</div>;
  }

  return (
    <div className="bg-white shadow-md mx-auto mt-6 p-4 rounded max-w-lg">
      <h2 className="mb-4 font-bold text-[#7A5B47] text-xl">
        Carrito de compras
      </h2>
      <ul>
        {cart.map((item) => (
          <li
            key={item.producto.id}
            className="flex justify-between items-center mb-4 pb-2 border-b"
          >
            <div>
              <span className="font-semibold">{item.producto.nombre}</span>
              <div className="text-gray-500 text-sm">
                ${item.producto.precio}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="bg-[#F4B1C7] px-2 rounded text-white"
                onClick={() =>
                  updateQuantity(item.producto.id, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="bg-[#F4B1C7] px-2 rounded text-white"
                onClick={() =>
                  updateQuantity(item.producto.id, item.quantity + 1)
                }
              >
                +
              </button>
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeFromCart(item.producto.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-4">
        <span className="font-bold text-[#7A5B47]">
          Total: ${getTotalPrice()}
        </span>
        <button
          className="bg-[#B199E1] hover:bg-[#A27FD6] px-4 py-2 rounded text-white"
          onClick={clearCart}
        >
          Vaciar carrito
        </button>
      </div>
    </div>
  );
};

export default Cart;
