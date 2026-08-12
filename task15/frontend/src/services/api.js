/**
 * AdminSphere API Client
 * Secure client communicating ONLY with the Express server.
 * NEVER imports or exposes the Supabase Service Role key!
 */

const API_BASE_URL = '/admin/users';

export const fetchAdminUsers = async ({
  page = 1,
  perPage = 10,
  search = '',
  role = 'all',
  status = 'all',
  sortBy = 'newest'
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      search,
      role,
      status,
      sortBy
    });

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': 'adminsphere_secure_token'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

export const createAdminUserApi = async (userData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': 'adminsphere_secure_token'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Create Error:', error);
    throw error;
  }
};

export const fetchApiHealth = async () => {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) throw new Error('Health check failed');
    return await response.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
};
