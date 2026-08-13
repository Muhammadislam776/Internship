import React from 'react';
import { ShieldCheck, Cpu, CheckCircle2, Lock, Server } from 'lucide-react';

export default function SecurityStatus() {
  const items = [
    { label: "API Status", status: "Online", color: "#22C55E", icon: Server },
    { label: "Validation Engine", status: "Active (Zod v3)", color: "#22D3EE", icon: Cpu },
    { label: "Schema Status", status: "Valid & Enforced", color: "#6366F1", icon: CheckCircle2 },
    { label: "Middleware", status: "Protected (validateUser)", color: "#FF7A18", icon: Lock }
  ];

  return (
    <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <ShieldCheck size={22} color="#22D3EE" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Platform Security & Middleware Status</h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              style={{
                background: 'rgba(7, 17, 31, 0.5)',
                border: `1px solid ${item.color}30`,
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#F1F5F9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} color={item.color} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: item.color }}>{item.status}</div>
                </div>
              </div>

              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: item.color,
                boxShadow: `0 0 12px ${item.color}`,
                animation: 'pulseDot 2s infinite'
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
