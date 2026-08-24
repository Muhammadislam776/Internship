import React, { useState, useEffect } from 'react';
import { HealthService, MonitoringService, TestErrorService } from '../services/api';
import { useToast } from '../context/ToastContext';

const Overview = () => {
  const [health, setHealth] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hRes, lRes] = await Promise.all([
        HealthService.getHealth(),
        MonitoringService.getLogs({ limit: 6 })
      ]);
      if (hRes.success) setHealth(hRes.data);
      if (lRes.success) setRecentLogs(lRes.data || []);
    } catch (err) {
      console.error('Failed to load overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimulate = async () => {
    try {
      const res = await TestErrorService.simulateTraffic();
      addToast(`Generated ${res.count || 15} simulated requests`, 'success');
      fetchData();
    } catch (err) {
      addToast('Traffic simulation failed', 'error');
    }
  };

  const microservices = [
    { name: 'User Authentication API', path: '/api/v1/auth', status: 'Operational', latency: '24ms', region: 'us-east-1' },
    { name: 'Payment Gateway Broker', path: '/api/v1/payments', status: 'Operational', latency: '142ms', region: 'us-east-1' },
    { name: 'User Profile Microservice', path: '/api/users', status: 'Operational', latency: '38ms', region: 'us-west-2' },
    { name: 'Notification Dispatcher', path: '/api/v1/notifications', status: 'Operational', latency: '18ms', region: 'us-east-1' },
    { name: 'Winston File Logging Daemon', path: 'backend/logs/combined.log', status: 'Operational', latency: '4ms', region: 'local' },
    { name: 'Metrics Telemetry Aggregator', path: '/api/metrics', status: 'Operational', latency: '12ms', region: 'local' }
  ];

  return (
    <div className="p-4">
      {/* Title */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="fw-bold text-white mb-1" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>System Overview</h1>
          <p className="text-secondary mb-0">High-level executive system vitals, active microservices & live telemetry hub.</p>
        </div>

        <button className="btn btn-primary btn-sm px-3 py-2 font-mono fw-semibold d-flex align-items-center gap-2" onClick={handleSimulate}>
          <i className="bi bi-lightning-charge-fill text-warning"></i>
          <span>Simulate Traffic</span>
        </button>
      </div>

      {/* Main Status Banner */}
      <div className="card-devpulse p-4 mb-4" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
              <span className="dot-status green" style={{ width: 14, height: 14 }}></span>
            </div>
            <div>
              <h3 className="fw-bold text-success mb-1">ALL MICROSERVICES OPERATIONAL</h3>
              <div className="text-secondary small font-mono">
                Region: <span className="text-cyan">us-east-1</span> | Active Nodes: <span className="text-white">6/6 Healthy</span> | SLA Target: <span className="text-white">99.9%</span>
              </div>
            </div>
          </div>

          <div className="text-end font-mono">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fs-6">
              ● 0 ACTIVE INCIDENTS
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Quick Vitals */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-devpulse p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small font-mono">SYSTEM UPTIME</span>
              <i className="bi bi-clock-history text-primary fs-5"></i>
            </div>
            <h2 className="fw-bold text-white font-mono mb-1">{health?.uptime?.formatted || '0s'}</h2>
            <span className="text-secondary small font-mono">Continuous runtime</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-devpulse p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small font-mono">HEAP MEMORY USED</span>
              <i className="bi bi-cpu text-cyan fs-5"></i>
            </div>
            <h2 className="fw-bold text-cyan font-mono mb-1">{health?.processMemory?.heapUsed || '0 MB'}</h2>
            <span className="text-secondary small font-mono">Total: {health?.processMemory?.heapTotal || '0 MB'}</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-devpulse p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small font-mono">ERROR BUDGET</span>
              <i className="bi bi-shield-check text-success fs-5"></i>
            </div>
            <h2 className="fw-bold text-success font-mono mb-1">99.2%</h2>
            <span className="text-secondary small font-mono">0.8% error budget consumed</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-devpulse p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small font-mono">AVG LATENCY</span>
              <i className="bi bi-stopwatch text-warning fs-5"></i>
            </div>
            <h2 className="fw-bold text-warning font-mono mb-1">{health?.metricsSummary?.avgResponseTime || '142ms'}</h2>
            <span className="text-secondary small font-mono">Sub-second response</span>
          </div>
        </div>
      </div>

      {/* Grid: Microservice Status Map & Live Stream Feed */}
      <div className="row g-4">
        
        {/* Microservices Status Map */}
        <div className="col-12 col-lg-7">
          <div className="card-devpulse p-4 h-100">
            <h5 className="fw-bold text-white mb-3">Backend Microservices Map</h5>

            <div className="table-responsive">
              <table className="table-devpulse mb-0">
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Route Path</th>
                    <th>Latency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {microservices.map((svc, idx) => (
                    <tr key={idx}>
                      <td className="fw-semibold text-white">{svc.name}</td>
                      <td className="font-mono text-cyan">{svc.path}</td>
                      <td className="font-mono text-light">{svc.latency}</td>
                      <td>
                        <span className="badge-devpulse badge-operational">
                          <span className="dot-status green"></span> {svc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Activity Log Ticker */}
        <div className="col-12 col-lg-5">
          <div className="card-devpulse p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-white mb-0">Live Winston Activity Stream</h5>
              <span className="badge bg-primary-subtle text-primary font-mono" style={{ fontSize: '0.65rem' }}>LIVE FEED</span>
            </div>

            <div className="d-flex flex-column gap-2 font-mono">
              {recentLogs.length === 0 ? (
                <div className="text-secondary small py-3">No activity logs recorded yet.</div>
              ) : (
                recentLogs.map((log, idx) => (
                  <div key={idx} className="p-2 bg-dark rounded border border-secondary d-flex align-items-center justify-content-between" style={{ fontSize: '0.78rem' }}>
                    <div className="d-flex align-items-center gap-2 text-truncate">
                      <span className={`badge-method badge-method-${log.method || 'GET'}`}>{log.method || 'GET'}</span>
                      <span className="text-cyan text-truncate">{log.url}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                      <span className={log.statusCode >= 400 ? 'text-danger fw-bold' : 'text-success fw-bold'}>{log.statusCode}</span>
                      <span className="text-secondary">{log.responseTime || '12ms'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;
