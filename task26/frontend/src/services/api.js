import axios from 'axios';

// Create base Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response Interceptor for smooth error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = error.response?.data || {
      success: false,
      message: error.message || 'Network error or server unreachable',
      statusCode: error.response?.status || 500
    };
    return Promise.reject(errorResponse);
  }
);

export const HealthService = {
  getHealth: () => api.get('/health')
};

export const MonitoringService = {
  getMetrics: () => api.get('/metrics'),
  getLogs: (params) => api.get('/logs', { params }),
  getErrorLogs: (params) => api.get('/logs/errors', { params }),
  getRawLogs: (params) => api.get('/logs/raw', { params }),
  getDownloadUrl: (filename) => `${import.meta.env.VITE_API_URL || '/api'}/logs/download/${filename}`,
  clearLogs: () => api.delete('/logs')
};

export const AlertsService = {
  getAlerts: () => api.get('/alerts'),
  resolveIncident: (id) => api.post(`/alerts/resolve/${id}`)
};

export const PerformanceService = {
  getPerformance: () => api.get('/performance')
};

export const UserService = {
  getUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data)
};

export const TestErrorService = {
  trigger500Error: () => api.get('/test/error'),
  trigger404Error: () => api.get('/test/not-found'),
  triggerValidationError: () => api.get('/test/validation-error'),
  triggerServerError: () => api.get('/test/server-error'),
  triggerUnauthorized: () => api.get('/test/unauthorized'),
  triggerForbidden: () => api.get('/test/forbidden'),
  simulateTraffic: () => api.post('/test/simulate-traffic')
};

export default api;
