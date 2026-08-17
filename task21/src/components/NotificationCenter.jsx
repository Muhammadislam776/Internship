import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationCenter({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className="toast-item"
          style={{
            borderLeftColor: toast.type === 'success' ? 'var(--emerald)' : toast.type === 'error' ? 'var(--red)' : 'var(--cyber-cyan)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {toast.type === 'success' && <CheckCircle2 size={18} color="var(--emerald)" />}
            {toast.type === 'error' && <AlertCircle size={18} color="var(--red)" />}
            {toast.type === 'info' && <Info size={18} color="var(--cyber-cyan)" />}
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{toast.message}</span>
          </div>

          <button 
            onClick={() => onDismiss(toast.id)}
            style={{ border: 'none', background: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
