import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await authApi.getMe();
          if (response.data.success) {
            setUser(response.data.data);
          }
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    if (response.data.success) {
      const { user: userData, accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
    }
  };

  const register = async (email, password, firstname, lastname) => {
    const response = await authApi.register({ email, password, firstname, lastname });
    if (response.data.success) {
      const { user: userData, accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Proceed with logout even if API call fails
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
