import React, { useState, useEffect } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import ValidationResult from '../components/ValidationResult';
import ValidationLogs from '../components/ValidationLogs';
import { fetchLogs, validateAndRegisterUser, clearLogs as apiClearLogs } from '../services/api';
import { CheckCircle2, Code2, Send, ShieldAlert, Cpu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Validation() {
  const [lastValidationResult, setLastValidationResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [rawJsonInput, setRawJsonInput] = useState(`{
  "name": "Jane Doe",
  "email": "jane.doe@cybersec.io",
  "password": "Password@123",
  "confirmPassword": "Password@123",
  "age": 25,
  "phone": "+1-555-0199",
  "country": "United States",
  "role": "developer"
}`);
  const [rawLoading, setRawLoading] = useState(false);
  const [rawJsonError, setRawJsonError] = useState(null);

  const location = useLocation();

  const loadLogs = async () => {
    const res = await fetchLogs();
    if (res.success) setLogs(res.logs);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleValidationComplete = (data) => {
    setLastValidationResult(data);
    loadLogs();
  };

  const handleCustomJsonSubmit = async () => {
    setRawJsonError(null);
    let parsedObj;
    try {
      parsedObj = JSON.parse(rawJsonInput);
    } catch (err) {
      setRawJsonError("Invalid JSON syntax: " + err.message);
      return;
    }

    setRawLoading(true);
    const startTime = Date.now();
    const result = await validateAndRegisterUser(parsedObj);
    const duration = Date.now() - startTime;
    setRawLoading(false);

    setLastValidationResult({
      result: result.data,
      status: result.status,
      durationMs: duration,
      submittedPayload: parsedObj
    });
    loadLogs();
  };

  const handleClearLogs = async () => {
    await apiClearLogs();
    loadLogs();
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
          <Cpu size={14} /> LIVE MIDDLEWARE TEST BENCH
        </div>

        <h1 className="section-title">Validation Engine Testbench</h1>
        <p className="section-subtitle">
          Test live request payloads against Express.js <code>validateUser</code> middleware powered by Zod schema rules.
        </p>
      </div>

      {/* Main Registration Form */}
      <RegistrationForm onValidationComplete={handleValidationComplete} />

      {/* Live Validation Result Panel */}
      <ValidationResult resultData={lastValidationResult} />

      {/* Raw Custom JSON Payload Console */}
      <div className="glass-card" style={{ padding: '28px', marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Code2 size={22} color="#6366F1" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Raw Custom JSON Payload Tester</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Send arbitrary custom JSON requests to <code>POST /api/users</code> to test edge-cases, missing fields, or malformed data types.
            </p>
          </div>
        </div>

        {rawJsonError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid #EF4444',
            color: '#EF4444',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldAlert size={16} /> {rawJsonError}
          </div>
        )}

        <textarea
          value={rawJsonInput}
          onChange={(e) => setRawJsonInput(e.target.value)}
          rows={10}
          className="form-input font-mono"
          style={{
            width: '100%',
            background: '#07111F',
            color: '#22D3EE',
            padding: '16px',
            borderRadius: '14px',
            fontSize: '0.88rem',
            resize: 'vertical',
            marginBottom: '16px'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCustomJsonSubmit}
            disabled={rawLoading}
            className="btn-primary"
          >
            <Send size={16} />
            <span>{rawLoading ? 'Executing Request...' : 'Send Custom Payload to Middleware'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Activity Logs */}
      <div style={{ marginTop: '32px' }}>
        <ValidationLogs logs={logs} onClearLogs={handleClearLogs} />
      </div>
    </div>
  );
}
