const API_BASE_URL = '/api';

export const getToken = () => localStorage.getItem('securegate_token');
export const setToken = (token) => localStorage.setItem('securegate_token', token);
export const removeToken = () => localStorage.removeItem('securegate_token');

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({ message: 'Failed to parse JSON response.' }));
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      status: 500,
      ok: false,
      data: { success: false, message: 'Network error or server unreachable.' }
    };
  }
};

export const registerUser = (userData) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
    skipAuth: true
  });
};

export const loginUser = (credentials) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    skipAuth: true
  });
};

export const getCurrentUser = () => {
  return apiRequest('/auth/me', {
    method: 'GET'
  });
};

export const getUserProfile = () => {
  return apiRequest('/users/profile', {
    method: 'GET'
  });
};

export const getUserActivity = () => {
  return apiRequest('/users/activity', {
    method: 'GET'
  });
};
