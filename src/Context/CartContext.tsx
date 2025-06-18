import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ProductoImagen {
  id: number;
  url: string;
  posicion: number;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
  imagenes: ProductoImagen[];
  precio: number; // Add price field for frontend
  precioVenta?: number; // Optional sale price for frontend
  tallaId?: number; // Optional tallaId for cart items
}

export interface CartItem {
  producto: Producto;
  quantity: number;
  tallaId?: number; // Add tallaId to cart item
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (producto: Producto, tallaId?: number) => void;
  removeFromCart: (productoId: number) => void;
  updateQuantity: (productoId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

const CART_KEY = 'cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (producto: Producto, tallaId?: number) => {
    setCart((prev) => {
      const found = prev.find(
        (item) => item.producto.id === producto.id && item.tallaId === tallaId,
      );
      if (found) {
        // Always update price to latest
        return prev.map((item) =>
          item.producto.id === producto.id && item.tallaId === tallaId
            ? {
                ...item,
                quantity: item.quantity + 1,
                producto: { ...item.producto, precio: producto.precio },
                tallaId,
              }
            : item,
        );
      }
      return [...prev, { producto, quantity: 1, tallaId }];
    });
  };

  const removeFromCart = (productoId: number) => {
    setCart((prev) => prev.filter((item) => item.producto.id !== productoId));
  };

  const updateQuantity = (productoId: number, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.producto.id === productoId ? { ...item, quantity } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setCart([]);

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.producto.precio * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
