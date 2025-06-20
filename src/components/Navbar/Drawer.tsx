import { FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { MdClose, MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { FC, useMemo, useState } from 'react';
import React from 'react';

import { useUserContext } from '../../Context/UserContext';
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

function generateReference() {
  return (
    Math.random().toString(36).substring(2, 10) +
    '-' +
    Math.random().toString(36).substring(2, 10)
  );
}

// Helper to generate SHA256 hash (returns hex string)
async function generateIntegritySignature(
  reference,
  amount,
  currency,
  integritySecret,
) {
  const concatenated = `${reference}${amount}${currency}${integritySecret}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(concatenated);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const Drawer: FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } =
    useCart();
  const { modulo, user } = useUserContext();
  // Debug: show modulo and user
  console.log('DEBUG Drawer modulo:', modulo, 'user:', user);
  const navigate = useNavigate();
  // Use precioVenta if available, fallback to precio
  const total = cart.reduce(
    (sum, item) =>
      sum +
      (item.producto.precioVenta ?? item.producto.precio ?? 0) * item.quantity,
    0,
  );
  const amountInCents = Math.round(total * 100); // total is in pesos, convert to cents
  const integritySecret = 'prod_integrity_gqOBSD33ZgkaWbDJ649DTN9dRG7y2ECN'; // WARNING: Exposed for demo only
  const publicKey = 'pub_prod_6y5ASbfDsx7gaMrJLfJGB6ZBJdncftnf';
  const currency = 'COP';
  const [wompiError, setWompiError] = useState('');

  // For debugging: log total and amountInCents
  console.log(
    'Wompi total:',
    total,
    'amountInCents:',
    amountInCents,
    'type:',
    typeof total,
  );

  // Loads the Wompi widget script if not already present
  const loadWompiScript = () => {
    if (!document.getElementById('wompi-widget-js')) {
      const script = document.createElement('script');
      script.src = 'https://checkout.wompi.co/widget.js';
      script.id = 'wompi-widget-js';
      document.body.appendChild(script);
    }
  };

  // Handler for Wompi payment
  const handleWompiPay = async () => {
    setWompiError('');
    if (!Number.isInteger(amountInCents) || amountInCents <= 0) {
      setWompiError(
        `El monto debe ser mayor a 0 para pagar con Wompi. (total: ${total}, amountInCents: ${amountInCents})`,
      );
      return;
    }
    loadWompiScript();
    const reference = generateReference();
    // Debug: log all signature values
    console.log('WOMPI DEBUG:', {
      reference,
      amountInCents,
      currency,
      integritySecret,
      concatenated: `${reference}${amountInCents}${currency}${integritySecret}`,
    });
    const signature = await generateIntegritySignature(
      reference,
      amountInCents,
      currency,
      integritySecret,
    );
    console.log('WOMPI DEBUG: signature', signature);
    // Wait for widget.js to be loaded
    function openWidget() {
      if (window.WidgetCheckout) {
        try {
          const checkout = new window.WidgetCheckout({
            currency,
            amountInCents,
            reference,
            publicKey,
            signature: { integrity: signature },
            redirectUrl: 'https://yourdomain.com/payments/result', // Change to your real URL
          });
          checkout.open(async function (result) {
            // You can handle the result here
            console.log('Transaction result:', result);
            if (result && result.transaction) {
              const transaction = result.transaction;
              const status = transaction.status;
              if (status === 'APPROVED') {
                // Prepare payload for /api/facturas/checkout
                const items = cart.map((item) => ({
                  productoId: item.producto.id,
                  tallaId: item.tallaId || 1, // Use tallaId from cart item
                  cantidad: item.quantity,
                }));
                const payload = {
                  transaction: {
                    amountInCents: transaction.amountInCents,
                    reference: transaction.reference,
                    paymentMethodType: transaction.paymentMethodType,
                    id: transaction.id,
                    status: transaction.status,
                    finalizedAt: transaction.finalizedAt,
                  },
                  items,
                };
                try {
                  const token = localStorage.getItem('token'); // Adjust key if needed
                  const BASE_URL =
                    import.meta.env.MODE === 'production'
                      ? import.meta.env.VITE_URL_BACKEND_PROD
                      : import.meta.env.VITE_URL_BACKEND_LOCAL;
                  const response = await fetch(
                    `${BASE_URL}/api/facturas/checkout`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                      body: JSON.stringify(payload),
                      credentials: 'include', // send cookies for auth if needed
                    },
                  );
                  if (response.ok) {
                    alert(`¡Pago exitoso! ID: ${transaction.id}`);
                    clearCart();
                  } else {
                    setWompiError('Error al registrar la factura.');
                  }
                } catch (err) {
                  setWompiError('Error de red al registrar la factura.');
                }
              } else if (status === 'DECLINED') {
                alert(`Pago rechazado. ID: ${transaction.id}`);
              } else {
                alert(
                  `Estado de la transacción: ${status} (ID: ${transaction.id})`,
                );
              }
            }
          });
        } catch (e) {
          setWompiError('Error al abrir el widget de Wompi.');
        }
      } else {
        setTimeout(openWidget, 100);
      }
    }
    openWidget();
  };

  const renderCarritoItem = (item) => {
    const producto = item.producto;
    // Determine image source: base64 jpeg (from .data), url, or placeholder
    let imgSrc = '/placeholder.png';
    if (producto.imagenes && producto.imagenes.length > 0) {
      const imagen = producto.imagenes[0];
      if (imagen.data) {
        imgSrc = `data:image/jpeg;base64,${imagen.data}`;
      } else if (
        imagen.url &&
        (imagen.url.startsWith('data:image/jpeg;base64,') ||
          imagen.url.startsWith('/9j/'))
      ) {
        imgSrc = imagen.url.startsWith('data:image/jpeg;base64,')
          ? imagen.url
          : `data:image/jpeg;base64,${imagen.url}`;
      } else if (
        imagen.name &&
        (imagen.name.startsWith('data:image/jpeg;base64,') ||
          imagen.name.startsWith('/9j/'))
      ) {
        imgSrc = imagen.name.startsWith('data:image/jpeg;base64,')
          ? imagen.name
          : `data:image/jpeg;base64,${imagen.name}`;
      } else if (
        imagen.url &&
        (imagen.url.endsWith('.jpg') ||
          imagen.url.endsWith('.jpeg') ||
          imagen.url.startsWith('http'))
      ) {
        imgSrc = imagen.url;
      } else if (
        imagen.name &&
        (imagen.name.endsWith('.jpg') ||
          imagen.name.endsWith('.jpeg') ||
          imagen.name.startsWith('http'))
      ) {
        imgSrc = imagen.name;
      }
    }
    return (
      <div key={producto.id} className="mt-3 mb-4">
        <div className="flex justify-between">
          <img
            src={imgSrc}
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
        {wompiError && (
          <div className="mb-2 text-red-600 text-sm">{wompiError}</div>
        )}
        <div className="gap-4 grid grid-cols-2">
          {cart && cart.length > 0 && (
            <>
              {modulo && modulo.includes('CLIENTE') ? (
                <button
                  onClick={handleWompiPay}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium text-white text-sm"
                >
                  Pagar con Wompi
                </button>
              ) : (
                <div className="flex justify-center items-center col-span-2 font-medium text-red-600 text-center">
                  Debes iniciar sesión
                </div>
              )}
            </>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Drawer;
