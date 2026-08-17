import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ShareVault App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#071A2B',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.8rem', color: '#FF7A18', marginBottom: '1rem' }}>
            Oops! Something went wrong loading ShareVault.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '500px', marginBottom: '1.5rem' }}>
            {this.state.error?.message || 'An unexpected error occurred during rendering.'}
          </p>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: '0.8rem 1.6rem',
              borderRadius: '8px',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Clear Cache & Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
