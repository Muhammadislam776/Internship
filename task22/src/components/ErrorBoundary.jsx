import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('HyperList ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#090D16',
          color: '#F8FAFC',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem'
        }}>
          <div style={{
            background: '#0E1424',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '550px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#F43F5E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Application Render Exception
            </h2>

            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {this.state.error?.toString() || 'An unexpected rendering error occurred.'}
            </p>

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                padding: '0.75rem 1.6rem',
                borderRadius: '8px',
                background: '#6366F1',
                color: 'white',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <RefreshCw size={16} /> Reload Performance Lab
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
