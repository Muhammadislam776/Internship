import api from './api';

export const authService = {
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  getUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  },

  seedDatabase: async () => {
    const res = await api.post('/seed');
    return res.data;
  }
};
