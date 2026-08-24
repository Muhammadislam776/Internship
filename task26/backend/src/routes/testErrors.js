import express from 'express';
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';

const router = express.Router();

/**
 * @route   GET /api/test/error
 * @desc    Triggers a 500 AppError to demonstrate internal server error handling & Winston error.log
 */
router.get('/error', (req, res, next) => {
  logger.warn('Triggering intentional 500 AppError test');
  throw new AppError('Intentional Internal Server Error triggered for Winston logging test', 500);
});

/**
 * @route   GET /api/test/not-found
 * @desc    Triggers a 404 AppError
 */
router.get('/not-found', (req, res, next) => {
  logger.warn('Triggering intentional 404 AppError test');
  throw new AppError('Requested resource /api/test/not-found was not found on this server', 404);
});

/**
 * @route   GET /api/test/validation-error
 * @desc    Triggers a 422 Validation Error
 */
router.get('/validation-error', (req, res, next) => {
  logger.warn('Triggering intentional 422 Validation Error test');
  const details = {
    username: 'Username must be at least 5 characters long',
    email: 'Invalid email domain format',
    password: 'Password must contain at least one special character'
  };
  throw new AppError('Validation Error: Form submission contains invalid fields', 422, details);
});

/**
 * @route   GET /api/test/unauthorized
 * @desc    Triggers a 401 Unauthorized Error
 */
router.get('/unauthorized', (req, res, next) => {
  throw new AppError('Unauthorized: Missing or invalid JWT authorization token', 401);
});

/**
 * @route   GET /api/test/forbidden
 * @desc    Triggers a 403 Forbidden Error
 */
router.get('/forbidden', (req, res, next) => {
  throw new AppError('Forbidden: Your account does not have permission to perform this action', 403);
});

/**
 * @route   GET /api/test/server-error
 * @desc    Triggers an unhandled runtime Exception (ReferenceError) to verify Winston global error capture
 */
router.get('/server-error', (req, res, next) => {
  logger.warn('Triggering intentional uncaught JavaScript Exception');
  // Intentional undefined reference call
  const undefinedObject = null;
  undefinedObject.executeNonExistentMethod();
});

/**
 * @route   POST /api/test/simulate-traffic
 * @desc    Generates a realistic batch of API requests to populate Winston logs instantly
 */
router.post('/simulate-traffic', (req, res) => {
  const simulatedEvents = [
    { method: 'GET', url: '/api/users', status: 200, time: 24, msg: 'GET /api/users 200 - 24ms' },
    { method: 'POST', url: '/api/users', status: 201, time: 65, msg: 'POST /api/users 201 - 65ms' },
    { method: 'GET', url: '/api/health', status: 200, time: 8, msg: 'GET /api/health 200 - 8ms' },
    { method: 'GET', url: '/api/users/999', status: 404, time: 18, msg: 'GET /api/users/999 404 - 18ms', err: 'User not found' },
    { method: 'POST', url: '/api/users', status: 422, time: 32, msg: 'POST /api/users 422 - 32ms', err: 'User validation failed' },
    { method: 'GET', url: '/api/metrics', status: 200, time: 42, msg: 'GET /api/metrics 200 - 42ms' },
    { method: 'GET', url: '/api/test/error', status: 500, time: 51, msg: 'GET /api/test/error 500 - 51ms', err: 'Intentional Internal Server Error' },
    { method: 'GET', url: '/api/users/1', status: 200, time: 12, msg: 'GET /api/users/1 200 - 12ms' },
    { method: 'GET', url: '/api/test/unauthorized', status: 401, time: 15, msg: 'GET /api/test/unauthorized 401 - 15ms', err: 'Unauthorized access' },
    { method: 'GET', url: '/api/test/forbidden', status: 403, time: 19, msg: 'GET /api/test/forbidden 403 - 19ms', err: 'Forbidden operation' },
    { method: 'GET', url: '/api/users/2', status: 200, time: 14, msg: 'GET /api/users/2 200 - 14ms' },
    { method: 'GET', url: '/api/logs', status: 200, time: 29, msg: 'GET /api/logs 200 - 29ms' },
    { method: 'GET', url: '/api/test/validation-error', status: 422, time: 22, msg: 'GET /api/test/validation-error 422 - 22ms', err: 'Validation Error' },
    { method: 'GET', url: '/api/users/404', status: 404, time: 11, msg: 'GET /api/users/404 404 - 11ms', err: 'User ID not found' },
    { method: 'POST', url: '/api/users', status: 201, time: 58, msg: 'POST /api/users 201 - 58ms' }
  ];

  let generatedCount = 0;
  simulatedEvents.forEach(evt => {
    const meta = {
      method: evt.method,
      url: evt.url,
      statusCode: evt.status,
      responseTime: `${evt.time}ms`,
      responseTimeMs: evt.time,
      ip: '127.0.0.1',
      userAgent: 'DevPulse Simulation Engine/1.0',
      timestamp: new Date().toISOString()
    };

    if (evt.status >= 500) {
      meta.stack = `Error: ${evt.err}\n    at /backend/src/routes/testErrors.js:18:9\n    at Layer.handle [as handle_request]\n    at next (/node_modules/express/lib/router/route.js:144:13)`;
      logger.error(evt.msg, meta);
    } else if (evt.status >= 400) {
      logger.warn(evt.msg, meta);
    } else {
      logger.info(evt.msg, meta);
    }
    generatedCount++;
  });

  res.status(200).json({
    success: true,
    message: `Successfully generated ${generatedCount} simulated API request logs into Winston files`,
    count: generatedCount
  });
});

export default router;
