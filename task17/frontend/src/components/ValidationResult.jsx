import React from 'react';
import { CheckCircle2, XCircle, Clock, ShieldAlert, Cpu, Code2, ArrowRight } from 'lucide-react';

export default function ValidationResult({ resultData }) {
  if (!resultData) return null;

  const { result, status, durationMs, submittedPayload } = resultData;
  const isSuccess = status === 200 || status === 201;

  return (
    <div 
      className="glass-card" 
      style={{
        padding: '28px',
        marginTop: '24px',
        border: `2px solid ${isSuccess ? '#22C55E' : '#EF4444'}`,
        boxShadow: isSuccess 
          ? '0 10px 30px rgba(34, 197, 94, 0.25)' 
          : '0 10px 30px rgba(239, 68, 68, 0.25)',
        animation: 'scaleUp 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        {/* Status Outcome Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isSuccess ? (
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#22C55E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={28} />
            </div>
          ) : (
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <XCircle size={28} />
            </div>
          )}

          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: isSuccess ? '#22C55E' : '#EF4444' }}>
              {isSuccess ? '✓ Request Valid' : '✕ Request Rejected'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isSuccess 
                ? 'Passed Zod userSchema validation. Handled by User Controller.' 
                : 'Intercepted by validateUser middleware. Returned 400 Bad Request.'}
            </p>
          </div>
        </div>

        {/* Execution Metrics */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            background: 'rgba(7, 17, 31, 0.6)',
            color: '#F1F5F9',
            padding: '8px 14px',
            borderRadius: '12px',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Code2 size={16} color="#22D3EE" />
            <span>HTTP Status: <strong style={{ color: isSuccess ? '#22C55E' : '#EF4444' }}>{status}</strong></span>
          </div>

          <div style={{
            background: 'rgba(7, 17, 31, 0.6)',
            color: '#F1F5F9',
            padding: '8px 14px',
            borderRadius: '12px',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Clock size={16} color="#FF7A18" />
            <span>Response Time: <strong>{durationMs}ms</strong></span>
          </div>
        </div>
      </div>

      {/* Field Errors Breakdown (If Invalid) */}
      {!isSuccess && result.errors && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#EF4444', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} />
            <span>Structured Zod Field Validation Failures ({Object.keys(result.errors).length} Fields)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {Object.entries(result.errors).map(([field, errorMsg]) => (
              <div 
                key={field}
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  borderLeft: '4px solid #EF4444'
                }}
              >
                <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.72rem', color: '#EF4444' }}>
                  Field: {field}
                </div>
                <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>
                  {errorMsg}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Server JSON Response Body Inspection */}
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          API Response Payload JSON:
        </div>
        <pre style={{
          background: '#07111F',
          color: isSuccess ? '#22C55E' : '#FB7185',
          padding: '16px',
          borderRadius: '14px',
          fontSize: '0.84rem',
          fontFamily: 'JetBrains Mono, monospace',
          overflowX: 'auto'
        }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  );
}
