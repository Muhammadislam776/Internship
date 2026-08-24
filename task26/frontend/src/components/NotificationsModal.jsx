import React, { useState } from 'react';

const NotificationsModal = ({ onClose, notifications, onClear }) => {
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter(n => {
    if (filter === 'error') return n.type === 'error';
    if (filter === 'warn') return n.type === 'warning';
    return true;
  });

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 1060 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-dark text-light border border-secondary shadow-lg rounded-4 overflow-hidden">
          
          {/* Header */}
          <div className="modal-header border-bottom border-secondary px-4 py-3 bg-navy d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 bg-warning bg-opacity-20 text-warning rounded-circle">
                <i className="bi bi-bell-fill fs-5"></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold text-white mb-0">System Incident Notifications</h5>
                <span className="text-secondary font-mono small">Real-time Winston & Express Exception Alerts</span>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Filter Pills Bar */}
          <div className="px-4 py-2 bg-black bg-opacity-40 border-bottom border-secondary d-flex align-items-center justify-content-between">
            <div className="btn-group bg-dark p-1 rounded border border-secondary">
              <button
                className={`btn btn-sm ${filter === 'all' ? 'btn-primary fw-bold' : 'btn-dark text-secondary border-0'}`}
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </button>
              <button
                className={`btn btn-sm ${filter === 'error' ? 'btn-danger fw-bold' : 'btn-dark text-secondary border-0'}`}
                onClick={() => setFilter('error')}
              >
                Critical Errors
              </button>
              <button
                className={`btn btn-sm ${filter === 'warn' ? 'btn-warning text-dark fw-bold' : 'btn-dark text-secondary border-0'}`}
                onClick={() => setFilter('warn')}
              >
                Warnings
              </button>
            </div>

            {notifications.length > 0 && (
              <button className="btn btn-sm btn-outline-danger font-mono" onClick={onClear}>
                <i className="bi bi-trash me-1"></i> Clear All
              </button>
            )}
          </div>

          {/* Body List */}
          <div className="modal-body p-4" style={{ maxHeight: 420, overflowY: 'auto' }}>
            <div className="d-flex flex-column gap-3">
              {filtered.length === 0 ? (
                <div className="text-center py-5 text-secondary font-mono">
                  🎉 No unread system notifications. All API endpoints operational.
                </div>
              ) : (
                filtered.map((n) => (
                  <div key={n.id} className={`p-3 rounded-3 border ${n.type === 'error' ? 'bg-danger bg-opacity-10 border-danger border-opacity-30' : 'bg-dark border-secondary'}`}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge ${n.type === 'error' ? 'bg-danger' : 'bg-warning text-dark'} font-mono`}>
                          {n.type.toUpperCase()}
                        </span>
                        <span className="fw-bold text-white fs-6">{n.title}</span>
                      </div>
                      <span className="text-secondary small font-mono">{n.time}</span>
                    </div>

                    <div className="font-mono text-secondary small mb-2">{n.message}</div>

                    <div className="d-flex justify-content-end">
                      <a href="/error-intelligence" className="text-cyan small font-mono text-decoration-none" onClick={onClose}>
                        Inspect in Error Intelligence →
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-top border-secondary px-4 py-3 bg-navy">
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
              Close Center
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
