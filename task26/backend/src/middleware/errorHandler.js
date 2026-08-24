import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';

/**
 * Global Express Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || 'Internal Server Error';
  error.stack = err.stack;
  
  // Set default status code if missing
  let statusCode = err.statusCode || res.statusCode || 500;
  if (statusCode === 200) statusCode = 500;

  // Handle specific known error types
  if (err.name === 'ValidationError') {
    statusCode = 422;
    error = new AppError(err.message || 'Validation failed', 422, err.errors);
  } else if (err.name === 'CastError' || err.name === 'SyntaxError') {
    statusCode = 400;
    error = new AppError('Bad Request: Invalid data payload', 400);
  } else if (err.code === 11000) {
    statusCode = 409;
    error = new AppError('Conflict: Duplicate field value entered', 409);
  }

  const isDev = process.env.NODE_ENV === 'development';

  // Construct detailed metadata for Winston logging
  const logContext = {
    method: req.method,
    url: req.originalUrl || req.url,
    statusCode,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
    timestamp: new Date().toISOString(),
    stack: err.stack,
    details: err.details || null,
    isOperational: err.isOperational || false
  };

  // Log complete error details to Winston (error.log and combined.log)
  logger.error(`[Global Error] ${req.method} ${req.originalUrl} - ${statusCode} - ${error.message}`, logContext);

  // Return clean JSON response to frontend
  const responsePayload = {
    success: false,
    message: error.message,
    statusCode,
    ...(err.details && { details: err.details }),
    ...(isDev && { stack: err.stack }) // Only include stack trace in dev mode if explicitly requested
  };

  res.status(statusCode).json(responsePayload);
};

export default errorHandler;
