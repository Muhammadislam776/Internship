import React, { useState, useEffect } from 'react';
import { AlertsService } from '../services/api';
import { useToast } from '../context/ToastContext';

const AlertsIncidents = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await AlertsService.getAlerts();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      addToast('Failed to fetch incident alerts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id) => {
    try {
      await AlertsService.resolveIncident(id);
      addToast(`Incident ${id} marked as resolved`, 'success');
      fetchAlerts();
    } catch (err) {
      addToast('Failed to resolve incident', 'error');
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">Alerts & Incident Response Engine</h2>
          <p className="text-secondary small mb-0">
            Real-time threshold evaluations and operational failure alert rules
          </p>
        </div>

        <button className="btn btn-sm btn-outline-info d-flex align-items-center gap-2" onClick={fetchAlerts}>
          <i className="bi bi-arrow-clockwise"></i>
          <span>Refresh Alerts</span>
        </button>
      </div>

      {/* Incident Status Banner */}
      <div className={`alert ${data?.systemStatus === 'DEGRADED' ? 'bg-danger-subtle text-danger border-danger-subtle' : 'bg-success-subtle text-success border-success-subtle'} p-4 rounded-4 mb-4 shadow-sm`}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className={`p-3 rounded-circle fs-3 ${data?.systemStatus === 'DEGRADED' ? 'bg-danger bg-opacity-20 text-danger' : 'bg-success bg-opacity-20 text-success'}`}>
              <i className={`bi ${data?.systemStatus === 'DEGRADED' ? 'bi-exclamation-triangle-fill' : 'bi-shield-check'}`}></i>
            </div>
            <div>
              <h4 className="fw-bold text-white mb-1">
                System Alert State: {data?.systemStatus || 'HEALTHY'}
              </h4>
              <span className="font-mono small">
                {data?.activeIncidentsCount || 0} Active Incidents Requiring Attention
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="card card-dark p-4 mb-4">
        <h5 className="fw-semibold text-white mb-3">
          <i className="bi bi-bell-fill text-warning me-2"></i> Active & Recent Incidents
        </h5>

        <div className="table-responsive">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Incident Name</th>
                <th>Severity</th>
                <th>Threshold Rule</th>
                <th>Current Level</th>
                <th>Triggered At</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-secondary">Evaluating alert rules...</td>
                </tr>
              ) : !data?.incidents || data.incidents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-secondary font-mono">No active incidents reported.</td>
                </tr>
              ) : (
                data.incidents.map((inc) => (
                  <tr key={inc.id}>
                    <td className="font-mono text-cyan fw-bold">{inc.id}</td>
                    <td className="fw-semibold text-white">{inc.ruleName}</td>
                    <td>
                      <span className={`badge ${inc.severity === 'critical' ? 'bg-danger' : 'bg-warning text-dark'} font-mono`}>
                        {inc.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="font-mono text-secondary small">{inc.threshold}</td>
                    <td className="font-mono text-light fw-bold">{inc.currentValue}</td>
                    <td className="font-mono text-secondary small">{new Date(inc.triggeredAt).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${inc.status === 'ACTIVE' ? 'bg-danger-subtle text-danger border border-danger-subtle' : 'bg-success-subtle text-success border border-success-subtle'} font-mono`}>
                        ● {inc.status}
                      </span>
                    </td>
                    <td className="text-end">
                      {inc.status === 'ACTIVE' ? (
                        <button className="btn btn-sm btn-outline-success py-0 px-2 font-mono" onClick={() => handleResolve(inc.id)}>
                          Resolve
                        </button>
                      ) : (
                        <span className="text-secondary small font-mono">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configured Alert Rules */}
      <div className="card card-dark p-4">
        <h5 className="fw-semibold text-white mb-3">Configured Observability Threshold Rules</h5>
        <div className="row g-3">
          {data?.rules?.map((rule) => (
            <div className="col-12 col-md-6" key={rule.id}>
              <div className="p-3 bg-navy rounded-3 border border-secondary d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-bold text-white mb-1">{rule.name}</div>
                  <div className="font-mono text-secondary small">Condition: {rule.condition}</div>
                </div>
                <span className="badge bg-primary-subtle text-primary font-mono">ENABLED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertsIncidents;
