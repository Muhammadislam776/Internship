import React, { useState, useEffect } from 'react';
import { HealthService } from '../services/api';

const ApiHealth = () => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    HealthService.getHealth().then(res => {
      if (res.success) setHealth(res.data);
    }).catch(console.error);
  }, []);

  const sparklineGreen = "M 0 30 Q 30 10 60 25 T 120 15 T 180 20 T 240 10";
  const sparklineOrange = "M 0 20 Q 30 40 60 15 T 120 35 T 180 10 T 240 30";

  return (
    <div className="p-4">
      {/* Title */}
      <div className="mb-4">
        <h1 className="fw-bold text-white mb-1" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>API Health</h1>
        <p className="text-secondary mb-0">Real-time health of your backend services.</p>
      </div>

      {/* Main Health Card */}
      <div className="card-devpulse p-4 mb-4" style={{ borderColor: 'rgba(6, 182, 212, 0.4)' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
          
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: 56, height: 56 }}>
              <div className="w-100 h-100 rounded-circle border border-success border-2 opacity-50 position-absolute"></div>
              <span className="dot-status green" style={{ width: 14, height: 14 }}></span>
            </div>

            <div>
              <h3 className="fw-bold text-success mb-1" style={{ letterSpacing: '-0.02em' }}>API OPERATIONAL</h3>
              <div className="text-secondary small">
                <i className="bi bi-check-circle me-1"></i> All core services running smoothly
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-5">
            <div>
              <div className="text-secondary small font-mono mb-1">Uptime (30d)</div>
              <div className="fw-bold text-white font-mono" style={{ fontSize: '2rem' }}>99.98%</div>
            </div>

            <div>
              <div className="text-secondary small font-mono mb-1">Global Avg Latency</div>
              <div className="fw-bold text-white font-mono" style={{ fontSize: '2rem' }}>
                {health?.metricsSummary?.avgResponseTime || '142ms'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Endpoint Cards Grid */}
      <div className="row g-3">
        
        {/* /api/users */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="card-devpulse h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="font-mono text-cyan fw-bold fs-6">/api/users</span>
                <i className="bi bi-box-arrow-up-right text-secondary"></i>
              </div>

              <div className="mb-3">
                <span className="badge-devpulse badge-operational">
                  <span className="dot-status green"></span> Operational
                </span>
              </div>

              <div className="row text-center mb-3">
                <div className="col-4">
                  <div className="text-secondary small font-mono" style={{ fontSize: '0.7rem' }}>Latency</div>
                  <div className="fw-bold text-white font-mono">124ms</div>
                </div>
                <div className="col-4">
                  <div className="text-secondary small font-mono" style={{ fontSize: '0.7rem' }}>Requests</div>
                  <div className="fw-bold text-white font-mono">42.1k/m</div>
                </div>
                <div className="col-4">
                  <div className="text-secondary small font-mono" style={{ fontSize: '0.7rem' }}>Errors</div>
                  <div className="fw-bold text-white font-mono">0.01%</div>
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <div className="pt-2 border-top border-secondary opacity-75">
              <svg width="100%" height="40" viewBox="0 0 240 40">
                <path d={sparklineGreen} fill="none" stroke="#10B981" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* /api/orders */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="card-devpulse h-100 d-flex flex-column justify-content-between" style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}>
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="font-mono text-warning fw-bold fs-6">/api/orders</span>
                <i className="bi bi-box-arrow-up-right text-secondary"></i>
              </div>

              <div className="mb-3">
                <span className="badge-devpulse badge-degraded">
                  <span className="dot-status orange"></span> Degraded
                </span>
              </div>

              <div className="row text-center mb-3">
                <div className="col-4">
                  <div className="text-secondary small font-mono" style={{ fontSize: '0.7rem' }}>Latency</div>
                  <div className="fw-bold text-warning font-mono">845ms</div>
                </div>
                <div className="col-4">
                  <div className="text-secondary small font-mono" style={{ fontSize: '0.7rem' }}>Requests</div>
                  <div className="fw-bold text-white font-mono">18.5k/m</div>
                </div>
                <div className="col-4">
                  <div className="text-secondary small font-mono" style={{ fontSize: '0.7rem' }}>Errors</div>
                  <div className="fw-bold text-warning font-mono">1.2%</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-top border-secondary opacity-75">
              <svg width="100%" height="40" viewBox="0 0 240 40">
                <path d={sparklineOrange} fill="none" stroke="#F59E0B" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* /api/auth */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="card-devpulse h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="font-mono text-cyan fw-bold fs-6">/api/auth</span>
                <i className="bi bi-box-arrow-up-right text-secondary"></i>
              </div>

              <div className="mb-3">
                <span className="badge-devpulse badge-operational">
                  <span className="dot-status green"></span> Operational
                </span>
              </div>

              <div className="row text-center mb-3">
                <div className="col-4">
                  <div className="text-secondary small font-mono" style={{ fontSize: '0.7rem' }}>Latency</div>
                  <div className="fw-bold text-white font-mono">45ms</div>
                </div>
                <div className="col-4">
                  <div className="text-secondary small font-mono" style={{ fontSize: '0.7rem' }}>Requests</div>
                  <div className="fw-bold text-white font-mono">8.2k/m</div>
                </div>
                <div className="col-4">
                  <div className="text-secondary small font-mono" style={{ fontSize: '0.7rem' }}>Errors</div>
                  <div className="fw-bold text-white font-mono">0.00%</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-top border-secondary opacity-75">
              <svg width="100%" height="40" viewBox="0 0 240 40">
                <path d={sparklineGreen} fill="none" stroke="#10B981" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* /api/webhooks */}
        <div className="col-12 col-md-6 col-xl-4">
          <div className="card-devpulse h-100 d-flex flex-column justify-content-between" style={{ borderColor: 'rgba(244, 63, 94, 0.4)' }}>
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="font-mono text-danger fw-bold fs-6">/api/webhooks</span>
                <i className="bi bi-box-arrow-up-right text-secondary"></i>
              </div>

              <div className="mb-3">
                <span className="badge-devpulse badge-failing">
                  <span className="dot-status red"></span> Failing
                </span>
              </div>

              <div className="row text-center mb-3">
                <div className="col-4">
                  <div className="text-secondary small font-mono" style={{ fontSize: '0.7rem' }}>Latency</div>
                  <div className="fw-bold text-secondary font-mono">--</div>
                </div>
                <div className="col-4">
                  <div className="text-secondary small font-mono" style={{ fontSize: '0.7rem' }}>Requests</div>
                  <div className="fw-bold text-white font-mono">3.1k/m</div>
                </div>
                <div className="col-4">
                  <div className="text-secondary small font-mono" style={{ fontSize: '0.7rem' }}>Errors</div>
                  <div className="fw-bold text-danger font-mono">100%</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-black bg-opacity-40 rounded border border-danger border-opacity-30 text-center font-mono text-danger small">
              Connection Refused
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApiHealth;
