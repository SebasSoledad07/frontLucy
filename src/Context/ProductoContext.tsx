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
  const BASE_URL = 'https://pijamasbackend.xyz/api';

  // Función para obtener las categorías y marcas
  const fetchCategorias = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Solicitud para obtener las categorías
      const categoriasResponse = await axios.get(`${BASE_URL}/categorias`, {
        headers,
      });
      setCategorias(categoriasResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      // Solicitud para obtener los productos
      const productosResponse = await axios.get(`${BASE_URL}/productos/todos`, {
        headers,
      });
      setProductos(productosResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategorias();
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
