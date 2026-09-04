import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X, RefreshCw } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  const { message, type, onRetry } = toast;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-status-danger shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-status-warning shrink-0" />,
    info: <Info className="w-5 h-5 text-cyber shrink-0" />
  };

  const borders = {
    success: 'border-status-success/30 bg-midnight-card/90',
    error: 'border-status-danger/40 bg-midnight-card/90',
    warning: 'border-status-warning/40 bg-midnight-card/90',
    info: 'border-cyber/30 bg-midnight-card/90'
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-lg shadow-glass transition-all duration-300 animate-slide-up ${borders[type] || borders.info}`}
    >
      <div className="flex items-center gap-3">
        {icons[type] || icons.info}
        <span className="text-sm font-medium text-slate-100">{message}</span>
      </div>

      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1 bg-electric hover:bg-electric-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
