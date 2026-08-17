import React from 'react';
import { CheckCircle2, RefreshCw, AlertTriangle, Clock } from 'lucide-react';

export default function StatusBadge({ status }) {
  const normalized = (status || 'PENDING').toUpperCase();

  switch (normalized) {
    case 'SENT':
      return (
        <span className="badge-status badge-sent">
          <CheckCircle2 size={13} />
          SENT
        </span>
      );
    case 'PROCESSING':
      return (
        <span className="badge-status badge-processing animate-pulse-orange">
          <RefreshCw size={13} className="animate-spin" />
          PROCESSING
        </span>
      );
    case 'FAILED':
      return (
        <span className="badge-status badge-failed">
          <AlertTriangle size={13} />
          FAILED
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="badge-status badge-pending">
          <Clock size={13} />
          PENDING
        </span>
      );
  }
}
