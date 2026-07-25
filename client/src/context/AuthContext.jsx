import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify existing token on mount
  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem('portfolio_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await authAPI.verify();
      setAdmin(data.admin);
    } catch {
      localStorage.removeItem('portfolio_token');
      localStorage.removeItem('portfolio_admin');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { verifyToken(); }, [verifyToken]);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('portfolio_token', data.token);
    localStorage.setItem('portfolio_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    toast.success('Welcome back!');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('portfolio_admin');
    setAdmin(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
