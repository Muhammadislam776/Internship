import React from 'react';

const DocModal = ({ onClose }) => {
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-dark text-light border border-secondary shadow-lg rounded-4 overflow-hidden">
          
          {/* Header */}
          <div className="modal-header border-bottom border-secondary px-4 py-3 bg-navy d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-question-circle-fill text-info fs-5"></i>
              <h5 className="modal-title fw-bold text-white mb-0">DevPulse Platform Guide & System Architecture</h5>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4 font-sans">
            
            <div className="alert bg-primary-subtle text-primary border border-primary-subtle rounded-3 mb-4">
              <strong className="d-block text-white">Winston Log Engine & Global Error Handler Architecture</strong>
              <span className="small">DevPulse automatically captures API requests and handles exceptions globally using Express middleware.</span>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold text-white mb-2"><i className="bi bi-file-earmark-text text-cyan me-2"></i> 1. Winston File Transports (`backend/logs/`)</h6>
              <ul className="text-secondary small font-mono mb-0">
                <li><code className="text-light">combined.log</code> — All incoming requests and events formatted in machine-readable JSON.</li>
                <li><code className="text-danger">error.log</code> — 4xx & 5xx caught operational errors and stack traces.</li>
                <li><code className="text-warning">exceptions.log</code> — Synchronous Node.js uncaught exceptions.</li>
                <li><code className="text-info">rejections.log</code> — Asynchronous unhandled promise rejections.</li>
              </ul>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold text-white mb-2"><i className="bi bi-shield-slash text-warning me-2"></i> 2. Global Error Middleware (`AppError`)</h6>
              <p className="text-secondary small mb-0">
                Any route throwing an <code className="text-cyan">AppError(message, statusCode)</code> is caught by Express global error middleware in <code className="text-cyan">backend/src/middleware/errorHandler.js</code>, returning clean JSON responses while saving stack traces to disk.
              </p>
            </div>

            <div>
              <h6 className="fw-bold text-white mb-2"><i className="bi bi-flask text-success me-2"></i> 3. Live Error Sandbox (`/test-errors`)</h6>
              <p className="text-secondary small mb-0">
                Use the Test Errors sandbox to trigger controlled 404, 422, 500, and fatal server exceptions to verify Winston file writing in real-time.
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer border-top border-secondary px-4 py-3 bg-navy">
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
              Close Guide
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DocModal;
