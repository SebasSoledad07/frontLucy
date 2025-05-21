import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface User {
  email: string;
  role: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post('http://13.56.234.70:8080/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Set user in state
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
