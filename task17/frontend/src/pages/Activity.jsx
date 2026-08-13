import React, { useState, useEffect } from 'react';
import ValidationLogs from '../components/ValidationLogs';
import StatsCards from '../components/StatsCards';
import { fetchLogs, fetchStats, clearLogs as apiClearLogs } from '../services/api';
import { Activity as ActivityIcon, ShieldCheck } from 'lucide-react';

export default function Activity() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);

  const loadData = async () => {
    const l = await fetchLogs();
    if (l.success) setLogs(l.logs);

    const s = await fetchStats();
    if (s.success) setStats(s.stats);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = async () => {
    await apiClearLogs();
    loadData();
  };

  return (
    <div>
      <div className="section-header">
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '20px',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#6366F1',
          marginBottom: '12px'
        }}>
          <ActivityIcon size={14} /> MIDDLEWARE AUDIT LOGS
        </div>

        <h1 className="section-title">Validation Activity & Metrics</h1>
        <p className="section-subtitle">
          Real-time tracking of every HTTP request evaluated by Zod <code>validateUser</code> middleware.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Validation Logs Component */}
      <ValidationLogs logs={logs} onClearLogs={handleClearLogs} />
    </div>
  );
}
