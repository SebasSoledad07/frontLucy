import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import axios from 'axios';

import { Usuario } from '../types/Usuario';
import { Rol } from '../types/Rol';

// Define el tipo para el contexto del usuario
type UsuariosContextType = {
  roles: Rol[] | null;
  setRoles: React.Dispatch<React.SetStateAction<Rol[] | null>>;
  usuarios: Usuario[] | null;
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[] | null>>;

  fetchUsuarios: () => void;
};

// Crea el contexto y define el tipo que puede ser UserContextType o undefined
const UsuariosContext = createContext<UsuariosContextType | undefined>(
  undefined,
);

// Hook para usar el contexto
export const useUsuariosContext = (): UsuariosContextType => {
  const context = useContext(UsuariosContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

// Proveedor del contexto del usuario
export const UsuariosProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [roles, setRoles] = useState<Rol[] | null>([]);
  const [usuarios, setUsuarios] = useState<Usuario[] | null>([]);

  const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;
  if (!BASE_URL || typeof BASE_URL !== 'string') {
    console.error('BASE_URL is not defined. Check your environment variables.');
  }
  const normalizedBaseUrl =
    BASE_URL && BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

  const token = localStorage.getItem('token');

  const fetchRoles = async () => {
    try {
      if (!normalizedBaseUrl) throw new Error('BASE_URL is not defined');
      const headers = { Authorization: `Bearer ${token}` };
      // Solicitud para obtener los roles
      const rolesResponse = await axios.get(`${normalizedBaseUrl}/api/roles`, {
        headers,
      });
      setRoles(rolesResponse.data); // Use the array directly, not rolesResponse.data.data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchUsuarios = async () => {
    try {
      if (!normalizedBaseUrl) throw new Error('BASE_URL is not defined');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      // Fetch administrativos (vendedores) and filter out ADMINISTRADOR
      const response = await axios.get(
        `${normalizedBaseUrl}/api/administrativos`,
        { headers },
      );
      // Only keep those whose rol.nombre !== 'ADMINISTRADOR'
      const vendedores = response.data.filter(
        (adm: Usuario) => adm.rol && adm.rol.nombre !== 'ADMINISTRADOR',
      );
      setUsuarios(vendedores);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsuarios();
      fetchRoles();
    }
  }, [token]);

  return (
    <UsuariosContext.Provider
      value={{
        roles,
        setRoles,
        usuarios,
        setUsuarios,
        fetchUsuarios,
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
};
