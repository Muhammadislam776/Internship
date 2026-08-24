import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import NotificationsModal from './NotificationsModal';
import DocModal from './DocModal';
import ProfileModal from './ProfileModal';
import { useToast } from '../context/ToastContext';

const Navbar = ({ onRefresh, isRefreshing, toggleSidebar, onSearch }) => {
  const location = useLocation();
  const [env, setEnv] = useState('Production');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  // Modals state
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDoc, setShowDoc] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'error', title: '500 Server Error Burst', message: 'Rate of 5xx errors exceeded threshold in error.log', time: '2m ago' },
    { id: 2, type: 'warning', title: 'Latency Spike Alert', message: 'POST /api/users response time reached 845ms', time: '14m ago' },
    { id: 3, type: 'info', title: 'Log File Rotation Complete', message: 'Daily rotate created combined-2026-08-24.log', time: '1h ago' }
  ]);

  const handleEnvChange = (newEnv) => {
    setEnv(newEnv);
    addToast(`Switched telemetry context to [${newEnv}] environment`, 'info');
    if (onRefresh) onRefresh();
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  const getBreadcrumb = (path) => {
    switch (path) {
      case '/': return 'Overview / General';
      case '/dashboard': return 'Overview / Dashboard';
      case '/health': return 'Overview / API Health';
      case '/request-logs': return 'Overview / Request Logs';
      case '/error-intelligence': return 'Overview / Error Intelligence';
      case '/metrics': return 'Overview / Metrics';
      case '/test-errors': return 'Overview / Test Error Handling';
      case '/winston-logs': return 'Overview / Winston Logs';
      case '/settings': return 'Overview / Configuration';
      default: return 'Overview / Observability';
    }
  };

  return (
    <>
      <header className="app-header">
        {/* Mobile Hamburger Toggle & Search Input */}
        <div className="d-flex align-items-center gap-2">
          <button
            className="header-icon-btn d-lg-none"
            onClick={toggleSidebar}
            aria-label="Toggle Navigation"
          >
            <i className="bi bi-list fs-5"></i>
          </button>

          <div className="header-search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search logs, errors, metrics..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Center Breadcrumbs Info */}
        <div className="text-secondary small font-mono d-none d-xl-block">
          {getBreadcrumb(location.pathname)}
        </div>

        {/* Right Header Actions */}
        <div className="header-actions">
          {/* Refresh Button */}
          <button
            className="btn-header-pill"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <i className={`bi bi-arrow-clockwise ${isRefreshing ? 'spin' : ''}`}></i>
            <span className="d-none d-sm-inline">Refresh</span>
          </button>

          {/* Environment Dropdown Pill */}
          <div className="dropdown">
            <button
              className="btn-header-pill production dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="dot-status green"></span>
              <span>{env}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-dark shadow">
              <li><button className="dropdown-item small" onClick={() => handleEnvChange('Production')}>● Production</button></li>
              <li><button className="dropdown-item small" onClick={() => handleEnvChange('Staging')}>● Staging</button></li>
              <li><button className="dropdown-item small" onClick={() => handleEnvChange('Development')}>● Development</button></li>
            </ul>
          </div>

          {/* Notifications Icon with Indicator */}
          <button
            className="header-icon-btn position-relative"
            title="Notifications & Incidents"
            onClick={() => setShowNotifications(true)}
          >
            <i className="bi bi-bell"></i>
            {notifications.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            )}
          </button>

          {/* Help Icon */}
          <button
            className="header-icon-btn d-none d-sm-flex"
            title="Help & Platform Documentation"
            onClick={() => setShowDoc(true)}
          >
            <i className="bi bi-question-circle"></i>
          </button>

          {/* Profile Avatar */}
          <div className="ms-1" style={{ cursor: 'pointer' }} onClick={() => setShowProfile(true)}>
            <div className="avatar-circle rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 34, height: 34, fontSize: '0.85rem' }}>
              A
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Modals */}
      {showNotifications && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onClear={() => setNotifications([])}
        />
      )}

      {showDoc && (
        <DocModal onClose={() => setShowDoc(false)} />
      )}

      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};

export default Navbar;
