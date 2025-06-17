import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import axios from 'axios';

import { Usuario } from '../types/Usuario';

// Define el tipo para el contexto del usuario
type UserContextType = {
  token: string | null;
  modulo: string | null;
  user: any; // Cambia 'any' por un tipo específico si sabes la estructura de 'user'
  usuario: Usuario | null;
  fetchInformacionUsuario: (id: number) => void;
};

// Crea el contexto y define el tipo que puede ser UserContextType o undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook para usar el contexto
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

// Proveedor del contexto del usuario
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [modulo, setModulo] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;
  useEffect(() => {
    // Supone que el token se almacena en localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      parseToken(storedToken);
    }
  }, []);

  const parseToken = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('DEBUG: token payload', payload);
      // Extract role from 'rol' or directly from 'rol' string
      let roleName = null;
      if (payload?.rol?.nombre) {
        roleName = payload.rol.nombre;
      } else if (payload?.rol) {
        roleName = payload.rol;
      } else if (payload?.role) {
        roleName = payload.role;
      }
      // Keep the ROLE_ prefix and use uppercase for consistency
      roleName = roleName ? roleName.toUpperCase() : null;
      setModulo(roleName);
      setUser(payload);
    } catch (error) {
      console.error('Failed to parse token:', error);
    }
  };
  useEffect(() => {
    if (user?.id) {
      fetchInformacionUsuario(user?.id);
    }
  }, [user]);
  const fetchInformacionUsuario = async (id: number) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      // Solicitud para obtener los usuarios
      const usuariosResponse = await axios.get(`${BASE_URL}usuario/${id}/id`, {
        headers,
      });
      if (usuariosResponse.data.success) {
        setUsuario(usuariosResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    // Listen for changes to the token in localStorage (e.g., after login in another tab or programmatically)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'token') {
        const newToken = event.newValue;
        setToken(newToken);
        if (newToken) {
          parseToken(newToken);
        } else {
          setModulo(null);
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Also, watch for token changes in this tab (e.g., after login)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken !== token) {
      setToken(storedToken);
      if (storedToken) {
        parseToken(storedToken);
      } else {
        setModulo(null);
        setUser(null);
      }
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        token,
        modulo,
        user,
        usuario,
        fetchInformacionUsuario,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
