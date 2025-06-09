import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import axios from 'axios';

// Define el tipo para el contexto del usuario
type PedidoContextType = {
  pedidos: any[];
  setPedidos: React.Dispatch<React.SetStateAction<any[]>>;
  fetchPedidos: (estado?: string) => Promise<void>;
  fetchPedidoById: (id: number) => Promise<any>;
  marcarEntregado: (id: number) => Promise<any>;
  marcarEnviado: (id: number) => Promise<any>;
  fetchPedidosPorCliente: (clienteId: number) => Promise<any[]>;
};

// Crea el contexto y define el tipo que puede ser PedidoContextType o undefined
const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

// Hook para usar el contexto
export const usePedidoContext = (): PedidoContextType => {
  const context = useContext(PedidoContext);
  if (!context) {
    throw new Error('usePedidoContext must be used within a PedidoProvider');
  }
  return context;
};

// Proveedor del contexto del usuario
export const PedidoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;
  if (!BASE_URL || typeof BASE_URL !== 'string') {
    console.error('BASE_URL is not defined. Check your environment variables.');
  }
  const normalizedBaseUrl =
    BASE_URL && BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const [pedidos, setPedidos] = useState<any[]>([]);

  // Helper to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Listar pedidos (opcionalmente por estado)
  const fetchPedidos = async (estado?: string) => {
    try {
      let url = `${normalizedBaseUrl}/api/pedidos`;
      if (estado) url += `?estado=${estado}`;
      const response = await axios.get(url, { headers: getAuthHeaders() });
      const data = response.data;
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
      setPedidos([]);
    }
  };

  // Buscar pedido por ID
  const fetchPedidoById = async (id: number) => {
    try {
      const response = await axios.get(
        `${normalizedBaseUrl}/api/pedidos/${id}`,
        { headers: getAuthHeaders() },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching pedido by id:', error);
      return null;
    }
  };

  // Marcar pedido como entregado
  const marcarEntregado = async (id: number) => {
    try {
      const response = await axios.put(
        `${normalizedBaseUrl}/api/pedidos/${id}/entregar`,
        {},
        { headers: getAuthHeaders() },
      );
      return response.data;
    } catch (error) {
      console.error('Error marking pedido as entregado:', error);
      return null;
    }
  };

  // Marcar pedido como enviado
  const marcarEnviado = async (id: number) => {
    try {
      const response = await axios.put(
        `${normalizedBaseUrl}/api/pedidos/${id}/enviar`,
        {},
        { headers: getAuthHeaders() },
      );
      return response.data;
    } catch (error) {
      console.error('Error marking pedido as enviado:', error);
      return null;
    }
  };

  // Listar pedidos por cliente
  const fetchPedidosPorCliente = async (clienteId: number) => {
    try {
      const response = await axios.get(
        `${normalizedBaseUrl}/api/pedidos/cliente/${clienteId}`,
        { headers: getAuthHeaders() },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching pedidos por cliente:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <PedidoContext.Provider
      value={{
        pedidos,
        setPedidos,
        fetchPedidos,
        fetchPedidoById,
        marcarEntregado,
        marcarEnviado,
        fetchPedidosPorCliente,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};
