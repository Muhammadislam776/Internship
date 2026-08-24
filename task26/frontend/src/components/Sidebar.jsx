import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: '/', label: 'Overview', icon: 'bi-graph-up' },
    { path: '/dashboard', label: 'Dashboard', icon: 'bi-grid-fill' },
    { path: '/health', label: 'API Health', icon: 'bi-shield-check' },
    { path: '/request-logs', label: 'Request Logs', icon: 'bi-clock-history' },
    { path: '/error-intelligence', label: 'Error Intelligence', icon: 'bi-cpu' },
    { path: '/metrics', label: 'Metrics', icon: 'bi-bar-chart-fill' },
    { path: '/test-errors', label: 'Test Errors', icon: 'bi-flask' },
    { path: '/winston-logs', label: 'Winston Logs', icon: 'bi-file-earmark-code' },
    { path: '/settings', label: 'Settings', icon: 'bi-gear-fill' }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div className="sidebar-backdrop d-lg-none" onClick={onClose}></div>
      )}

      {/* Main Sidebar Element */}
      <aside className={`app-sidebar ${isOpen ? 'show' : ''}`}>
        <div>
          {/* Logo Section */}
          <div className="sidebar-logo justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div className="sidebar-logo-icon">
                <i className="bi bi-pulse"></i>
              </div>
              <div>
                <h5 className="fw-bold text-white mb-0" style={{ letterSpacing: '-0.02em' }}>DevPulse</h5>
                <div className="text-secondary" style={{ fontSize: '0.68rem', letterSpacing: '0.02em' }}>
                  Observability
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button className="btn-close btn-close-white d-lg-none" onClick={onClose}></button>
          </div>

          {/* Menu Navigation */}
          <nav className="sidebar-menu">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <i className={`bi ${item.icon} fs-6`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Section */}
        <div className="sidebar-footer">
          <div className="d-flex align-items-center gap-2 px-2 py-1">
            <span className="dot-status green"></span>
            <span className="text-secondary font-mono" style={{ fontSize: '0.72rem' }}>
              System Status : Live
            </span>
          </div>

          <a href="#support" className="sidebar-item py-2" onClick={(e) => e.preventDefault()}>
            <i className="bi bi-person-circle fs-6"></i>
            <span>Profile</span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
