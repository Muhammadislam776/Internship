import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ title, message, confirmText = "Delete", onConfirm, onClose, isDanger = true }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: isDanger ? 'var(--red)' : 'var(--vibrant-orange)' }}>
          <AlertTriangle size={24} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--midnight-navy)' }}>{title}</h3>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'rgba(7, 26, 43, 0.7)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className={`btn ${isDanger ? 'btn-danger' : 'btn-orange'}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
