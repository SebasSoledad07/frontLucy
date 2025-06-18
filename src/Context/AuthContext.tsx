import React, { createContext, useState, useContext, useEffect, ReactNode, } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';


interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// 1. NO exportes el contexto como default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Proveedor como named export
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({ email: decoded.sub, role: decoded.role });
      } catch (e) {
        console.error('Token inválido:', e);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Use environment variables for API URL
      const API_URL =
        (import.meta.env.MODE === 'production'
          ? import.meta.env.VITE_URL_BACKEND_PROD
          : import.meta.env.VITE_URL_BACKEND_LOCAL) + '/login';
      const response = await axios.post(API_URL, {
        email,
        password,
      });
      if (response.status === 200) {
        setUser({ email, role: response.data.rol });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('rol', response.data.rol);
        setTimeout(() => {
          if (
            response.data.rol === 'ROLE_ADMINISTRADOR' ||
            response.data.rol === 'ROLE_GERENTE_DE_VENTA' ||
            response.data.rol === 'ROLE_COORDINADOR_DE_FACTURACION' ||
            response.data.rol === 'ROLE_PRODUCT_MANAGER'
          ) {
            window.location.href = '/admin';
          } else if (response.data.rol === 'ROLE_CLIENTE') {
            window.location.href = '/cliente';
          }
        }, 1000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError('Error de autenticación. Verifica tus credenciales.');
      } else {
        setError('Error de red. Intenta nuevamente más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = { user, login, logout, loading, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Hook separado y claro
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
