const API_BASE = '/api';
const BACKEND_URL = 'http://127.0.0.1:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('cert_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Safe Fetch Wrapper with IPv4 Fallback
const safeFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    return await res.json();
  } catch (err) {
    // Fallback to explicit backend URL if relative proxy fails
    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, options);
      return await res.json();
    } catch (fallbackErr) {
      console.error('[API Fetch Error]', fallbackErr);
      throw new Error(`API Connection Failed: ${fallbackErr.message}`);
    }
  }
};

export const api = {
  // Auth API
  login: async (credentials) => {
    return safeFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
  },

  register: async (userData) => {
    return safeFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  },

  getMe: async () => {
    return safeFetch('/auth/me', {
      headers: { ...getAuthHeaders() }
    });
  },

  updateProfile: async (data) => {
    return safeFetch('/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
  },

  // Organization Profile & Uploads
  getOrgProfile: async (orgId) => {
    const endpoint = orgId ? `/org/profile?orgId=${orgId}` : '/org/profile';
    return safeFetch(endpoint, { headers: getAuthHeaders() });
  },

  updateOrgProfile: async (data) => {
    return safeFetch('/org/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
  },

  uploadOrgAsset: async (formData) => {
    return safeFetch('/org/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
  },

  getOrgStats: async () => {
    return safeFetch('/org/stats', { headers: getAuthHeaders() });
  },

  // Certificates API
  getCertificates: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeFetch(`/certificates?${query}`, { headers: getAuthHeaders() });
  },

  getCertificateById: async (id) => {
    return safeFetch(`/certificates/${id}`, { headers: getAuthHeaders() });
  },

  createCertificate: async (data) => {
    return safeFetch('/certificates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
  },

  updateCertificate: async (id, data) => {
    return safeFetch(`/certificates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
  },

  revokeCertificate: async (id, reason) => {
    return safeFetch(`/certificates/${id}/revoke`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ reason })
    });
  },

  restoreCertificate: async (id) => {
    return safeFetch(`/certificates/${id}/restore`, {
      method: 'PUT',
      headers: { ...getAuthHeaders() }
    });
  },

  deleteCertificate: async (id) => {
    return safeFetch(`/certificates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Templates API
  getTemplates: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeFetch(`/templates?${query}`);
  },

  getTemplateById: async (id) => {
    return safeFetch(`/templates/${id}`);
  },

  createTemplate: async (data) => {
    return safeFetch('/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
  },

  deleteTemplate: async (id) => {
    return safeFetch(`/templates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Verification Public API
  verifyCertificate: async (certId) => {
    return safeFetch(`/verify/${certId}`);
  },

  // Super Admin API
  getAdminAnalytics: async () => {
    return safeFetch('/admin/analytics', { headers: getAuthHeaders() });
  },

  getAllOrganizations: async () => {
    return safeFetch('/admin/organizations', { headers: getAuthHeaders() });
  },

  getAllUsers: async (role) => {
    const query = role ? `?role=${role}` : '';
    return safeFetch(`/admin/users${query}`, { headers: getAuthHeaders() });
  },

  updateUserStatus: async (id, status) => {
    return safeFetch(`/admin/users/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ status })
    });
  },

  getVerificationLogs: async () => {
    return safeFetch('/admin/verification-logs', { headers: getAuthHeaders() });
  },

  getActivityLogs: async () => {
    return safeFetch('/admin/activity-logs', { headers: getAuthHeaders() });
  },

  getAdminNotifications: async () => {
    return safeFetch('/admin/notifications', { headers: getAuthHeaders() });
  },

  getSystemSettings: async () => {
    return safeFetch('/admin/settings', { headers: getAuthHeaders() });
  },

  updateSystemSettings: async (data) => {
    return safeFetch('/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
  }
};
