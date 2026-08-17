import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Cloud, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Folder, 
  Share2, 
  Star, 
  Trash2, 
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';
import { authService } from '../services/authService';

export default function Header({ user, onLogout, toggleMobileSidebar, isMobileSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    { id: 1, title: 'Upload Successful', time: 'Just now', text: 'annual_report_2026.pdf was uploaded.' },
    { id: 2, title: 'File Shared', time: '10m ago', text: 'You shared brand_assets.zip with alex@company.com' },
  ];

  return (
    <header className="header-glass">
      <div className="header-content">
        {/* Left Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="btn-icon" 
            onClick={toggleMobileSidebar} 
            style={{ color: 'var(--white)', display: 'none' }}
            id="hamburger-btn"
          >
            {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="logo-container">
            <div className="logo-badge">
              <Cloud size={24} color="#FFFFFF" />
            </div>
            <span>ShareVault</span>
          </Link>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
          <Link to="/" className={`nav-link-top ${location.pathname === '/' ? 'active-top' : ''}`}>
            Home
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className={`nav-link-top ${location.pathname === '/dashboard' ? 'active-top' : ''}`}>
                Dashboard
              </Link>
              <Link to="/files" className={`nav-link-top ${location.pathname === '/files' ? 'active-top' : ''}`}>
                My Files
              </Link>
              <Link to="/shared" className={`nav-link-top ${location.pathname === '/shared' ? 'active-top' : ''}`}>
                Shared
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              {/* Notification Popover */}
              <div style={{ position: 'relative' }}>
                <button 
                  className="btn-icon" 
                  style={{ color: 'var(--white)', position: 'relative' }}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--cyber-cyan)'
                  }} />
                </button>

                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '44px',
                    width: '320px',
                    background: 'var(--midnight-navy)',
                    border: '1px solid rgba(34, 211, 238, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 200,
                    color: 'var(--white)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 600 }}>
                      <span>Notifications</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--cyber-cyan)' }}>Mark all read</span>
                    </div>
                    {mockNotifications.map(n => (
                      <div key={n.id} style={{
                        padding: '0.6rem 0',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '0.85rem'
                      }}>
                        <div style={{ fontWeight: 600, color: 'var(--cyber-cyan)' }}>{n.title}</div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>{n.text}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>{n.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'rgba(34, 211, 238, 0.1)',
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                    padding: '0.3rem 0.8rem 0.3rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--white)',
                    cursor: 'pointer'
                  }}
                >
                  <img 
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || 'User')}`} 
                    alt={user.fullName}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1.5px solid var(--cyber-cyan)'
                    }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.fullName || 'Account'}</span>
                </button>

                {showProfileMenu && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '50px',
                    width: '220px',
                    background: 'var(--midnight-navy)',
                    border: '1px solid rgba(34, 211, 238, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 200,
                    color: 'var(--white)'
                  }}>
                    <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--cyber-cyan)' }}>{user.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{user.email}</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--emerald)', marginTop: '0.4rem', background: 'rgba(34,197,94,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        <ShieldCheck size={12} /> Authenticated
                      </div>
                    </div>
                    <Link 
                      to="/settings" 
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--white)',
                        marginTop: '0.3rem'
                      }}
                    >
                      <User size={16} /> Profile & Settings
                    </Link>
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--red)',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .nav-link-top {
          color: rgba(248, 250, 252, 0.75);
          font-weight: 500;
          font-size: 0.95rem;
          transition: var(--transition);
        }
        .nav-link-top:hover, .nav-link-top.active-top {
          color: var(--cyber-cyan);
        }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          #hamburger-btn { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}
