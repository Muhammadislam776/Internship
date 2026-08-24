import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ toasts = [], onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container-custom" data-testid="toast-container">
      {toasts.map((t) => {
        const isError = t.type === 'error';
        const isSuccess = t.type === 'success' || !t.type;

        return (
          <div 
            key={t.id} 
            className={`toast-custom ${isError ? 'border-danger-subtle' : 'border-primary-subtle'}`}
            data-testid="toast-message"
          >
            {isError ? (
              <FiAlertCircle className="text-danger flex-shrink-0" size={20} />
            ) : (
              <FiCheckCircle className="text-success flex-shrink-0" size={20} />
            )}
            
            <div className="fs-7 me-auto">{t.message}</div>

            <button 
              onClick={() => onDismiss(t.id)} 
              className="btn btn-sm btn-link text-muted p-0 ms-2"
              aria-label="Dismiss toast"
            >
              <FiX size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
