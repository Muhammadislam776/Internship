import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, Sliders, RefreshCw, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { clearLogs } from '../services/api';

export default function Settings() {
  const [strictMode, setStrictMode] = useState(true);
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [minAge, setMinAge] = useState(18);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleResetData = async () => {
    await clearLogs();
    alert("Middleware logs & testbench state reset successfully!");
  };

  return (
    <div>
      <div className="section-header">
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          background: 'rgba(34, 211, 238, 0.12)',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          borderRadius: '20px',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#22D3EE',
          marginBottom: '12px'
        }}>
          <Sliders size={14} /> MIDDLEWARE CONFIGURATION
        </div>

        <h1 className="section-title">Zod Middleware Settings</h1>
        <p className="section-subtitle">
          Configure security policy rules, schema parsing behavior, and platform options.
        </p>
      </div>

      {savedMsg && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid #22C55E',
          color: '#22C55E',
          padding: '12px 18px',
          borderRadius: '12px',
          fontSize: '0.9rem',
          fontWeight: 700,
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} /> Zod Schema settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#6366F1" /> Security & Schema Parsing Policies
          </h3>

          {/* Strict Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Strict Object Validation (z.strict())</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Reject any payload containing unknown or unexpected JSON fields not specified in userSchema.
              </div>
            </div>
            <input
              type="checkbox"
              checked={strictMode}
              onChange={(e) => setStrictMode(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#6366F1', cursor: 'pointer' }}
            />
          </div>

          {/* Special Character Requirement */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Require Special Symbol in Password</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Enforce regex pattern matching for <code>@$!%*?&</code> symbols.
              </div>
            </div>
            <input
              type="checkbox"
              checked={requireSpecialChar}
              onChange={(e) => setRequireSpecialChar(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#22D3EE', cursor: 'pointer' }}
            />
          </div>

          {/* Password Min Length */}
          <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Minimum Password Length</span>
              <span className="font-mono" style={{ color: '#FF7A18', fontWeight: 700 }}>{passwordMinLength} Chars</span>
            </div>
            <input
              type="range"
              min="6"
              max="20"
              value={passwordMinLength}
              onChange={(e) => setPasswordMinLength(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#FF7A18' }}
            />
          </div>

          {/* Minimum Age Limit */}
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Minimum Required User Age</span>
              <span className="font-mono" style={{ color: '#22C55E', fontWeight: 700 }}>{minAge} Years Old</span>
            </div>
            <input
              type="range"
              min="13"
              max="21"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#22C55E' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <button
              type="button"
              onClick={handleResetData}
              className="btn-secondary"
              style={{ color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}
            >
              <RefreshCw size={16} /> Reset Demo Logs & Stats
            </button>

            <button type="submit" className="btn-primary">
              <CheckCircle2 size={16} /> Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
