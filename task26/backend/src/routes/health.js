import express from 'express';
import os from 'os';
import logger from '../config/logger.js';
import { calculateMetrics } from '../utils/logReader.js';

const router = express.Router();
const startTime = Date.now();

/**
 * @route   GET /api/health
 * @desc    Get API health status, server uptime, and system performance metrics
 */
router.get('/', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memoryUsage = process.memoryUsage();
  const metrics = calculateMetrics();

  const healthData = {
    status: 'Operational',
    systemStatus: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: uptimeSeconds,
      formatted: formatUptime(uptimeSeconds)
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cpus: os.cpus().length,
      freeMemory: `${Math.round(os.freemem() / (1024 * 1024))} MB`,
      totalMemory: `${Math.round(os.totalmem() / (1024 * 1024))} MB`
    },
    processMemory: {
      rss: `${Math.round(memoryUsage.rss / (1024 * 1024))} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / (1024 * 1024))} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / (1024 * 1024))} MB`
    },
    metricsSummary: {
      totalRequests: metrics.totalRequests,
      errorRate: metrics.errorRate,
      avgResponseTime: metrics.avgResponseTime
    }
  };

  logger.debug('Health check executed', { status: 'healthy' });
  res.status(200).json({ success: true, data: healthData });
});

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}

export default router;
