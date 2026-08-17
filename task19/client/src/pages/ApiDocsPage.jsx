import React, { useState } from 'react';
import { Terminal, Shield, Key, Lock, CheckCircle2, Copy, Check, Code, Server } from 'lucide-react';

export const ApiDocsPage = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copySnippet = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const endpoints = [
    {
      id: 1,
      method: "POST",
      path: "/api/auth/register",
      access: "Public",
      title: "User Registration",
      description: "Registers a new user account with hashed password and generates an initial JWT.",
      requestBody: `{
  "name": "Alex Mercer",
  "email": "alex@securegate.dev",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}`,
      successResponse: `HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "Registration successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_1723891200_a8f9d0",
    "name": "Alex Mercer",
    "email": "alex@securegate.dev",
    "createdAt": "2026-08-17T12:00:00.000Z"
  }
}`
    },
    {
      id: 2,
      method: "POST",
      path: "/api/auth/login",
      access: "Public",
      title: "User Authentication & JWT Generation",
      description: "Authenticates email and password via salted bcrypt comparison and issues a 24-hour signed JWT.",
      requestBody: `{
  "email": "alex@securegate.dev",
  "password": "Password123!"
}`,
      successResponse: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Authentication successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl8xNzIzODkxMjAwX2E4ZjlkMCIsImVtYWlsIjoiYWxleEBzZWN1cmVnYXRlLmRldiIsImlhdCI6MTcyMzg5MTIwMCwiZXhwIjoxNzIzOTc3NjAwfQ.signature_hash",
  "user": {
    "id": "usr_1723891200_a8f9d0",
    "name": "Alex Mercer",
    "email": "alex@securegate.dev"
  }
}`
    },
    {
      id: 3,
      method: "GET",
      path: "/api/auth/me",
      access: "Protected (authMiddleware)",
      title: "Get Current Authenticated User",
      description: "Requires Authorization: Bearer <JWT> header. Intercepted by authMiddleware.",
      headers: `Authorization: Bearer eyJhbGciOiJIUzI1Ni...`,
      successResponse: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "user": {
    "id": "usr_1723891200_a8f9d0",
    "name": "Alex Mercer",
    "email": "alex@securegate.dev",
    "createdAt": "2026-08-17T12:00:00.000Z"
  }
}`,
      error401: `HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "message": "Authentication token is required." // or "Invalid authorization format." or "Invalid or expired token."
}`
    },
    {
      id: 4,
      method: "GET",
      path: "/api/users/profile",
      access: "Protected (authMiddleware)",
      title: "Get Full User Profile & Security Meta",
      description: "Protected profile endpoint returning role, token scheme, and verification timestamp.",
      headers: `Authorization: Bearer eyJhbGciOiJIUzI1Ni...`,
      successResponse: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "profile": {
    "id": "usr_1723891200_a8f9d0",
    "name": "Alex Mercer",
    "email": "alex@securegate.dev",
    "role": "Authenticated User",
    "tokenScheme": "Bearer",
    "securityVerifiedAt": "2026-08-17T12:30:00.000Z",
    "jwtVerified": true
  }
}`
    }
  ];

  return (
    <div style={{ padding: '3.5rem 0 5rem 0', background: '#F8FAFC' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(37, 99, 235, 0.1)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            padding: '0.35rem 0.85rem',
            borderRadius: '2rem',
            color: '#2563EB',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '0.75rem'
          }}>
            <Terminal style={{ width: '14px', height: '14px' }} />
            <span>EXPRESS REST API SPECIFICATION</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#071A2B', letterSpacing: '-0.02em' }}>
            API Documentation & Specification
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.5rem' }}>
            Complete guide to SecureGate API endpoints, Authorization Bearer scheme header rules, and HTTP status codes.
          </p>
        </div>

        {/* Middleware Authorization Header Rules Box */}
        <div style={{
          background: '#071A2B',
          borderRadius: '1.25rem',
          padding: '2rem',
          color: '#ffffff',
          marginBottom: '3rem',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Shield style={{ width: '24px', height: '24px', color: '#22D3EE' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Express authMiddleware Header Specification</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h4 style={{ color: '#22D3EE', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Required Header Format:
              </h4>
              <div style={{
                background: '#040d16',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: '#22C55E',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                Authorization: Bearer &lt;token&gt;
              </div>
            </div>

            <div>
              <h4 style={{ color: '#EF4444', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Rejected Header Formats (401 Unauthorized):
              </h4>
              <div style={{
                background: '#040d16',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#FCA5A5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem'
              }}>
                <div>❌ Authorization: &lt;token&gt;</div>
                <div>❌ Token &lt;token&gt;</div>
                <div>❌ Basic &lt;token&gt;</div>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoints List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {endpoints.map((ep, idx) => (
            <div
              key={ep.id}
              style={{
                background: '#ffffff',
                borderRadius: '1.25rem',
                padding: '2rem',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid #E2E8F0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    background: ep.method === 'POST' ? '#22C55E' : '#2563EB',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '0.4rem',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {ep.method}
                  </span>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#071A2B' }}>
                    {ep.path}
                  </span>
                </div>

                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: ep.access.includes('Protected') ? '#2563EB' : '#64748B',
                  background: ep.access.includes('Protected') ? 'rgba(37, 99, 235, 0.1)' : '#F1F5F9',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '1rem'
                }}>
                  {ep.access}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#071A2B', marginBottom: '0.35rem' }}>
                {ep.title}
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {ep.description}
              </p>

              {/* Code Snippets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {ep.requestBody && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B' }}>REQUEST BODY</span>
                      <button
                        onClick={() => copySnippet(ep.requestBody, idx * 2)}
                        style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '0.7rem' }}
                      >
                        {copiedIndex === idx * 2 ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre style={{
                      background: '#071A2B',
                      color: '#E2E8F0',
                      padding: '1rem',
                      borderRadius: '0.65rem',
                      fontSize: '0.8rem',
                      overflowX: 'auto'
                    }}>
                      {ep.requestBody}
                    </pre>
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#22C55E' }}>SUCCESS RESPONSE (200 / 201)</span>
                    <button
                      onClick={() => copySnippet(ep.successResponse, idx * 2 + 1)}
                      style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '0.7rem' }}
                    >
                      {copiedIndex === idx * 2 + 1 ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre style={{
                    background: '#071A2B',
                    color: '#86EFAC',
                    padding: '1rem',
                    borderRadius: '0.65rem',
                    fontSize: '0.8rem',
                    overflowX: 'auto'
                  }}>
                    {ep.successResponse}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
