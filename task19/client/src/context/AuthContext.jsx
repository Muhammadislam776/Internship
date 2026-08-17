import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken, getCurrentUser, loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthStatus = async () => {
    setLoading(true);
    const existingToken = getToken();
    if (!existingToken) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const response = await getCurrentUser();
    if (response.ok && response.data.success) {
      setUser(response.data.user);
      setIsAuthenticated(true);
      setTokenState(existingToken);
      setError(null);
    } else {
      // Token is invalid/expired
      removeToken();
      setTokenState(null);
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    const res = await loginUser({ email, password });
    
    if (res.ok && res.data.success) {
      setToken(res.data.token);
      setTokenState(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true, user: res.data.user };
    } else {
      const errMsg = res.data.message || 'Login failed. Please check credentials.';
      setError(errMsg);
      setLoading(false);
      return { success: false, message: errMsg };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    const res = await registerUser(userData);

    if (res.ok && res.data.success) {
      setToken(res.data.token);
      setTokenState(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true, user: res.data.user };
    } else {
      const errMsg = res.data.message || 'Registration failed.';
      setError(errMsg);
      setLoading(false);
      return { success: false, message: errMsg };
    }
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        refreshAuth: checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
