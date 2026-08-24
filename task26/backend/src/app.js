import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import requestLogger from './middleware/requestLogger.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

import healthRoutes from './routes/health.js';
import userRoutes from './routes/users.js';
import logRoutes from './routes/logs.js';
import metricsRoutes from './routes/metrics.js';
import testRoutes from './routes/testErrors.js';
import alertRoutes from './routes/alerts.js';
import performanceRoutes from './routes/performance.js';

const app = express();

// Enable CORS
const allowedOrigins = [process.env.CORS_ORIGIN || 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Winston Request Logger Middleware
app.use(requestLogger);

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/test', testRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/performance', performanceRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'DevPulse API Observatory',
    version: '1.0.0',
    description: 'Real-Time API Health & Error Intelligence Platform',
    documentation: '/api/health'
  });
});

// 404 Handler
app.use(notFound);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
