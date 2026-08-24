/**
 * Custom Operational Application Error Class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = details;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
