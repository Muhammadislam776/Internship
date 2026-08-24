import React, { useState, useEffect } from 'react';
import { MonitoringService } from '../services/api';
import RightDrawer from '../components/RightDrawer';

const RequestLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');
  const [method, setMethod] = useState('all');
  const [status, setStatus] = useState('all');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await MonitoringService.getLogs({
        limit: 50,
        search,
        level,
        method,
        status
      });

      if (res.success) {
        setLogs(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch request logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [level, method, status]);

  const handleExportCSV = () => {
    if (!logs.length) return;
    const headers = ['Timestamp', 'Level', 'Method', 'Endpoint', 'StatusCode', 'ResponseTime', 'IP'];
    const csvRows = logs.map(l => [
      l.timestamp, l.level, l.method, l.url, l.statusCode, l.responseTime, l.ip
    ].join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'devpulse_request_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      {/* Title & Action */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="fw-bold text-white mb-1" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>Request Logs</h1>
          <p className="text-secondary mb-0">Explore and analyze API traffic.</p>
        </div>

        <button className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold" onClick={handleExportCSV}>
          <i className="bi bi-download"></i>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="card-devpulse p-0">
        
        {/* Filter Controls Row */}
        <div className="p-3 border-bottom border-secondary">
          <div className="row g-2 align-items-center">
            
            {/* Filter Input */}
            <div className="col-12 col-md-4">
              <div className="position-relative">
                <i className="bi bi-funnel text-secondary position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                <input
                  type="text"
                  className="form-input-dark ps-5"
                  placeholder="Filter endpoint or IP..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
                />
              </div>
            </div>

            {/* Level Filter */}
            <div className="col-6 col-md-2">
              <select
                className="form-select-dark"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="info">INFO</option>
                <option value="warn">WARN</option>
                <option value="error">ERROR</option>
              </select>
            </div>

            {/* Method Filter */}
            <div className="col-6 col-md-2">
              <select
                className="form-select-dark"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="all">Method</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-6 col-md-2">
              <select
                className="form-select-dark"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">Status</option>
                <option value="success">2xx OK</option>
                <option value="error">Errors (4xx/5xx)</option>
              </select>
            </div>

            <div className="col-6 col-md-2 text-end text-secondary small font-mono">
              Showing 1-50 of {logs.length} logs
            </div>

          </div>
        </div>

        {/* Logs Table */}
        <div className="table-responsive">
          <table className="table-devpulse mb-0">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Level</th>
                <th>Method</th>
                <th>Endpoint</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-secondary">
                    Loading request logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-secondary font-mono">
                    No log records match filter criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr key={log.id || idx} onClick={() => setSelectedLog(log)}>
                    <td className="font-mono text-secondary small" style={{ width: '220px' }}>
                      {log.timestamp.replace('T', ' ').substring(0, 23)}
                    </td>
                    <td style={{ width: '100px' }}>
                      <span className={`badge-devpulse badge-level-${(log.level || 'INFO').toUpperCase()}`}>
                        {(log.level || 'INFO').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ width: '100px' }}>
                      <span className={`badge-method badge-method-${log.method || 'GET'}`}>
                        {log.method || 'GET'}
                      </span>
                    </td>
                    <td className="font-mono text-cyan">
                      {log.url || '/api/v1/users/profile'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Right Drawer Slide-over Inspector */}
      {selectedLog && (
        <RightDrawer
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};

export default RequestLogs;
