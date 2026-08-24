import express from 'express';
import { calculateMetrics } from '../utils/logReader.js';

const router = express.Router();

/**
 * @route   GET /api/metrics
 * @desc    Get aggregated API performance metrics dynamically calculated by timeframe (24h, 7d, 30d)
 */
router.get('/', (req, res) => {
  const timeframe = req.query.timeframe || '24h';
  const metrics = calculateMetrics(timeframe);
  res.status(200).json({
    success: true,
    data: metrics
  });
});

export default router;
