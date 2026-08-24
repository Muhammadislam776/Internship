import React, { useState, useEffect } from 'react';
import { MonitoringService } from '../services/api';
import { MethodBadge } from '../components/StatusBadge';

const Metrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await MonitoringService.getMetrics();
      if (res.success) setMetrics(res.data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">API Metrics & Performance Telemetry</h2>
          <p className="text-secondary small mb-0">
            In-depth statistical analytics calculated from Winston JSON logs
          </p>
        </div>

        <button className="btn btn-sm btn-outline-info d-flex align-items-center gap-2" onClick={fetchMetrics}>
          <i className="bi bi-arrow-clockwise"></i>
          <span>Re-compute Metrics</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="card card-dark p-3 text-center">
            <span className="text-secondary small text-uppercase font-mono">Error Rate</span>
            <h2 className="fw-bold text-danger my-1 font-mono">{metrics?.errorRate || '0.0%'}</h2>
            <span className="text-secondary small">Ratio of 4xx/5xx requests</span>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card card-dark p-3 text-center">
            <span className="text-secondary small text-uppercase font-mono">Avg Latency</span>
            <h2 className="fw-bold text-cyan my-1 font-mono">{metrics?.avgResponseTime || '0ms'}</h2>
            <span className="text-secondary small">Mean request duration</span>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card card-dark p-3 text-center">
            <span className="text-secondary small text-uppercase font-mono">Total Requests</span>
            <h2 className="fw-bold text-primary my-1 font-mono">{metrics?.totalRequests || 0}</h2>
            <span className="text-secondary small">Recorded events</span>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card card-dark p-3 text-center">
            <span className="text-secondary small text-uppercase font-mono">Success Count</span>
            <h2 className="fw-bold text-success my-1 font-mono">{metrics?.successfulRequests || 0}</h2>
            <span className="text-secondary small">HTTP 2xx & 3xx</span>
          </div>
        </div>
      </div>

      {/* Slowest Endpoints Leaderboard */}
      <div className="card card-dark p-4 mb-4">
        <h5 className="fw-semibold text-white mb-3">
          <i className="bi bi-speedometer2 text-warning me-2"></i> Endpoint Performance Leaderboard
        </h5>

        <div className="table-responsive">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Avg Latency</th>
                <th>Total Requests</th>
                <th>Error Count</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-secondary">Loading telemetry...</td>
                </tr>
              ) : !metrics?.slowestEndpoints || metrics.slowestEndpoints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-secondary font-mono">No endpoint telemetry available</td>
                </tr>
              ) : (
                metrics.slowestEndpoints.map((ep, idx) => (
                  <tr key={idx}>
                    <td><MethodBadge method={ep.method} /></td>
                    <td className="font-mono text-cyan">{ep.endpoint}</td>
                    <td className="font-mono text-white fw-bold">{ep.avgLatency}</td>
                    <td className="font-mono text-light">{ep.totalRequests}</td>
                    <td className="font-mono text-danger">{ep.errorCount}</td>
                    <td>
                      <span className={`badge ${ep.errorCount > 0 ? 'bg-warning-subtle text-warning border border-warning-subtle' : 'bg-success-subtle text-success border border-success-subtle'} font-mono`}>
                        {ep.errorCount > 0 ? 'DEGRADED' : 'OPTIMAL'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
