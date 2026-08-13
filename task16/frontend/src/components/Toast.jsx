import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts, removeToast }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '420px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const { type, message, title } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 style={{ color: '#22C55E', flexShrink: 0 }} size={22} />;
      case 'error':
        return <AlertCircle style={{ color: '#EF4444', flexShrink: 0 }} size={22} />;
      default:
        return <Info style={{ color: '#22D3EE', flexShrink: 0 }} size={22} />;
    }
  };

  const getBorder = () => {
    switch (type) {
      case 'success': return '1px solid rgba(34, 197, 94, 0.4)';
      case 'error': return '1px solid rgba(239, 68, 68, 0.4)';
      default: return '1px solid rgba(34, 211, 238, 0.4)';
    }
  };

  return (
    <div style={{
      pointerEvents: 'auto',
      background: 'rgba(11, 37, 58, 0.95)',
      backdropFilter: 'blur(16px)',
      border: getBorder(),
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      boxShadow: '0 10px 30px rgba(7, 26, 43, 0.5)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.85rem',
      animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {getIcon()}
      <div style={{ flex: 1 }}>
        {title && <h5 style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.2rem' }}>{title}</h5>}
        <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: '1.4' }}>{message}</p>
      </div>
      <button 
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#64748B',
          padding: '2px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
