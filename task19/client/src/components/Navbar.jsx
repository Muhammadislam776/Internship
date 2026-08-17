import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2, User, LogOut, Menu, X, Terminal, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activePage, setActivePage }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'security', label: 'Security' },
    { id: 'apiflow', label: 'API Flow' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'apidocs', label: 'API Docs' }
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="glass-panel-dark sticky top-0 z-50 transition-all duration-300 border-b border-cyan-500/20" style={{ background: '#071A2B' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #22D3EE 100%)',
            padding: '0.55rem',
            borderRadius: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(34, 211, 238, 0.4)'
          }}>
            <Shield style={{ width: '22px', height: '22px', color: '#ffffff' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>SecureGate</span>
              <span style={{ 
                fontSize: '0.65rem', 
                fontWeight: '700', 
                background: 'rgba(34, 211, 238, 0.15)', 
                color: '#22D3EE', 
                padding: '0.15rem 0.45rem', 
                borderRadius: '0.25rem',
                border: '1px solid rgba(34, 211, 238, 0.3)',
                letterSpacing: '0.05em'
              }}>
                JWT v1.0
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '-2px' }}>Secure Every Request</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activePage === item.id ? '#22D3EE' : '#94A3B8',
                fontWeight: activePage === item.id ? '700' : '500',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                padding: '0.5rem 0'
              }}
            >
              {item.label}
              {activePage === item.id && (
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '0',
                  right: '0',
                  height: '2px',
                  background: 'linear-gradient(90deg, #2563EB, #22D3EE)',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px #22D3EE'
                }} />
              )}
            </button>
          ))}
        </nav>

        {/* Auth Actions / Profile Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button 
                onClick={() => handleNavClick('dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '0.5rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  boxShadow: '0 0 8px #22C55E'
                }} />
                <span style={{ fontWeight: '600' }}>{user?.name?.split(' ')[0] || 'User'}</span>
              </button>

              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '0.5rem',
                  color: '#EF4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => handleNavClick('login')}
                className="btn btn-outline-cyan"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="btn btn-cta"
                style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button - visible ONLY on smaller screens */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'none' // Controlled by CSS media query in index.css
            }}
          >
            {mobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          style={{
            background: '#071A2B',
            borderTop: '1px solid rgba(34, 211, 238, 0.2)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: activePage === item.id ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                border: 'none',
                color: activePage === item.id ? '#22D3EE' : '#CBD5E1',
                padding: '0.75rem',
                borderRadius: '0.4rem',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
