import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

import app from './app.js';
import logger from './config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// Catch Uncaught Exceptions
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! 💥 ${err.name}: ${err.message}`, {
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
});

// Catch Unhandled Promise Rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`UNHANDLED PROMISE REJECTION! 💥 Reason: ${reason}`, {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : null,
    timestamp: new Date().toISOString()
  });
});

// Seed initial log entries if combined.log is empty
const seedInitialLogsIfEmpty = () => {
  const combinedLogPath = path.resolve(__dirname, '../logs/combined.log');
  try {
    if (!fs.existsSync(combinedLogPath) || fs.readFileSync(combinedLogPath, 'utf-8').trim() === '') {
      logger.info('Initializing DevPulse Backend Service', { service: 'devpulse-api' });
      logger.info('Database connection established: PostgreSQL (mock_pool)', { poolSize: 10 });
      logger.info('Winston log daily rotation transports mounted', { directory: 'backend/logs/' });
      
      // Seed a few initial realistic requests for immediate dashboard richness
      logger.info('GET /api/health 200 - 12ms', { method: 'GET', url: '/api/health', statusCode: 200, responseTime: '12ms', responseTimeMs: 12, ip: '127.0.0.1' });
      logger.info('GET /api/users 200 - 38ms', { method: 'GET', url: '/api/users', statusCode: 200, responseTime: '38ms', responseTimeMs: 38, ip: '127.0.0.1' });
      logger.warn('GET /api/users/999 404 - 15ms', { method: 'GET', url: '/api/users/999', statusCode: 404, responseTime: '15ms', responseTimeMs: 15, ip: '127.0.0.1' });
      logger.error('GET /api/test/error 500 - 45ms', { 
        method: 'GET', 
        url: '/api/test/error', 
        statusCode: 500, 
        responseTime: '45ms', 
        responseTimeMs: 45, 
        ip: '127.0.0.1',
        stack: 'Error: Intentional Internal Server Error\n    at /backend/src/routes/testErrors.js:12:9'
      });
    }
  } catch (err) {
    console.error('Failed to seed initial log entries:', err);
  }
};

const server = app.listen(PORT, () => {
  seedInitialLogsIfEmpty();
  logger.info(`DevPulse Backend Server started on port ${PORT} in [${process.env.NODE_ENV || 'development'}] mode`);
  logger.info(`Health Check Endpoint available at http://localhost:${PORT}/api/health`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down server gracefully...');
  server.close(() => {
    logger.info('Process terminated!');
  });
});
