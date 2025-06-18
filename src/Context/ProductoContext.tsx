import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import axios from 'axios';

import { Categoria } from '../types/Categoria';
import { Producto } from '../types/producto';

// Define el tipo para el contexto del producto
type ProductoContextType = {
  token: string | null;
  categorias: Categoria[] | null;
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[] | null>>;
  productos: Producto[] | null;
  setProductos: React.Dispatch<React.SetStateAction<Producto[] | null>>;
  fetchProductos: () => void;
};
// Crea el contexto
const ProductoContext = createContext<ProductoContextType | undefined>(
  undefined,
);

// Hook para usar el contexto
export const useProductoContext = (): ProductoContextType => {
  const context = useContext(ProductoContext);
  if (!context) {
    throw new Error(
      'useProductoContext must be used within a ProductoProvider',
    );
  }
  return context;
};

// Proveedor del contexto del producto
export const ProductoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem('token');
  const [categorias, setCategorias] = useState<Categoria[] | null>([]);
  const [productos, setProductos] = useState<Producto[] | null>([]);
  // Use environment variables for API URL
  const BASE_URL =
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_URL_BACKEND_PROD
      : import.meta.env.VITE_URL_BACKEND_LOCAL;

  // Función para obtener las categorías y marcas
  const fetchCategorias = async () => {
    try {
      // No auth header needed
      const categoriasResponse = await axios.get(`${BASE_URL}/api/categorias`);
      setCategorias(categoriasResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      // Solicitud para obtener los productos
      const productosResponse = await axios.get(
        `${BASE_URL}/api/productos/activos`,
        {
          headers,
        },
      );
      setProductos(productosResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Fetch categories without requiring token
    fetchCategorias();
    if (token) {
      fetchProductos();
    }
  }, [token]);

  return (
    <ProductoContext.Provider
      value={{
        token,
        categorias,
        setCategorias,
        productos,
        setProductos,
        fetchProductos,
      }}
    >
      {children}
    </ProductoContext.Provider>
  );
};
