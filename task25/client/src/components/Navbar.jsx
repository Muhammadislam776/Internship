import React, { useState } from 'react';
import { 
  FiLayers, 
  FiCheckSquare, 
  FiBarChart2, 
  FiTerminal, 
  FiSettings, 
  FiSearch, 
  FiBell, 
  FiSun, 
  FiMoon, 
  FiMenu, 
  FiX, 
  FiCheckCircle, 
  FiZap
} from 'react-icons/fi';

const Navbar = ({ activeTab, setActiveTab, theme, toggleTheme, onOpenSearch, onOpenCreateModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiLayers },
    { id: 'tasks', label: 'Tasks', icon: FiCheckSquare },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
    { id: 'testing', label: 'Testing', icon: FiTerminal },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <header className="sticky-navbar py-2.5 px-3 px-md-4">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        {/* Left: Clean Brand Logo */}
        <div className="d-flex align-items-center gap-3">
          
          {/* Mobile Hamburger Menu Button */}
          <button 
            className="btn btn-glass d-md-none p-2 border-0 rounded-3" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          
          {/* Brand Logo */}
          <div 
            className="d-flex align-items-center gap-2.5 cursor-pointer select-none" 
            onClick={() => setActiveTab('dashboard')}
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="bg-gradient-primary rounded-3 p-2 d-flex align-items-center justify-content-center shadow-md position-relative" 
              style={{ width: 38, height: 38, borderRadius: '12px' }}
            >
              <FiTerminal className="text-white" size={22} />
            </div>

            <span className="fw-extrabold fs-4 tracking-tight gradient-text">TaskForge</span>
          </div>

        </div>

        {/* Center: Floating Capsule Navigation Bar */}
        <nav className="d-none d-md-flex align-items-center gap-1.5 glass-panel p-1.5 rounded-pill shadow-md border" style={{ borderColor: 'rgba(99, 102, 241, 0.25)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-extrabold d-flex align-items-center gap-2 transition-all border-0 ${
                  isActive 
                    ? 'bg-gradient-primary text-white shadow-lg' 
                    : 'text-secondary bg-transparent hover-glass'
                }`}
                style={{ fontSize: '0.88rem' }}
              >
                <Icon size={17} className={isActive ? 'text-white' : 'text-primary'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Search, Notifications, Theme Toggle, User Profile */}
        <div className="d-flex align-items-center gap-2">
          
          {/* Quick Search Trigger */}
          <button 
            onClick={onOpenSearch} 
            className="btn btn-glass px-3.5 py-1.5 d-flex align-items-center gap-2 rounded-pill shadow-xs" 
            title="Search tasks (Ctrl+K)"
          >
            <FiSearch size={16} className="text-primary" />
            <span className="d-none d-lg-inline fs-7 text-secondary fw-bold">Search...</span>
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="position-relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)} 
              className="btn btn-glass p-2.5 position-relative rounded-circle shadow-xs" 
              title="Notifications"
            >
              <FiBell size={18} className="text-secondary" />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-2 border-white rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </button>

            {/* Notifications Menu */}
            {notificationsOpen && (
              <div 
                className="position-absolute end-0 mt-2 p-3 glass-panel shadow-lg rounded-4 text-start"
                style={{ width: '330px', zIndex: 1050 }}
              >
                <div className="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                  <h6 className="m-0 fw-extrabold text-primary">Notifications</h6>
                  <span className="badge bg-primary-subtle text-primary rounded-pill fs-8 fw-bold">3 New Alerts</span>
                </div>

                <div className="d-flex flex-column gap-2 fs-7">
                  <div className="p-2.5 rounded-3 bg-body-tertiary border border-secondary-subtle">
                    <div className="fw-extrabold text-primary d-flex align-items-center gap-1">
                      <FiCheckCircle className="text-success" size={14} /> Vitest Suite Green
                    </div>
                    <div className="text-muted fs-8 mt-0.5">27 tests completed cleanly in 1.2s</div>
                  </div>

                  <div className="p-2.5 rounded-3 bg-body-tertiary border border-secondary-subtle">
                    <div className="fw-extrabold text-success d-flex align-items-center gap-1">
                      ✓ Task Completed
                    </div>
                    <div className="text-muted fs-8 mt-0.5">"Write Vitest React Unit Tests" marked finished</div>
                  </div>

                  <div className="p-2.5 rounded-3 bg-body-tertiary border border-secondary-subtle">
                    <div className="fw-extrabold text-info d-flex align-items-center gap-1">
                      <FiZap className="text-info" size={14} /> Express API Active
                    </div>
                    <div className="text-muted fs-8 mt-0.5">All REST routes responding under 35ms</div>
                  </div>
                </div>

                <button 
                  onClick={() => setNotificationsOpen(false)}
                  className="btn btn-sm btn-glass w-100 mt-2 fs-8 fw-extrabold"
                >
                  Close Notifications
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-glass p-2.5 rounded-circle shadow-xs" 
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <FiMoon size={18} className="text-purple" /> : <FiSun size={18} className="text-warning" />}
          </button>

          {/* User Profile Avatar */}
          <div className="d-flex align-items-center ms-1">
            <div className="position-relative">
              <div 
                className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center text-white fw-extrabold shadow-md cursor-pointer"
                style={{ width: 38, height: 38, border: '2.5px solid rgba(255,255,255,0.9)' }}
                title="Senior Full-Stack Developer"
              >
                DV
              </div>
              <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle"></span>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="d-md-none pt-3 pb-2 border-top mt-2">
          <div className="d-flex flex-column gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`btn btn-sm text-start rounded-3 px-3 py-2 fw-extrabold d-flex align-items-center gap-2.5 ${
                    isActive 
                      ? 'bg-gradient-primary text-white shadow-sm' 
                      : 'btn-glass text-secondary'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
