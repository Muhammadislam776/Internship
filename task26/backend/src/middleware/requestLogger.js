import logger from '../config/logger.js';

/**
 * Express middleware to record HTTP requests and response times using Winston.
 */
export const requestLogger = (req, res, next) => {
  const startHighResTime = process.hrtime();
  const startTime = Date.now();

  // Capture response finish event
  res.on('finish', () => {
    const diff = process.hrtime(startHighResTime);
    const responseTimeMs = Math.round((diff[0] * 1e3 + diff[1] * 1e-6) * 100) / 100;
    const statusCode = res.statusCode;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.get('user-agent') || 'Unknown';

    const logPayload = {
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode,
      responseTime: `${responseTimeMs}ms`,
      responseTimeMs,
      ip,
      userAgent,
      timestamp: new Date(startTime).toISOString()
    };

    const message = `${req.method} ${req.originalUrl || req.url} ${statusCode} - ${responseTimeMs}ms`;

    if (statusCode >= 500) {
      logger.error(message, logPayload);
    } else if (statusCode >= 400) {
      logger.warn(message, logPayload);
    } else {
      logger.info(message, logPayload);
    }
  });

  next();
};

export default requestLogger;
