import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; role?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
  isCliente: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

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
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; role?: string }> => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return { success: false };

      const token = response.headers
        .get('Authorization')
        ?.replace('Bearer ', '');
      if (token) {
        const decoded: any = jwtDecode(token);
        const newUser: User = { email: decoded.sub, role: decoded.role };
        setUser(newUser);
        localStorage.setItem('token', token);
        return { success: true, role: decoded.role };
      }

      return { success: false };
    } catch (error) {
      console.error('Error de login:', error);
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAdmin = () => user?.role === 'ROLE_ADMINISTRADOR';
  const isCliente = () => user?.role === 'ROLE_CLIENTE';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isCliente }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
