import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SecurityStatus from '../components/SecurityStatus';
import FlipCard from '../components/FlipCard';
import DemoCard from '../components/DemoCard';
import DemoModal from '../components/DemoModal';
import InteractiveErrorCards from '../components/InteractiveErrorCards';
import StatsCards from '../components/StatsCards';
import ValidationLogs from '../components/ValidationLogs';
import { fetchStats, fetchLogs } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    const s = await fetchStats();
    if (s.success) setStats(s.stats);

    const l = await fetchLogs();
    if (l.success) setLogs(l.logs);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectPreset = (preset) => {
    navigate('/validation', { state: { preset } });
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero onOpenDemoModal={() => setIsDemoModalOpen(true)} />

      {/* Security Status Bar */}
      <SecurityStatus />

      {/* Analytics Dashboard Stats */}
      {stats && <StatsCards stats={stats} />}

      {/* 3D Flip Cards Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <FlipCard
          frontTitle="Valid Requests"
          frontValue={stats ? stats.validRequestsToday : "139"}
          backTitle="Success Rate"
          backValue={stats ? stats.validationRate : "98.7% Success"}
          type="success"
        />

        <FlipCard
          frontTitle="Rejected Requests"
          frontValue={stats ? stats.rejectedRequestsToday : "9"}
          backTitle="Top Intercepted Issue"
          backValue={stats ? `Most common: ${stats.mostCommonIssue}` : "Invalid Email"}
          type="error"
        />

        <DemoCard onOpenModal={() => setIsDemoModalOpen(true)} />
      </div>

      {/* Interactive Common Error Cases Grid */}
      <InteractiveErrorCards onSelectPreset={handleSelectPreset} />

      {/* Middleware Audit Logs Preview */}
      <ValidationLogs logs={logs.slice(0, 5)} />

      {/* Step by Step Demo Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
}
