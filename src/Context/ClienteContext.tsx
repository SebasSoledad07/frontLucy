import React, { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction, } from 'react';
import axios from 'axios';

import { Categoria } from '../types/Categoria';
import { Producto } from '../types/producto';
import Carrito from '../types/Carrito';


// Define el tipo para el contexto del cliente
type ClienteContextType = {
  categorias: Categoria[] | null;
  fetchCategorias: () => void;
  productos: Producto[] | null;
  fetchProductos: () => void;
  carrito: Carrito[] | null;
  agregarAlCarrito: (productoId: number) => void;
  quitarDelCarrito: (productoId: number) => void;
  actualizarCantidadCarrito: (productoId: number, cantidad: number) => void;
  vaciarCarrito: () => void;
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  preguntas: Pregunta[] | null;
};

// Crea el contexto
const ClienteContext = createContext<ClienteContextType | undefined>(undefined);

// Hook para usar el contexto
export const useClienteContext = (): ClienteContextType => {
  const context = useContext(ClienteContext);
  if (!context) {
    throw new Error('useClienteContext must be used within a ClienteProvider');
  }
  return context;
};

// Proveedor del contexto del cliente
export const ClienteProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [categorias, setCategorias] = useState<Categoria[] | null>([]);
  const [productos, setProductos] = useState<Producto[] | null>([]);
  const [carrito, setCarrito] = useState<Carrito[]>(obtenerCarrito());
  const [drawerOpen, setDrawerOpen] = useState(false);

  const token = localStorage.getItem('token');
  const BASE_URL =
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_URL_BACKEND_PROD
      : import.meta.env.VITE_URL_BACKEND_LOCAL;

  // Ensure BASE_URL is defined and ends with a slash
  if (!BASE_URL || typeof BASE_URL !== 'string') {
    console.error('BASE_URL is not defined. Check your environment variables.');
  }
  const normalizedBaseUrl =
    BASE_URL && BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

  function obtenerCarrito(): Carrito[] {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  const fetchCategorias = async () => {
    try {
      if (!normalizedBaseUrl) throw new Error('BASE_URL is not defined');
      const response = await axios.get(`${normalizedBaseUrl}/api/categorias`);
      setCategorias(response.data.data);
    } catch (error) {
      console.error('Error fetching categorías:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      if (!normalizedBaseUrl) throw new Error('BASE_URL is not defined');
      const response = await axios.get(
        `${normalizedBaseUrl}/api/productos/activos`,
      );
      setProductos(response.data.data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchProductos();
  }, []);

  const agregarAlCarrito = (productoId: number) => {
    const carritoActual = obtenerCarrito();
    const index = carritoActual.findIndex((item) => item.id === productoId);

    if (index !== -1) {
      carritoActual[index].cantidad += 1;
    } else {
      carritoActual.push({ id: productoId, cantidad: 1 });
    }

    setCarrito(carritoActual);
    localStorage.setItem('carrito', JSON.stringify(carritoActual));
    setDrawerOpen(true);
  };

  const quitarDelCarrito = (productoId: number) => {
    const nuevoCarrito = obtenerCarrito().filter(
      (item) => item.id !== productoId,
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const actualizarCantidadCarrito = (productoId: number, cantidad: number) => {
    const carritoActual = obtenerCarrito();
    const index = carritoActual.findIndex((item) => item.id === productoId);

    if (index !== -1) {
      if (cantidad > 0) {
        carritoActual[index].cantidad = cantidad;
      } else {
        carritoActual.splice(index, 1);
      }
    }

    setCarrito(carritoActual);
    localStorage.setItem('carrito', JSON.stringify(carritoActual));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem('carrito');
  };

  return (
    <ClienteContext.Provider
      value={{
        categorias,
        fetchCategorias,
        productos,
        fetchProductos,
        carrito,
        agregarAlCarrito,
        quitarDelCarrito,
        actualizarCantidadCarrito,
        vaciarCarrito,
        drawerOpen,
        setDrawerOpen,
        preguntas: null, // Asumiendo que no tienes preguntas en este contexto
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
};
