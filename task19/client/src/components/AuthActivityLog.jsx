import React from 'react';
import { CheckCircle2, AlertTriangle, LogOut, ShieldAlert, Activity, Clock } from 'lucide-react';

export const AuthActivityLog = ({ activities = [] }) => {
  const defaultActivities = [
    { id: 1, type: 'success', title: 'Successful Login', detail: 'JWT generated and issued to client', time: 'Just now' },
    { id: 2, type: 'success', title: 'JWT Verified', detail: 'authMiddleware validated Bearer token signature', time: '1 min ago' },
    { id: 3, type: 'warning', title: 'Invalid Token Attempt', detail: 'Rejected unauthorized request to /api/auth/me (401)', time: '5 mins ago' },
    { id: 4, type: 'success', title: 'Protected API Access', detail: 'GET /api/users/profile returned HTTP 200 OK', time: '12 mins ago' },
    { id: 5, type: 'info', title: 'User Logged Out', detail: 'Session token invalidated and cleared from local storage', time: '25 mins ago' }
  ];

  const logsToDisplay = activities.length > 0 ? activities : defaultActivities;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 style={{ width: '16px', height: '16px', color: '#22C55E' }} />;
      case 'warning':
        return <AlertTriangle style={{ width: '16px', height: '16px', color: '#F59E0B' }} />;
      case 'error':
        return <ShieldAlert style={{ width: '16px', height: '16px', color: '#EF4444' }} />;
      default:
        return <LogOut style={{ width: '16px', height: '16px', color: '#2563EB' }} />;
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'success':
        return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', border: 'rgba(34, 197, 94, 0.3)' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' };
      case 'error':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', border: 'rgba(37, 99, 235, 0.3)' };
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '1.25rem',
      padding: '2rem',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--color-border)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'rgba(37, 99, 235, 0.1)',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            color: '#2563EB'
          }}>
            <Activity style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#071A2B' }}>Authentication Activity Log</h3>
            <p style={{ color: '#64748B', fontSize: '0.8rem' }}>Real-time middleware & audit event stream</p>
          </div>
        </div>

        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', background: '#F1F5F9', padding: '0.25rem 0.6rem', borderRadius: '0.3rem' }}>
          LIVE FEED
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {logsToDisplay.map((log) => {
          const style = getBadgeStyle(log.type || (log.status === '200 OK' ? 'success' : 'warning'));
          return (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: '0.65rem',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  padding: '0.4rem',
                  borderRadius: '0.4rem',
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getIcon(log.type || (log.status === '200 OK' ? 'success' : 'warning'))}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#071A2B' }}>
                    {log.title || log.event}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    {log.detail || `IP: ${log.ip || '127.0.0.1'} • Status: ${log.status}`}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94A3B8', fontSize: '0.75rem' }}>
                <Clock style={{ width: '12px', height: '12px' }} />
                <span>{log.time || new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
