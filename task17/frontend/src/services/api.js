const API_BASE_URL = '/api';

/**
 * Validate and submit user data to POST /api/users
 */
export async function validateAndRegisterUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    return {
      status: 500,
      ok: false,
      data: {
        success: false,
        message: "Network or Server Connection Failed",
        errors: { network: error.message }
      }
    };
  }
}

/**
 * Fetch all validated users from GET /api/users
 */
export async function fetchUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { success: false, users: [] };
  }
}

/**
 * Fetch live statistics from GET /api/stats
 */
export async function fetchStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return { 
      success: false, 
      stats: {
        totalRequestsToday: 0,
        validRequestsToday: 0,
        rejectedRequestsToday: 0,
        validationRate: "100%",
        avgResponseTimeMs: "10ms",
        mostCommonIssue: "None"
      }
    };
  }
}

/**
 * Fetch activity logs from GET /api/logs
 */
export async function fetchLogs() {
  try {
    const response = await fetch(`${API_BASE_URL}/logs`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return { success: false, logs: [] };
  }
}

/**
 * Clear activity logs
 */
export async function clearLogs() {
  try {
    const response = await fetch(`${API_BASE_URL}/logs`, { method: 'DELETE' });
    return await response.json();
  } catch (error) {
    console.error("Failed to clear logs:", error);
    return { success: false };
  }
}

/**
 * Fetch API Health status
 */
export async function fetchHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    return { status: "Offline" };
  }
}
