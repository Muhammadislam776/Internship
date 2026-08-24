import React, { useState, useEffect } from 'react';
import { MonitoringService } from '../services/api';
import ErrorModal from '../components/ErrorModal';

const ErrorIntelligence = () => {
  const [errors, setErrors] = useState([]);
  const [selectedError, setSelectedError] = useState(null);

  useEffect(() => {
    MonitoringService.getErrorLogs({ limit: 10 }).then(res => {
      if (res.success) setErrors(res.data || []);
    }).catch(console.error);
  }, []);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="fw-bold text-white mb-1" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>Error Intelligence</h1>
          <p className="text-secondary mb-0">Understand what's affecting your application.</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary btn-sm px-3 py-2 text-light font-mono">
            <i className="bi bi-calendar3 me-2"></i> Last 24 Hours
          </button>
          <button className="btn btn-primary btn-sm px-3 py-2 fw-semibold">
            <i className="bi bi-sliders me-2"></i> Filters
          </button>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card-devpulse p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 rounded bg-danger bg-opacity-20 text-danger">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <span className="text-secondary small font-mono fw-semibold">Critical Errors</span>
              </div>
              <i className="bi bi-graph-up-arrow text-secondary"></i>
            </div>
            <div className="d-flex align-items-baseline justify-content-between">
              <h2 className="fw-bold text-white font-mono mb-0" style={{ fontSize: '2.5rem' }}>24</h2>
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 font-mono">
                ↑ +4 today
              </span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card-devpulse p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 rounded bg-warning bg-opacity-20 text-warning">
                  <i className="bi bi-exclamation-circle-fill"></i>
                </div>
                <span className="text-secondary small font-mono fw-semibold">Warnings</span>
              </div>
              <i className="bi bi-graph-down-arrow text-secondary"></i>
            </div>
            <div className="d-flex align-items-baseline justify-content-between">
              <h2 className="fw-bold text-warning font-mono mb-0" style={{ fontSize: '2.5rem' }}>86</h2>
              <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1 font-mono">
                ↓ -12 today
              </span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card-devpulse p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 rounded bg-cyan bg-opacity-20 text-cyan">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <span className="text-secondary small font-mono fw-semibold">Resolved</span>
              </div>
              <i className="bi bi-graph-up-arrow text-secondary"></i>
            </div>
            <div className="d-flex align-items-baseline justify-content-between">
              <h2 className="fw-bold text-cyan font-mono mb-0" style={{ fontSize: '2.5rem' }}>142</h2>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 font-mono">
                ↑ +28 today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="row g-4">
        
        {/* Left Side: Active Error Groups */}
        <div className="col-12 col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold text-white mb-0">Active Error Groups</h5>
            <a href="#traces" className="text-secondary small font-mono text-decoration-none">View All Traces</a>
          </div>

          {/* Group 1 */}
          <div className="card-devpulse p-4 mb-3 border-danger border-opacity-30">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-danger text-white font-mono">● CRITICAL</span>
              <span className="badge bg-dark border border-secondary text-secondary font-mono">Status: 500</span>
            </div>

            <h4 className="fw-bold text-white mb-2">Internal Server Error</h4>

            <div className="p-3 bg-black bg-opacity-60 rounded border border-secondary text-danger font-mono small mb-3">
              Uncaught TypeError: Cannot read properties of undefined (reading 'id')
            </div>

            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-4 text-secondary small font-mono">
                <span>⚡ /api/v1/checkout/process</span>
                <span>🔄 147 occurrences</span>
                <span>🕒 Last seen 2m ago</span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-sm btn-outline-secondary text-light">Resolve</button>
                <button className="btn btn-sm btn-primary fw-semibold" onClick={() => setSelectedError({
                  message: "Uncaught TypeError: Cannot read properties of undefined (reading 'id')",
                  statusCode: 500,
                  method: 'POST',
                  url: '/api/v1/checkout/process',
                  timestamp: new Date().toISOString(),
                  stack: "TypeError: Cannot read properties of undefined (reading 'id')\n    at /backend/src/routes/checkout.js:42:15\n    at Layer.handle [as handle_request]"
                })}>
                  <i className="bi bi-search me-1"></i> Investigate
                </button>
              </div>
            </div>
          </div>

          {/* Group 2 */}
          <div className="card-devpulse p-4 border-warning border-opacity-30">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-warning text-dark font-mono">WARNING</span>
              <span className="badge bg-dark border border-secondary text-secondary font-mono">Status: 400</span>
            </div>

            <h4 className="fw-bold text-white mb-2">ReferenceError in PaymentService</h4>

            <div className="p-3 bg-black bg-opacity-60 rounded border border-secondary text-warning font-mono small mb-3">
              stripe_token is not defined at PaymentService.charge
            </div>
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="col-12 col-lg-4">
          
          {/* Top Failing Endpoints Card */}
          <div className="card-devpulse p-4 mb-4">
            <h5 className="fw-bold text-white mb-3">Top Failing Endpoints</h5>

            <div className="d-flex flex-column gap-3 font-mono">
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-cyan">/api/v1/checkout/process</span>
                  <span className="text-danger fw-bold">28%</span>
                </div>
                <div className="progress bg-dark" style={{ height: 6 }}>
                  <div className="progress-bar bg-danger" style={{ width: '28%' }}></div>
                </div>
                <div className="text-end text-secondary" style={{ fontSize: '0.65rem' }}>147 / 525 reqs</div>
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-cyan">/api/v1/users/auth</span>
                  <span className="text-warning fw-bold">15%</span>
                </div>
                <div className="progress bg-dark" style={{ height: 6 }}>
                  <div className="progress-bar bg-warning" style={{ width: '15%' }}></div>
                </div>
                <div className="text-end text-secondary" style={{ fontSize: '0.65rem' }}>89 / 593 reqs</div>
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-cyan">/api/v1/inventory/sync</span>
                  <span className="text-warning fw-bold">8%</span>
                </div>
                <div className="progress bg-dark" style={{ height: 6 }}>
                  <div className="progress-bar bg-warning" style={{ width: '8%' }}></div>
                </div>
                <div className="text-end text-secondary" style={{ fontSize: '0.65rem' }}>34 / 425 reqs</div>
              </div>
            </div>
          </div>

          {/* Cluster Health */}
          <div className="card-devpulse p-4">
            <h5 className="fw-bold text-white mb-3">Cluster Health</h5>

            <div className="d-flex align-items-center gap-4">
              <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                <svg width="80" height="80" viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" stroke="#1E293B" strokeWidth="3.8" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" stroke="#3B82F6" strokeDasharray="85, 100" strokeWidth="3.8" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="position-absolute fw-bold text-white font-mono fs-5">85%</div>
              </div>

              <div>
                <div className="fw-bold text-white font-mono mb-1">US-East-1</div>
                <div className="text-secondary small font-mono">
                  <span className="dot-status green me-1"></span> 3/3 Nodes Healthy
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {selectedError && (
        <ErrorModal log={selectedError} onClose={() => setSelectedError(null)} />
      )}
    </div>
  );
};

export default ErrorIntelligence;
