import React, { useState, useEffect } from 'react';
import { MonitoringService } from '../services/api';

const WinstonLogs = () => {
  const [selectedFile, setSelectedFile] = useState('combined.log');
  const [logData, setLogData] = useState(null);

  useEffect(() => {
    MonitoringService.getRawLogs({ file: selectedFile }).then(setLogData).catch(console.error);
  }, [selectedFile]);

  return (
    <div className="p-4">
      {/* Title */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="fw-bold text-white mb-1" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>Winston Logs</h1>
          <p className="text-secondary mb-0">Raw file inspector for physical Winston log transports inside backend/logs/</p>
        </div>

        <a href={MonitoringService.getDownloadUrl(selectedFile)} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm px-3 font-mono">
          Download {selectedFile}
        </a>
      </div>

      {/* Selector */}
      <div className="card-devpulse p-3 mb-4">
        <div className="btn-group bg-dark p-1 rounded border border-secondary">
          {['combined.log', 'error.log', 'exceptions.log', 'rejections.log'].map(file => (
            <button
              key={file}
              className={`btn btn-sm ${selectedFile === file ? 'btn-primary fw-bold' : 'btn-dark text-secondary border-0'}`}
              onClick={() => setSelectedFile(file)}
            >
              {file}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal View */}
      <div className="terminal-box">
        <div className="terminal-header">
          <div className="d-flex align-items-center gap-2">
            <div className="terminal-dots">
              <span className="terminal-dot"></span>
              <span className="terminal-dot"></span>
              <span className="terminal-dot"></span>
            </div>
            <span className="text-secondary font-mono small">{selectedFile} ({logData?.linesCount || 0} lines)</span>
          </div>
        </div>

        <div className="terminal-body" style={{ maxHeight: 500 }}>
          {logData?.content ? (
            logData.content.split('\n').map((line, idx) => (
              <div key={idx} className="font-mono text-break mb-1" style={{ fontSize: '0.8rem' }}>
                {line.includes('"level":"error"') ? (
                  <span className="text-danger">{line}</span>
                ) : line.includes('"level":"warn"') ? (
                  <span className="text-warning">{line}</span>
                ) : (
                  <span className="text-info">{line}</span>
                )}
              </div>
            ))
          ) : (
            <div className="text-secondary font-mono">Log file is empty.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinstonLogs;
