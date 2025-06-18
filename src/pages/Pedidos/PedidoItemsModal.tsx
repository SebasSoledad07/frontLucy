import React from 'react';

interface PedidoItemsModalProps {
  open: boolean;
  onClose: () => void;
  pedido: any;
}

const PedidoItemsModal: React.FC<PedidoItemsModalProps> = ({
  open,
  onClose,
  pedido,
}) => {
  if (!open || !pedido) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
      <div className="relative bg-white shadow-lg p-6 rounded-lg w-full max-w-2xl">
        <button
          className="top-2 right-2 absolute text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="mb-4 font-bold text-lg text-center">
          Detalles del Pedido #{pedido.id}
        </h2>
        <table className="mb-2 border w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 border">Producto</th>
              <th className="px-2 py-1 border">Subcategoría</th>
              <th className="px-2 py-1 border">Talla</th>
              <th className="px-2 py-1 border">Cantidad</th>
              <th className="px-2 py-1 border">Precio Venta</th>
              <th className="px-2 py-1 border">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.items.map((item: any) => (
              <tr key={item.id}>
                <td className="px-2 py-1 border">{item.productoNombre}</td>
                <td className="px-2 py-1 border">{item.subcategoria}</td>
                <td className="px-2 py-1 border">{item.talla}</td>
                <td className="px-2 py-1 border">{item.cantidad}</td>
                <td className="px-2 py-1 border">
                  ${item.precioVenta.toLocaleString()}
                </td>
                <td className="px-2 py-1 border">
                  ${item.subtotal.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 mt-2 px-4 py-2 rounded text-white"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PedidoItemsModal;
