import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Define los tipos de usuario
type UserRole = 'admin' | 'cliente' | null;

interface User {
  email: string;
  password?: string;
  role: UserRole;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isCliente: () => boolean;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la aplicación
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Verificar si el token es válido y no ha expirado
        const decoded = jwtDecode<User & { exp: number }>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          // Configurar el header de axios para todas las solicitudes
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setCurrentUser({
            email: decoded.email,
            password: decoded.password,
            role: decoded.role,
          });
        } else {
          // Token expirado, eliminarlo
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        // Token inválido, eliminarlo
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Realiza la solicitud de inicio de sesión a tu API
      const response = await axios.post(
        'http://13.56.234.70:8080/api/cliente/login',
        { email, password },
      );
      const { token } = response.data;

      // Guarda el token en localStorage
      localStorage.setItem('auth_token', token);

      // Configura el header de autorización para futuras solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Decodifica el token para obtener información del usuario
      const decoded = jwtDecode<User>(token);
      setCurrentUser({
        email: decoded.email,
        password: decoded.password,
        role: decoded.role,
      });

      return true;
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      return false;
    }
  };

  const logout = () => {
    // Elimina el token del localStorage
    localStorage.removeItem('auth_token');

    // Elimina el header de autorización
    delete axios.defaults.headers.common['Authorization'];

    // Limpia el estado del usuario
    setCurrentUser(null);
  };

  // Verifica roles de usuario
  const isAdmin = (): boolean => {
    return currentUser?.role === 'admin';
  };

  const isCliente = (): boolean => {
    return currentUser?.role === 'cliente';
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isCliente,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
