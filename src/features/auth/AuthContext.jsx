import{ createContext, useState, useContext, useEffect } from 'react';
import { loginUser as loginApiService, registerUser as registerApiService } from "../../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('userToken'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    if (token) {
      localStorage.setItem('userToken', token);
    } else {
      localStorage.removeItem('userToken');
    }
  }, [user, token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginApiService(email, password);
      setUser(data.usuario);
      if (data.usuario && data.usuario.rol === 'admin' && data.token) {
        setToken(data.token);
      }
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };


   const register = async (userData) => {
    setLoading(true);
    try {
      // Llamamos al servicio de API que solo hace la petición fetch
      const data = await registerApiService(userData);
      
      // Opcional y recomendado: Si el registro devuelve un usuario y un token,
      // hacemos login automáticamente.
      if (data.usuario && data.token) {
        setUser(data.usuario);
        setToken(data.token);
      } else if (data.usuario) {
        // Si solo devuelve el usuario pero no el token
        setUser(data.usuario);
      }
      
      setLoading(false);
      return data; // Devolvemos los datos para que el componente muestre el mensaje de éxito
    } catch (error) {
      setLoading(false);
      throw error; // Propagamos el error para que el componente Register lo muestre
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
