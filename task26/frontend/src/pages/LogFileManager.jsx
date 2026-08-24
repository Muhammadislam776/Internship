import React, { useState, useEffect } from 'react';
import { MonitoringService } from '../services/api';
import { useToast } from '../context/ToastContext';

const LogFileManager = () => {
  const [selectedFile, setSelectedFile] = useState('combined.log');
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  const fetchRawLogs = async () => {
    try {
      setLoading(true);
      const res = await MonitoringService.getRawLogs({ file: selectedFile });
      if (res.success) {
        setLogData(res);
      }
    } catch (err) {
      addToast(`Failed to load ${selectedFile}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRawLogs();
  }, [selectedFile]);

  const handleCopyLogs = () => {
    if (logData?.content) {
      navigator.clipboard.writeText(logData.content);
      addToast('Copied raw log contents to clipboard', 'success');
    }
  };

  const handleDownload = () => {
    window.open(MonitoringService.getDownloadUrl(selectedFile), '_blank');
  };

  // Filter raw text lines
  const lines = logData?.content ? logData.content.split('\n') : [];
  const filteredLines = search
    ? lines.filter(l => l.toLowerCase().includes(search.toLowerCase()))
    : lines;

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">Log File Manager & File Inspector</h2>
          <p className="text-secondary small mb-0">
            Read physical Winston log files line-by-line directly from <code className="text-info">backend/logs/</code>
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-sm btn-outline-info" onClick={handleCopyLogs} disabled={!logData?.content}>
            <i className="bi bi-clipboard me-1"></i> Copy Raw
          </button>
          <button className="btn btn-sm btn-primary" onClick={handleDownload}>
            <i className="bi bi-download me-1"></i> Download {selectedFile}
          </button>
        </div>
      </div>

      {/* File Selector Tabs & Search */}
      <div className="card card-dark p-3 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          
          {/* File Selector Buttons */}
          <div className="btn-group bg-dark p-1 border border-secondary rounded-3">
            {['combined.log', 'error.log', 'exceptions.log', 'rejections.log'].map(file => (
              <button
                key={file}
                className={`btn btn-sm ${selectedFile === file ? 'btn-primary fw-semibold' : 'btn-outline-dark text-secondary border-0'}`}
                onClick={() => setSelectedFile(file)}
              >
                <i className="bi bi-file-earmark-text me-1"></i>
                {file}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="input-group input-group-sm" style={{ width: '250px' }}>
            <span className="input-group-text bg-dark border-secondary text-secondary">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-dark border-secondary text-light"
              placeholder="Search in log lines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* File Specs Summary */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <div className="p-3 bg-dark border border-secondary rounded-3">
            <span className="text-secondary small text-uppercase font-mono">Active Target File</span>
            <div className="fw-bold text-cyan font-mono fs-5">{selectedFile}</div>
          </div>
        </div>

        <div className="col-12 col-sm-4">
          <div className="p-3 bg-dark border border-secondary rounded-3">
            <span className="text-secondary small text-uppercase font-mono">File Size</span>
            <div className="fw-bold text-white font-mono fs-5">
              {logData?.sizeBytes ? `${(logData.sizeBytes / 1024).toFixed(2)} KB` : '0 KB'}
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-4">
          <div className="p-3 bg-dark border border-secondary rounded-3">
            <span className="text-secondary small text-uppercase font-mono">Total Recorded Lines</span>
            <div className="fw-bold text-success font-mono fs-5">
              {logData?.linesCount || 0} lines
            </div>
          </div>
        </div>
      </div>

      {/* Raw Code View */}
      <div className="card card-dark p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-semibold text-white mb-0">
            <i className="bi bi-terminal-fill text-info me-2"></i> Raw File Output Viewer
          </h5>
          <span className="text-secondary font-mono small">
            Showing {filteredLines.length} lines
          </span>
        </div>

        {loading ? (
          <div className="text-center py-5 text-secondary">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
            Reading {selectedFile}...
          </div>
        ) : filteredLines.length === 0 ? (
          <div className="p-4 bg-dark border border-secondary rounded-3 text-center text-secondary font-mono">
            Log file is empty or no lines match search filter.
          </div>
        ) : (
          <div className="stack-trace-block bg-dark border border-secondary text-light p-3 rounded-3" style={{ maxHeight: '500px' }}>
            {filteredLines.map((line, i) => (
              <div key={i} className="py-1 border-bottom border-dark font-mono text-break" style={{ fontSize: '0.8rem' }}>
                <span className="text-secondary me-3 user-select-none">{(i + 1).toString().padStart(3, '0')}</span>
                <span className={line.includes('"level":"error"') ? 'text-danger' : line.includes('"level":"warn"') ? 'text-warning' : 'text-info'}>
                  {line}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogFileManager;
