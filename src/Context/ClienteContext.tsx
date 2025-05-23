import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import axios from 'axios';
import { Categoria } from '../types/Categoria';
import { Producto } from '../types/Producto';
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

  const BASE_URL = 'http://13.56.234.70:8080/api/';

  function obtenerCarrito(): Carrito[] {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${BASE_URL}categorias`);
      setCategorias(response.data.data);
    } catch (error) {
      console.error('Error fetching categorías:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${BASE_URL}producto`, {
        headers: { 'Content-Type': 'application/json' },
      });
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
