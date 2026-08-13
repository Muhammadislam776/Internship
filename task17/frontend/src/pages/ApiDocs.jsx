import React, { useState } from 'react';
import { FileCode, Copy, Check, Terminal, ShieldCheck, Code, AlertTriangle } from 'lucide-react';

export default function ApiDocs() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const curlExample = `curl -X POST http://localhost:5000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Alex Vance",
    "email": "alex@example.com",
    "password": "Password@123",
    "confirmPassword": "Password@123",
    "age": 24,
    "phone": "+1-555-0192",
    "country": "United States",
    "role": "developer"
  }'`;

  const successResponse = `{
  "success": true,
  "message": "User data is valid",
  "user": {
    "id": "usr_7821",
    "name": "Alex Vance",
    "email": "alex@example.com",
    "role": "developer",
    "age": 24,
    "phone": "+1-555-0192",
    "country": "United States",
    "status": "Validated & Active",
    "createdAt": "2026-08-13T11:45:00.000Z"
  }
}`;

  const errorResponse = `{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email address format",
    "password": "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)",
    "confirmPassword": "Passwords do not match",
    "age": "User must be at least 18 years old"
  }
}`;

  const schemaFields = [
    { field: "name", type: "string", required: "Yes", rule: "min 2 chars, max 50 chars" },
    { field: "email", type: "string", required: "Yes", rule: "z.string().email() format" },
    { field: "password", type: "string", required: "Yes", rule: "min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char" },
    { field: "confirmPassword", type: "string", required: "Yes", rule: "Must match password field via z.refine()" },
    { field: "age", type: "number", required: "Yes", rule: "coerced integer, min 18, max 120" },
    { field: "phone", type: "string", required: "Yes", rule: "Regex format (e.g., +1-555-0192)" },
    { field: "country", type: "string", required: "Yes", rule: "min 2 chars string" },
    { field: "role", type: "enum", required: "No (Default: user)", rule: "One of: ['admin', 'developer', 'analyst', 'user']" }
  ];

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
          <FileCode size={14} /> OFFICIAL API SPECIFICATION
        </div>

        <h1 className="section-title">ShieldForm API Documentation</h1>
        <p className="section-subtitle">
          Complete endpoint documentation for Express.js request validation middleware powered by Zod.
        </p>
      </div>

      {/* Primary Endpoint Card */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ background: '#6366F1', color: '#fff', padding: '6px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '0.88rem' }}>
            POST
          </span>
          <span className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            /api/users
          </span>
          <span style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22C55E', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
            Zod Protected
          </span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
          Validates incoming registration payload against the Zod <code>userSchema</code>. If valid, passes sanitized data to controller. If invalid, returns HTTP 400 Bad Request.
        </p>

        {/* Schema Table */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px' }}>Request Body Schema Fields</h3>
        <div className="table-container" style={{ marginBottom: '32px' }}>
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Type</th>
                <th>Required</th>
                <th>Zod Validation Rule & Message</th>
              </tr>
            </thead>
            <tbody>
              {schemaFields.map((s, i) => (
                <tr key={i}>
                  <td className="font-mono" style={{ fontWeight: 700, color: '#22D3EE' }}>{s.field}</td>
                  <td className="font-mono" style={{ fontSize: '0.82rem' }}>{s.type}</td>
                  <td>
                    <span style={{ color: s.required.startsWith('Yes') ? '#EF4444' : '#64748B', fontWeight: 600 }}>
                      {s.required}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{s.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Example cURL Request */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#22D3EE', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={16} /> Example cURL Request
            </div>
            <button
              onClick={() => handleCopy(curlExample)}
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              {copied ? <Check size={14} color="#22C55E" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy cURL'}</span>
            </button>
          </div>
          <pre style={{ background: '#07111F', color: '#22D3EE', padding: '16px', borderRadius: '12px', fontSize: '0.82rem', fontFamily: 'JetBrains Mono', overflowX: 'auto' }}>
            {curlExample}
          </pre>
        </div>

        {/* Responses Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Success 200 */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#22C55E', marginBottom: '8px' }}>
              ✓ HTTP 200 / 201 Success Response
            </div>
            <pre style={{ background: '#07111F', color: '#22C55E', padding: '16px', borderRadius: '12px', fontSize: '0.8rem', fontFamily: 'JetBrains Mono', overflowX: 'auto' }}>
              {successResponse}
            </pre>
          </div>

          {/* Error 400 */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#EF4444', marginBottom: '8px' }}>
              ✕ HTTP 400 Validation Failure Response
            </div>
            <pre style={{ background: '#07111F', color: '#FB7185', padding: '16px', borderRadius: '12px', fontSize: '0.8rem', fontFamily: 'JetBrains Mono', overflowX: 'auto' }}>
              {errorResponse}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
