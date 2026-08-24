import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', taskRoutes);

// Base Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'TaskForge API is running' });
});

// 404 & Error Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
