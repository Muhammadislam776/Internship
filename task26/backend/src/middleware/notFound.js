import AppError from '../utils/AppError.js';

/**
 * Express 404 Not Found Catch-All Middleware
 */
export const notFound = (req, res, next) => {
  const err = new AppError(`Resource not found: ${req.method} ${req.originalUrl}`, 404);
  next(err);
};

export default notFound;
