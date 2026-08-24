import React from 'react';
import { StatusBadge, MethodBadge, LevelBadge } from './StatusBadge';

const ErrorModal = ({ log, onClose }) => {
  if (!log) return null;

  const copyStackTrace = () => {
    if (log.stack) {
      navigator.clipboard.writeText(log.stack);
      alert('Stack trace copied to clipboard!');
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-dark text-light border border-secondary shadow-lg rounded-4 overflow-hidden">
          
          {/* Header */}
          <div className="modal-header border-bottom border-secondary px-4 py-3 bg-navy d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 rounded bg-danger-subtle text-danger border border-danger-subtle">
                <i className="bi bi-bug-fill fs-4"></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold text-white mb-0">Error Intelligence Details</h5>
                <span className="text-secondary small font-mono">ID: {log.id || 'EVT-LOG- Winston'}</span>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            
            {/* Main Error Message Banner */}
            <div className="alert alert-danger bg-danger-subtle text-danger border border-danger-subtle rounded-3 mb-4">
              <div className="d-flex align-items-center gap-2 mb-1 fw-bold">
                <i className="bi bi-exclamation-triangle-fill"></i> Log Message
              </div>
              <div className="font-mono fs-6">{log.message || 'No explicit error message string available'}</div>
            </div>

            {/* Metadata Grid */}
            <div className="row g-3 mb-4">
              <div className="col-md-4 col-6">
                <div className="p-3 bg-navy rounded-3 border border-secondary-subtle">
                  <div className="text-secondary small text-uppercase fw-semibold mb-1">Level</div>
                  <div><LevelBadge level={log.level} /></div>
                </div>
              </div>

              <div className="col-md-4 col-6">
                <div className="p-3 bg-navy rounded-3 border border-secondary-subtle">
                  <div className="text-secondary small text-uppercase fw-semibold mb-1">Status Code</div>
                  <div><StatusBadge statusCode={log.statusCode} /></div>
                </div>
              </div>

              <div className="col-md-4 col-6">
                <div className="p-3 bg-navy rounded-3 border border-secondary-subtle">
                  <div className="text-secondary small text-uppercase fw-semibold mb-1">HTTP Method</div>
                  <div><MethodBadge method={log.method} /></div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="p-3 bg-navy rounded-3 border border-secondary-subtle">
                  <div className="text-secondary small text-uppercase fw-semibold mb-1">Endpoint</div>
                  <div className="font-mono text-cyan text-truncate">{log.url || '/'}</div>
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="p-3 bg-navy rounded-3 border border-secondary-subtle">
                  <div className="text-secondary small text-uppercase fw-semibold mb-1">Response Time</div>
                  <div className="font-mono text-white fw-bold">{log.responseTime || `${log.responseTimeMs}ms`}</div>
                </div>
              </div>

              <div className="col-md-3 col-6">
                <div className="p-3 bg-navy rounded-3 border border-secondary-subtle">
                  <div className="text-secondary small text-uppercase fw-semibold mb-1">Client IP</div>
                  <div className="font-mono text-secondary">{log.ip || '127.0.0.1'}</div>
                </div>
              </div>

              <div className="col-12">
                <div className="p-3 bg-navy rounded-3 border border-secondary-subtle">
                  <div className="text-secondary small text-uppercase fw-semibold mb-1">Timestamp</div>
                  <div className="font-mono text-white">{new Date(log.timestamp).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Validation Details (If available) */}
            {log.details && (
              <div className="mb-4">
                <h6 className="fw-semibold text-warning mb-2">
                  <i className="bi bi-card-checklist me-1"></i> Validation Failures
                </h6>
                <div className="p-3 bg-dark border border-warning-subtle rounded-3 font-mono small text-warning">
                  <pre className="mb-0">{JSON.stringify(log.details, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Stack Trace Section */}
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="fw-semibold text-white mb-0">
                  <i className="bi bi-code-slash text-primary me-1"></i> Formatted Stack Trace
                </h6>
                {log.stack && (
                  <button className="btn btn-sm btn-outline-secondary font-mono" onClick={copyStackTrace}>
                    <i className="bi bi-clipboard me-1"></i> Copy Trace
                  </button>
                )}
              </div>

              {log.stack ? (
                <div className="stack-trace-block">
                  {log.stack}
                </div>
              ) : (
                <div className="p-3 bg-navy rounded-3 border border-secondary text-secondary small italic font-mono">
                  No stack trace captured for this log level (only error-level exceptions record stack traces).
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer border-top border-secondary px-4 py-3 bg-navy">
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
              Close Inspector
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
