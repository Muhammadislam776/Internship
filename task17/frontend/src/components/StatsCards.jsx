import React from 'react';
import { Activity, CheckCircle2, XCircle, Percent, Zap, TrendingUp } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: "Requests Today",
      value: stats.totalRequestsToday || 0,
      subtext: "+12.4% vs yesterday",
      icon: Activity,
      color: "#6366F1",
      grad: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.02))"
    },
    {
      title: "Valid Requests",
      value: stats.validRequestsToday || 0,
      subtext: "Passed Zod middleware",
      icon: CheckCircle2,
      color: "#22C55E",
      grad: "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.02))"
    },
    {
      title: "Rejected Requests",
      value: stats.rejectedRequestsToday || 0,
      subtext: "Blocked by 400 Bad Request",
      icon: XCircle,
      color: "#EF4444",
      grad: "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.02))"
    },
    {
      title: "Validation Rate",
      value: stats.validationRate || "100%",
      subtext: "High data integrity",
      icon: Percent,
      color: "#22D3EE",
      grad: "linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(34, 211, 238, 0.02))"
    },
    {
      title: "Avg Response Time",
      value: stats.avgResponseTimeMs || "10ms",
      subtext: "Ultra-fast Zod safeParse",
      icon: Zap,
      color: "#FF7A18",
      grad: "linear-gradient(135deg, rgba(255, 122, 24, 0.15), rgba(255, 122, 24, 0.02))"
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    }}>
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="glass-card"
            style={{
              padding: '20px',
              background: c.grad,
              border: `1px solid ${c.color}30`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {c.title}
              </span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: `${c.color}20`,
                color: c.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} />
              </div>
            </div>

            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              {c.value}
            </div>

            <div style={{ fontSize: '0.78rem', color: c.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> {c.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
