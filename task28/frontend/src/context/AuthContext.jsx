import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('flowboard_user');
    return storedUser ? JSON.parse(storedUser) : {
      _id: 'demo-user-1',
      name: 'Muhammad',
      email: 'muhammad@flowboard.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Lead Developer'
    };
  });
  const [token, setToken] = useState(() => localStorage.getItem('flowboard_token') || 'demo-token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt token validation if real token exists
    const initAuth = async () => {
      const storedToken = localStorage.getItem('flowboard_token');
      if (storedToken && storedToken !== 'demo-token') {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser(res.user);
            localStorage.setItem('flowboard_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Auth check fallback to demo user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('flowboard_token', res.token);
        localStorage.setItem('flowboard_user', JSON.stringify(res.user));
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const loginAsDemo = () => {
    const demoUser = {
      _id: 'demo-user-1',
      name: 'Muhammad',
      email: 'muhammad@flowboard.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Lead Developer'
    };
    setUser(demoUser);
    setToken('demo-token');
    localStorage.setItem('flowboard_token', 'demo-token');
    localStorage.setItem('flowboard_user', JSON.stringify(demoUser));
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await authService.register({ name, email, password, role });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('flowboard_token', res.token);
        localStorage.setItem('flowboard_user', JSON.stringify(res.user));
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('flowboard_token');
    localStorage.removeItem('flowboard_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginAsDemo, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
