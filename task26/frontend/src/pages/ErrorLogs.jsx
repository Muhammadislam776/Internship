import React, { useState, useEffect } from 'react';
import { MonitoringService } from '../services/api';
import { StatusBadge, MethodBadge, LevelBadge } from '../components/StatusBadge';
import ErrorModal from '../components/ErrorModal';
import { useToast } from '../context/ToastContext';

const ErrorLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToast();

  const fetchErrorLogs = async () => {
    try {
      setLoading(true);
      const res = await MonitoringService.getErrorLogs({ page, limit: 15 });
      if (res.success) {
        setLogs(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      }
    } catch (err) {
      addToast('Failed to fetch error log feed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorLogs();
  }, [page]);

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="fw-bold text-white mb-0">Error Intelligence Feed</h2>
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle font-mono small">
              CRITICAL LOGS
            </span>
          </div>
          <p className="text-secondary small mb-0">
            Dedicated view of caught exceptions & operational failures from <code className="text-danger">backend/logs/error.log</code>
          </p>
        </div>

        <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2" onClick={fetchErrorLogs}>
          <i className="bi bi-arrow-clockwise"></i>
          <span>Refresh Errors</span>
        </button>
      </div>

      {/* Warning Box */}
      <div className="alert bg-danger-subtle text-danger border border-danger-subtle p-3 rounded-3 mb-4 d-flex align-items-center gap-3">
        <i className="bi bi-shield-exclamation fs-3"></i>
        <div>
          <strong className="d-block text-white">Winston Global Error Handler Active</strong>
          <span className="small text-danger-subtle">
            All 4xx and 5xx responses automatically log request method, path, timestamp, status code, and stack traces to disk.
          </span>
        </div>
      </div>

      {/* Error Logs Table */}
      <div className="card card-dark p-3">
        <div className="table-responsive">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th>Level</th>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Error Message</th>
                <th>Timestamp</th>
                <th className="text-end">Stack Trace</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-secondary">
                    <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                    Parsing error.log file...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-secondary font-mono">
                    🎉 No error logs found! Backend system is running cleanly without exceptions.
                  </td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr key={log.id || idx} onClick={() => setSelectedLog(log)}>
                    <td><LevelBadge level={log.level} /></td>
                    <td><MethodBadge method={log.method} /></td>
                    <td className="font-mono text-cyan">{log.url}</td>
                    <td><StatusBadge statusCode={log.statusCode} /></td>
                    <td className="text-light fw-medium">{log.message}</td>
                    <td className="font-mono text-secondary small">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-danger py-0 px-2 font-mono">
                        <i className="bi bi-code-square me-1"></i> View Trace
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="text-secondary small font-mono">Page {page} of {totalPages}</span>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {selectedLog && (
        <ErrorModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};

export default ErrorLogs;
