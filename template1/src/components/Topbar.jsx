import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Topbar = ({ toggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="logo-container" style={{ width: '210px' }}>
          <div className="logo-icon" style={{ backgroundColor: 'transparent', border: 'none', width: 'auto', height: 'auto' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22H22L12 2Z" fill="white" />
              <path d="M12 8L6 20H18L12 8Z" fill="var(--primary-color)" />
            </svg>
          </div>
          <span className="brand-name" style={{ color: 'white', marginLeft: '8px', fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px' }}>WEIC Dash</span>
        </div>
        <button className="menu-toggle" onClick={toggleSidebar}>
          <i className="ri-menu-line"></i>
        </button>
      </div>
      
      <div className="topbar-right">
        <div className="search-box">
          <i className="ri-search-line"></i>
          <input type="text" placeholder="Search..." />
        </div>
        <button className="icon-btn" onClick={() => navigate('/notifications')} style={{ position: 'relative' }}>
          <i className="ri-notification-3-line"></i>
          <span style={{ position: 'absolute', top: '5px', right: '5px', width: '8px', height: '8px', backgroundColor: 'var(--danger)', borderRadius: '50%' }}></span>
        </button>
        
        <div className="profile-dropdown-container" ref={dropdownRef}>
          <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)} style={{ padding: 0, borderRadius: '50%', overflow: 'hidden', width: '36px', height: '36px', border: '2px solid rgba(255,255,255,0.4)' }}>
            <img src="/profile.jpeg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
          
          {profileOpen && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-item" onClick={() => handleLinkClick('/settings')}>
                <i className="ri-settings-3-line"></i> Settings
              </div>
              <div className="dropdown-item" onClick={() => handleLinkClick('/profile')}>
                <i className="ri-user-3-line"></i> Profile
              </div>
              <div className="dropdown-item" onClick={() => handleLinkClick('/messages')}>
                <i className="ri-mail-line"></i> My Messages
              </div>
              <div className="dropdown-item" onClick={() => handleLinkClick('/lock-screen')}>
                <i className="ri-lock-2-line"></i> Lock Screen
              </div>
              <div className="dropdown-item" onClick={() => handleLinkClick('/login')}>
                <i className="ri-logout-box-r-line"></i> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
