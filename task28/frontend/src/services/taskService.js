import api from './api';

export const taskService = {
  getTasks: async (params = {}) => {
    const res = await api.get('/tasks', { params });
    return res.data;
  },

  getTaskById: async (id) => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  createTask: async (taskData) => {
    const res = await api.post('/tasks', taskData);
    return res.data;
  },

  updateTask: async (id, taskData) => {
    const res = await api.put(`/tasks/${id}`, taskData);
    return res.data;
  },

  patchTaskPosition: async (id, payload) => {
    // Payload: { status, position }
    const res = await api.patch(`/tasks/${id}`, payload);
    return res.data;
  },

  deleteTask: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

  addComment: async (id, commentData) => {
    const res = await api.post(`/tasks/${id}/comments`, commentData);
    return res.data;
  },

  addSubtask: async (id, title) => {
    const res = await api.post(`/tasks/${id}/subtasks`, { title });
    return res.data;
  },

  toggleSubtask: async (id, subtaskId) => {
    const res = await api.patch(`/tasks/${id}/subtasks/${subtaskId}`);
    return res.data;
  },

  deleteSubtask: async (id, subtaskId) => {
    const res = await api.delete(`/tasks/${id}/subtasks/${subtaskId}`);
    return res.data;
  }
};
