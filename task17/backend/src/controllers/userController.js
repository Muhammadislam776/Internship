import { store } from '../utils/store.js';

/**
 * Controller executed ONLY when request passes Zod middleware validation.
 */
export const createUser = (req, res) => {
  try {
    // Save validated user data to store
    const createdUser = store.addUser(req.body);

    return res.status(200).json({
      success: true,
      message: "User data is valid",
      user: createdUser
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to persist user",
      errors: { server: error.message }
    });
  }
};

/**
 * Fetch all validated users
 */
export const getUsers = (req, res) => {
  const users = store.getUsers();
  return res.status(200).json({
    success: true,
    count: users.length,
    users
  });
};

/**
 * Fetch validation statistics for dashboard
 */
export const getStats = (req, res) => {
  const stats = store.getStats();
  return res.status(200).json({
    success: true,
    stats
  });
};

/**
 * Fetch validation activity logs
 */
export const getLogs = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
  const logs = store.getLogs(limit);
  return res.status(200).json({
    success: true,
    count: logs.length,
    logs
  });
};

/**
 * Clear activity logs
 */
export const clearLogs = (req, res) => {
  store.clearLogs();
  return res.status(200).json({
    success: true,
    message: "Validation logs cleared successfully"
  });
};
