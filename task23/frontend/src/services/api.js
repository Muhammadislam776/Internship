const BASE_URL = '/api';

export async function fetchOrders(params = {}) {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) queryParams.append(key, value.join(','));
      } else {
        queryParams.append(key, value);
      }
    }
  });

  const res = await fetch(`${BASE_URL}/orders?${queryParams.toString()}`);
  if (!res.ok) throw new Error(`Error fetching orders: ${res.statusText}`);
  return await res.json();
}

export async function fetchOrderById(id) {
  const res = await fetch(`${BASE_URL}/orders/${id}`);
  if (!res.ok) throw new Error(`Error fetching order ${id}: ${res.statusText}`);
  return await res.json();
}

export async function fetchCustomers(params = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const res = await fetch(`${BASE_URL}/customers?${queryParams.toString()}`);
  if (!res.ok) throw new Error(`Error fetching customers: ${res.statusText}`);
  return await res.json();
}

export async function fetchCustomerById(id) {
  const res = await fetch(`${BASE_URL}/customers/${id}`);
  if (!res.ok) throw new Error(`Error fetching customer profile: ${res.statusText}`);
  return await res.json();
}

export async function fetchCustomerOrders(customerId) {
  const res = await fetch(`${BASE_URL}/customers/${customerId}/orders`);
  if (!res.ok) throw new Error(`Error fetching customer orders: ${res.statusText}`);
  return await res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${BASE_URL}/analytics`);
  if (!res.ok) throw new Error(`Error fetching analytics: ${res.statusText}`);
  return await res.json();
}

export async function fetchSearchIntelligence() {
  const res = await fetch(`${BASE_URL}/search-intelligence`);
  if (!res.ok) throw new Error(`Error fetching search intelligence: ${res.statusText}`);
  return await res.json();
}

export async function logSearchQuery(query, resultsCount = 0) {
  const res = await fetch(`${BASE_URL}/search-intelligence/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, resultsCount })
  });
  return await res.json();
}
