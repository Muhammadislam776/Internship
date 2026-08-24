import React, { useState } from 'react';

const RightDrawer = ({ log, onClose }) => {
  const [openAccordion, setOpenAccordion] = useState({
    headers: true,
    queryParams: false,
    responsePayload: true
  });

  if (!log) return null;

  const toggleAccordion = (key) => {
    setOpenAccordion(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="right-drawer-overlay" onClick={onClose}>
      <div className="right-drawer-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h5 className="fw-bold text-white mb-0">Request Details</h5>
            <div className="text-secondary font-mono small mt-1" style={{ fontSize: '0.75rem' }}>
              {log.id || 'req_8f91a2'} • {new Date(log.timestamp).toLocaleString()}
            </div>
          </div>
          <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          
          {/* Method & Performance Stats Row */}
          <div className="row g-2">
            <div className="col-6">
              <div className="p-3 bg-dark rounded-3 border border-secondary">
                <div className="text-secondary small text-uppercase font-mono mb-1" style={{ fontSize: '0.7rem' }}>Method & Status</div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge-method badge-method-${log.method || 'GET'}`}>
                    {log.method || 'GET'}
                  </span>
                  <span className={`badge-devpulse badge-${log.statusCode >= 500 ? 'failing' : log.statusCode >= 400 ? 'degraded' : 'operational'}`}>
                    {log.statusCode || 200} {log.statusCode >= 400 ? 'Error' : 'OK'}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="p-3 bg-dark rounded-3 border border-secondary">
                <div className="text-secondary small text-uppercase font-mono mb-1" style={{ fontSize: '0.7rem' }}>Performance</div>
                <div className="fw-bold text-cyan font-mono d-flex align-items-center gap-1">
                  <span>{log.responseTime || `${log.responseTimeMs || 42}ms`}</span>
                  <i className="bi bi-speedometer2 text-secondary"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Endpoint */}
          <div className="p-3 bg-dark rounded-3 border border-secondary">
            <div className="text-secondary small text-uppercase font-mono mb-1" style={{ fontSize: '0.7rem' }}>Endpoint</div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="font-mono text-cyan small text-truncate me-2">
                {log.url || '/api/v1/users/profile'}
              </div>
              <button
                className="btn btn-sm btn-outline-secondary p-1 border-0"
                onClick={() => copyToClipboard(log.url || '/api/v1/users/profile')}
                title="Copy URL"
              >
                <i className="bi bi-copy"></i>
              </button>
            </div>
          </div>

          {/* Client IP */}
          <div className="p-3 bg-dark rounded-3 border border-secondary">
            <div className="text-secondary small text-uppercase font-mono mb-1" style={{ fontSize: '0.7rem' }}>Client IP</div>
            <div className="font-mono text-light small">
              {log.ip || '192.168.1.104'} <span className="text-secondary">(US-East)</span>
            </div>
          </div>

          {/* Request Headers Accordion */}
          <div className="border border-secondary rounded-3 overflow-hidden bg-dark">
            <div
              className="p-3 d-flex align-items-center justify-content-between cursor-pointer border-bottom border-secondary"
              onClick={() => toggleAccordion('headers')}
              style={{ cursor: 'pointer' }}
            >
              <span className="fw-semibold text-white small font-mono">Request Headers (4)</span>
              <i className={`bi ${openAccordion.headers ? 'bi-chevron-up' : 'bi-chevron-down'} text-secondary`}></i>
            </div>

            {openAccordion.headers && (
              <div className="p-3 font-mono text-secondary small bg-black bg-opacity-40" style={{ fontSize: '0.75rem' }}>
                <div>Accept: application/json</div>
                <div>Authorization: Bearer eyJhbG...</div>
                <div>User-Agent: DevPulse-Client/1.4.2</div>
                <div>X-Request-Id: {log.id || 'req_8f91a2'}</div>
              </div>
            )}
          </div>

          {/* Query Parameters Accordion */}
          <div className="border border-secondary rounded-3 overflow-hidden bg-dark">
            <div
              className="p-3 d-flex align-items-center justify-content-between cursor-pointer"
              onClick={() => toggleAccordion('queryParams')}
              style={{ cursor: 'pointer' }}
            >
              <span className="fw-semibold text-white small font-mono">Query Parameters (0)</span>
              <i className={`bi ${openAccordion.queryParams ? 'bi-chevron-up' : 'bi-chevron-down'} text-secondary`}></i>
            </div>
          </div>

          {/* Response Payload Accordion */}
          <div className="border border-secondary rounded-3 overflow-hidden bg-dark">
            <div
              className="p-3 d-flex align-items-center justify-content-between cursor-pointer border-bottom border-secondary"
              onClick={() => toggleAccordion('responsePayload')}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center gap-2">
                <span className="fw-semibold text-white small font-mono">Response Payload</span>
                <span className="badge bg-secondary font-mono" style={{ fontSize: '0.65rem' }}>JSON</span>
              </div>
              <i className={`bi ${openAccordion.responsePayload ? 'bi-chevron-up' : 'bi-chevron-down'} text-secondary`}></i>
            </div>

            {openAccordion.responsePayload && (
              <div className="p-3 font-mono text-success small bg-black bg-opacity-40" style={{ fontSize: '0.78rem' }}>
                {log.stack ? (
                  <pre className="text-danger mb-0" style={{ whiteSpace: 'pre-wrap' }}>{log.stack}</pre>
                ) : (
                  <pre className="text-info mb-0">{JSON.stringify({
                    status: log.statusCode >= 400 ? 'error' : 'success',
                    data: {
                      id: 'usr_99xjk2',
                      role: 'admin',
                      preferences: { theme: 'dark' }
                    }
                  }, null, 2)}</pre>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default RightDrawer;
