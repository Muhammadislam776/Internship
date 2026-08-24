import React, { useState, useEffect } from 'react';
import { TestErrorService, MonitoringService } from '../services/api';
import { useToast } from '../context/ToastContext';

const TestErrors = () => {
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const fetchTerminalLogs = async () => {
    try {
      const res = await MonitoringService.getRawLogs({ file: 'combined.log' });
      if (res.success && res.content) {
        setTerminalLogs(res.content.split('\n'));
      }
    } catch (err) {
      console.error('Failed to load terminal logs:', err);
    }
  };

  useEffect(() => {
    fetchTerminalLogs();
  }, []);

  const handleTrigger = async (name, apiCall, defaultStatusCode) => {
    setLoading(true);
    try {
      await apiCall();
      addToast(`Action ${name} executed`, 'info');
    } catch (errPayload) {
      addToast(
        errPayload.message || `${name} captured`,
        'error',
        `${errPayload.statusCode || defaultStatusCode} Error Captured`,
        errPayload.statusCode || defaultStatusCode
      );
    } finally {
      setLoading(false);
      setTimeout(fetchTerminalLogs, 500);
    }
  };

  const handleClearTerminal = async () => {
    await MonitoringService.clearLogs();
    setTerminalLogs([]);
    addToast('Terminal logs cleared', 'success');
  };

  return (
    <div className="p-4">
      {/* Title */}
      <div className="mb-4">
        <h1 className="fw-bold text-white mb-1" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>Test Error Handling</h1>
        <p className="text-secondary mb-0">
          Trigger controlled errors and verify that DevPulse captures and logs them effectively within your environment.
        </p>
      </div>

      {/* Grid of 4 Cards */}
      <div className="row g-3 mb-4">
        
        {/* 404 Not Found */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card-devpulse h-100 d-flex flex-column justify-content-between p-4">
            <div>
              <div className="p-3 bg-cyan bg-opacity-10 text-cyan rounded-3 d-inline-block mb-3">
                <i className="bi bi-search-heart fs-4"></i>
              </div>
              <h4 className="fw-bold text-white mb-2">404 Not Found</h4>
              <p className="text-secondary small mb-3">
                Simulate a request to a non-existent endpoint. Validates routing fallbacks.
              </p>
            </div>

            <button
              className="btn btn-outline-info text-cyan w-100 py-2 font-mono small fw-semibold d-flex align-items-center justify-content-center gap-2"
              onClick={() => handleTrigger('404 Not Found', TestErrorService.trigger404Error, 404)}
              disabled={loading}
            >
              <i className="bi bi-lightning-charge"></i> TRIGGER 404
            </button>
          </div>
        </div>

        {/* Validation Error */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card-devpulse h-100 d-flex flex-column justify-content-between p-4">
            <div>
              <div className="p-3 bg-purple bg-opacity-10 text-purple rounded-3 d-inline-block mb-3">
                <i className="bi bi-card-checklist fs-4"></i>
              </div>
              <h4 className="fw-bold text-white mb-2">Validation Error</h4>
              <p className="text-secondary small mb-3">
                Submit malformed payload structure to test schema validation middleware.
              </p>
            </div>

            <button
              className="btn btn-outline-info text-cyan w-100 py-2 font-mono small fw-semibold d-flex align-items-center justify-content-center gap-2"
              onClick={() => handleTrigger('Validation Error', TestErrorService.triggerValidationError, 422)}
              disabled={loading}
            >
              <i className="bi bi-lightning-charge"></i> TRIGGER 400
            </button>
          </div>
        </div>

        {/* 500 Server Error */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card-devpulse h-100 d-flex flex-column justify-content-between p-4">
            <div>
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3 d-inline-block mb-3">
                <i className="bi bi-[#F59E0B] bi-hdd-stack fs-4"></i>
              </div>
              <h4 className="fw-bold text-white mb-2">500 Server Error</h4>
              <p className="text-secondary small mb-3">
                Force a controlled exception in the backend to test stack trace capturing.
              </p>
            </div>

            <button
              className="btn btn-outline-info text-cyan w-100 py-2 font-mono small fw-semibold d-flex align-items-center justify-content-center gap-2"
              onClick={() => handleTrigger('500 Error', TestErrorService.trigger500Error, 500)}
              disabled={loading}
            >
              <i className="bi bi-lightning-charge"></i> TRIGGER 500
            </button>
          </div>
        </div>

        {/* Unexpected Error */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card-devpulse h-100 d-flex flex-column justify-content-between p-4">
            <div>
              <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-3 d-inline-block mb-3">
                <i className="bi bi-exclamation-triangle fs-4"></i>
              </div>
              <h4 className="fw-bold text-white mb-2">Unexpected Error</h4>
              <p className="text-secondary small mb-3">
                Simulate an uncaught promise rejection or out-of-memory scenario.
              </p>
            </div>

            <button
              className="btn btn-primary text-white w-100 py-2 font-mono small fw-semibold d-flex align-items-center justify-content-center gap-2"
              onClick={() => handleTrigger('Fatal Server Exception', TestErrorService.triggerServerError, 500)}
              disabled={loading}
            >
              <i className="bi bi-exclamation-triangle-fill"></i> TRIGGER FATAL
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Live Terminal Console (Image 3) */}
      <div className="terminal-box">
        <div className="terminal-header">
          <div className="d-flex align-items-center gap-3">
            <div className="terminal-dots">
              <span className="terminal-dot"></span>
              <span className="terminal-dot"></span>
              <span className="terminal-dot"></span>
            </div>
            <span className="text-secondary font-mono small">devpulse-logger ~ live</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-dark text-secondary border border-secondary font-mono" onClick={handleClearTerminal}>
              <i className="bi bi-trash me-1"></i> Clear Logs
            </button>
            <button className="btn btn-sm btn-dark text-secondary border border-secondary font-mono" onClick={fetchTerminalLogs}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>
        </div>

        <div className="terminal-body">
          {terminalLogs.length === 0 ? (
            <div className="text-secondary italic">
              2026-08-24T12:00:00.000Z <span className="text-info">[INFO]</span> SysInit: DevPulse agent connected successfully. Listening on port 5000.
            </div>
          ) : (
            terminalLogs.map((line, idx) => (
              <div key={idx} className="font-mono text-break mb-1">
                {line.includes('"level":"error"') ? (
                  <span className="text-danger">{line}</span>
                ) : line.includes('"level":"warn"') ? (
                  <span className="text-warning">{line}</span>
                ) : (
                  <span className="text-light"><span className="text-info">[INFO]</span> {line}</span>
                )}
              </div>
            ))
          )}
          <div className="text-secondary">-</div>
        </div>
      </div>
    </div>
  );
};

export default TestErrors;
