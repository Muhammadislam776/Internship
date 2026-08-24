import express from 'express';
import { calculateMetrics } from '../utils/logReader.js';

const router = express.Router();

let incidents = [
  {
    id: 'INC-101',
    ruleName: 'High 500 Internal Error Rate',
    severity: 'critical',
    status: 'ACTIVE',
    threshold: 'Error Rate > 5.0%',
    currentValue: '6.7%',
    triggeredAt: new Date(Date.now() - 15 * 60000).toISOString(),
    description: 'Intentional test 500 errors detected in error.log exceeding operational threshold.'
  },
  {
    id: 'INC-102',
    ruleName: 'Slow Endpoint Response Latency',
    severity: 'warning',
    status: 'ACTIVE',
    threshold: 'Avg Response Time > 150ms',
    currentValue: '185ms',
    triggeredAt: new Date(Date.now() - 42 * 60000).toISOString(),
    description: 'Endpoint POST /api/users latency spike detected.'
  }
];

const alertRules = [
  { id: 'RULE-1', name: 'Server Error Burst (5xx)', metric: '500_errors', condition: '> 3 in 5m', severity: 'critical', enabled: true },
  { id: 'RULE-2', name: 'High Error Rate %', metric: 'error_rate', condition: '> 5.0%', severity: 'critical', enabled: true },
  { id: 'RULE-3', name: 'High Response Time Latency', metric: 'avg_latency', condition: '> 200ms', severity: 'warning', enabled: true },
  { id: 'RULE-4', name: 'Memory Heap Allocation Spike', metric: 'heap_used', condition: '> 100MB', severity: 'warning', enabled: true }
];

/**
 * @route   GET /api/alerts
 * @desc    Get active alert rules and live incident alerts
 */
router.get('/', (req, res) => {
  const metrics = calculateMetrics();

  res.status(200).json({
    success: true,
    data: {
      incidents,
      rules: alertRules,
      activeIncidentsCount: incidents.filter(i => i.status === 'ACTIVE').length,
      systemStatus: incidents.some(i => i.status === 'ACTIVE' && i.severity === 'critical') ? 'DEGRADED' : 'HEALTHY'
    }
  });
});

/**
 * @route   POST /api/alerts/resolve/:id
 * @desc    Resolve or silence an active incident
 */
router.post('/resolve/:id', (req, res) => {
  const incidentId = req.params.id;
  const inc = incidents.find(i => i.id === incidentId);
  
  if (inc) {
    inc.status = 'RESOLVED';
    inc.resolvedAt = new Date().toISOString();
  }

  res.status(200).json({
    success: true,
    message: `Incident ${incidentId} resolved successfully`,
    incidents
  });
});

export default router;
