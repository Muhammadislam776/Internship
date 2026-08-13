import React, { useState } from 'react';
import { Activity, Search, Filter, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function ValidationLogs({ logs = [], onClearLogs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'VALID' | 'REJECTED'

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.failedFields && log.failedFields.join(' ').toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#6366F1" />
            <span>Live Middleware Activity Audit Logs</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time audit log of every request intercepted by <code>validateUser</code> middleware.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div className="input-wrapper" style={{ width: '220px' }}>
            <Search className="input-icon" size={16} />
            <input
              type="text"
              placeholder="Search Request ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ padding: '8px 12px 8px 36px', fontSize: '0.82rem' }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
            style={{ width: '130px', padding: '8px 12px', fontSize: '0.82rem' }}
          >
            <option value="ALL">All Status</option>
            <option value="VALID">VALID (200)</option>
            <option value="REJECTED">REJECTED (400)</option>
          </select>

          {/* Clear Logs Button */}
          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.8rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              title="Clear activity log"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="cyber-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Endpoint</th>
              <th>Status</th>
              <th>Fields Evaluated / Errors</th>
              <th>Response Code</th>
              <th>Execution Time</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No validation logs found matching query.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono" style={{ fontWeight: 700, color: '#6366F1' }}>
                    {log.id}
                  </td>
                  <td className="font-mono" style={{ fontSize: '0.82rem' }}>
                    <strong>{log.method}</strong> {log.endpoint}
                  </td>
                  <td>
                    {log.status === 'VALID' ? (
                      <span className="badge-valid">
                        <CheckCircle2 size={12} /> VALID
                      </span>
                    ) : (
                      <span className="badge-rejected">
                        <XCircle size={12} /> REJECTED
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>
                    {log.status === 'VALID' ? (
                      <span style={{ color: '#22C55E' }}>All 8 fields passed</span>
                    ) : (
                      <span style={{ color: '#EF4444', fontWeight: 600 }}>
                        Failed: {log.failedFields && log.failedFields.length > 0 ? log.failedFields.join(', ') : 'Syntax Error'}
                      </span>
                    )}
                  </td>
                  <td className="font-mono" style={{ fontWeight: 700, color: log.statusCode === 200 ? '#22C55E' : '#EF4444' }}>
                    {log.statusCode}
                  </td>
                  <td className="font-mono" style={{ fontSize: '0.82rem' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {log.responseTimeMs}ms
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleTimeString()} - {new Date(log.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
