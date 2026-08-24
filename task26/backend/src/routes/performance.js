import express from 'express';
import os from 'os';
import v8 from 'v8';

const router = express.Router();

/**
 * @route   GET /api/performance
 * @desc    Get detailed Node.js V8 heap memory statistics and system CPU metrics
 */
router.get('/', (req, res) => {
  const heapStats = v8.getHeapStatistics();
  const memUsage = process.memoryUsage();
  const cpuLoad = os.loadavg();

  const data = {
    timestamp: new Date().toISOString(),
    processUptimeSeconds: Math.floor(process.uptime()),
    v8Heap: {
      totalHeapSize: `${Math.round(heapStats.total_heap_size / (1024 * 1024))} MB`,
      totalHeapSizeExecutable: `${Math.round(heapStats.total_heap_size_executable / (1024 * 1024))} MB`,
      usedHeapSize: `${Math.round(heapStats.used_heap_size / (1024 * 1024))} MB`,
      heapSizeLimit: `${Math.round(heapStats.heap_size_limit / (1024 * 1024))} MB`,
      usedPercentage: `${((heapStats.used_heap_size / heapStats.heap_size_limit) * 100).toFixed(1)}%`
    },
    memory: {
      rss: `${Math.round(memUsage.rss / (1024 * 1024))} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / (1024 * 1024))} MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / (1024 * 1024))} MB`,
      external: `${Math.round(memUsage.external / (1024 * 1024))} MB`,
      arrayBuffers: `${Math.round(memUsage.arrayBuffers / (1024 * 1024))} MB`
    },
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      cpuCount: os.cpus().length,
      cpuModel: os.cpus()[0]?.model || 'Generic CPU',
      totalMemory: `${Math.round(os.totalmem() / (1024 * 1024))} MB`,
      freeMemory: `${Math.round(os.freemem() / (1024 * 1024))} MB`,
      loadAvg: cpuLoad
    }
  };

  res.status(200).json({ success: true, data });
});

export default router;
