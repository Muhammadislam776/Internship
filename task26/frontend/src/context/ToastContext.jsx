import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', title = '', statusCode = null) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, title, statusCode }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast show toast-custom mb-2 animate__animated animate__fadeInRight`}
            role="alert"
          >
            <div className="toast-header bg-dark text-white border-bottom border-secondary d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                {toast.type === 'error' && <i className="bi bi-exclamation-triangle-fill text-danger"></i>}
                {toast.type === 'warning' && <i className="bi bi-exclamation-circle-fill text-warning"></i>}
                {toast.type === 'success' && <i className="bi bi-check-circle-fill text-success"></i>}
                {toast.type === 'info' && <i className="bi bi-info-circle-fill text-info"></i>}
                <strong className="me-auto text-light">
                  {toast.title || (toast.type === 'error' ? 'API Exception Caught' : 'Notification')}
                </strong>
                {toast.statusCode && (
                  <span className={`badge bg-${toast.statusCode >= 500 ? 'danger' : 'warning'}`}>
                    {toast.statusCode}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                onClick={() => removeToast(toast.id)}
              ></button>
            </div>
            <div className="toast-body text-light font-mono small">
              {toast.message}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
