import axios from 'axios';

// Base API URL
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch profile details
 */
export const getProfile = async (id = 'user-1') => {
  const response = await api.get(`/profile/${id}`);
  return response.data;
};

/**
 * Update basic profile metadata
 */
export const updateProfile = async (profileData, id = 'user-1') => {
  const response = await api.put(`/profile/${id}`, profileData);
  return response.data;
};

/**
 * Upload profile picture
 * @param {FormData} formData - Contains 'profile' file
 * @param {Function} onUploadProgress - Callback for upload percentage tracking
 */
export const uploadProfilePicture = async (formData, onUploadProgress) => {
  const response = await api.post('/profile/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onUploadProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    }
  });
  return response.data;
};

/**
 * Delete profile picture and reset to default avatar
 */
export const deleteProfilePicture = async () => {
  const response = await api.delete('/profile/image');
  return response.data;
};

/**
 * Check Backend API Health
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
