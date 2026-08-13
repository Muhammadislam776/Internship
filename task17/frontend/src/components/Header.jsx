import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  Users, 
  FileCode, 
  Settings as SettingsIcon, 
  Bell, 
  User, 
  Sun, 
  Moon, 
  Menu, 
  X,
  PlayCircle
} from 'lucide-react';

export default function Header({ theme, toggleTheme }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: ShieldCheck },
    { name: 'Validation', path: '/validation', icon: CheckCircle2 },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'API Docs', path: '/docs', icon: FileCode },
    { name: 'Activity', path: '/activity', icon: Activity },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <header className="glass-header">
      {/* Logo */}
      <Link to="/" className="brand-logo">
        <div className="logo-shield-icon">
          <ShieldCheck size={24} />
        </div>
        <div>
          <span>Shield</span><span className="text-gradient-cyan">Form</span>
        </div>
      </Link>

      {/* Desktop Navigation - Full Nav on Desktop, No Hamburger */}
      <nav className="desktop-nav">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Side Header Actions */}
      <div className="header-actions">
        {/* API Status Badge */}
        <div className="api-status-badge">
          <span className="status-dot"></span>
          <span>API Online</span>
        </div>

        {/* Notification Icon */}
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            <span className="notification-indicator"></span>
          </button>

          {showNotifications && (
            <div className="glass-card-dark" style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              width: '280px',
              padding: '16px',
              zIndex: 200,
              fontSize: '0.85rem'
            }}>
              <div style={{ fontWeight: 700, marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Security Alerts</span>
                <span style={{ color: '#22D3EE', fontSize: '0.75rem' }}>Zod v3.23</span>
              </div>
              <div style={{ color: '#94A3B8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                ✓ Middleware active on <code>POST /api/users</code><br/>
                ✓ 100% Request sanitization enforced
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="icon-btn" title="Admin Profile">
          <User size={18} />
        </div>

        {/* Theme Toggle */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {theme === 'dark' ? <Sun size={18} color="#FF7A18" /> : <Moon size={18} color="#6366F1" />}
        </button>

        {/* Mobile Hamburger Toggle (Only on Tablet/Mobile) */}
        <button 
          className="icon-btn mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '76px',
          left: 0,
          right: 0,
          background: '#07111F',
          borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 99
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
