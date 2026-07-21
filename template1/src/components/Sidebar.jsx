import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-menu">
        <div className="menu-label" style={{ paddingBottom: '10px' }}>
          WEIC Dash
        </div>
        <NavLink to="/" onClick={closeSidebar} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <i className="ri-dashboard-line"></i>
          <span>Dashboard</span>
        </NavLink>

        <div className="menu-label">
          PAGES
          <span className="menu-label-text">Prebuild-Pages</span>
        </div>
        
        <NavLink to="/sample-page" onClick={closeSidebar} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <i className="ri-pages-line"></i>
          <span>Sample Page</span>
        </NavLink>
        
        <div className={`menu-item has-dropdown ${authOpen ? 'active' : ''}`} onClick={() => setAuthOpen(!authOpen)} style={{ cursor: 'pointer' }}>
          <i className="ri-shield-user-line"></i>
          <span>Authentication</span>
          <i className={`ri-arrow-${authOpen ? 'up' : 'down'}-s-line dropdown-icon`}></i>
        </div>
        
        {authOpen && (
          <div className="submenu" style={{ paddingLeft: '45px', display: 'flex', flexDirection: 'column' }}>
            <NavLink to="/login" onClick={closeSidebar} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} style={{ padding: '8px 12px', margin: '2px 0', fontSize: '13px' }}>
              <i className="ri-arrow-right-line" style={{ fontSize: '14px', marginRight: '10px' }}></i> login
            </NavLink>
            <NavLink to="/register" onClick={closeSidebar} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} style={{ padding: '8px 12px', margin: '2px 0', fontSize: '13px' }}>
              <i className="ri-arrow-right-line" style={{ fontSize: '14px', marginRight: '10px' }}></i> register
            </NavLink>
          </div>
        )}
        
        <NavLink to="/documentation" onClick={closeSidebar} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <i className="ri-question-line"></i>
          <span>Documentation</span>
          <span className="badge">Help?</span>
        </NavLink>

        <div className="menu-label">UTILS</div>
        <NavLink to="/icons" onClick={closeSidebar} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <i className="ri-function-line"></i>
          <span>Icons</span>
        </NavLink>
        <NavLink to="/typography" onClick={closeSidebar} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <i className="ri-font-color"></i>
          <span>Typography</span>
        </NavLink>

        <div className="menu-label">SUPPORT</div>
      </div>
    </aside>
  );
};

export default Sidebar;
