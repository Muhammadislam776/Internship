import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, 
  LayoutDashboard, 
  Settings, 
  Activity, 
  HelpCircle, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const Header = ({ profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Profile', path: '/', icon: User },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Activity', path: '/activity', icon: Activity },
    { name: 'Help', path: '/help', icon: HelpCircle },
  ];

  const notifications = [
    { id: 1, title: 'Security Check Passed', time: '5m ago', text: 'Supabase storage bucket profile-pictures verified.' },
    { id: 2, title: 'Profile Updated', time: '1h ago', text: 'Your bio details were synchronized.' }
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '72px',
      zIndex: 900,
      background: 'rgba(7, 26, 43, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(34, 211, 238, 0.15)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 2rem',
      justifyContent: 'space-between'
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #FF7A18 0%, #2563EB 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(255, 122, 24, 0.4)'
        }}>
          <Sparkles color="#FFFFFF" size={22} />
        </div>
        <div>
          <span style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #22D3EE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ProfileHub
          </span>
          <span style={{
            display: 'block',
            fontSize: '0.65rem',
            color: '#FFB86B',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 700
          }}>
            Identity Engine
          </span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '/profile');
          return (
            <Link
              key={link.name}
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive ? '#22D3EE' : '#94A3B8',
                background: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(34, 211, 238, 0.25)' : '1px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Right Side Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notifications Icon */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(11, 37, 58, 0.8)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
              color: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#FF7A18',
              boxShadow: '0 0 8px #FF7A18'
            }}></span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '320px',
              background: '#0B253A',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              borderRadius: '14px',
              padding: '1rem',
              boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
              zIndex: 1000
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>Notifications</span>
                <span style={{ fontSize: '0.75rem', color: '#FF7A18', fontWeight: 600 }}>2 New</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: '0.6rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#22D3EE' }}>
                    <span>{n.title}</span>
                    <span style={{ color: '#64748B', fontSize: '0.7rem' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>{n.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Avatar & User Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(11, 37, 58, 0.8)',
              border: '1px solid rgba(34, 211, 238, 0.25)',
              padding: '0.35rem 0.75rem 0.35rem 0.35rem',
              borderRadius: '30px'
            }}
          >
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'}
              alt="Avatar"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #22D3EE'
              }}
            />
            <span className="desktop-only-text" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
              {profile?.name || 'User'}
            </span>
            <ChevronDown size={14} color="#94A3B8" />
          </button>

          {userDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '52px',
              right: 0,
              width: '220px',
              background: '#0B253A',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              borderRadius: '14px',
              padding: '0.5rem',
              boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
              zIndex: 1000
            }}>
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{profile?.name}</p>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{profile?.email}</p>
              </div>
              <Link
                to="/"
                onClick={() => setUserDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.85rem',
                  color: '#22D3EE',
                  borderRadius: '8px'
                }}
              >
                <User size={15} /> My Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setUserDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.85rem',
                  color: '#94A3B8',
                  borderRadius: '8px'
                }}
              >
                <Settings size={15} /> Account Settings
              </Link>
              <button
                onClick={() => {
                  setUserDropdownOpen(false);
                  alert('Session logged out successfully.');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.85rem',
                  color: '#EF4444',
                  background: 'transparent',
                  textAlign: 'left'
                }}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            color: '#FFFFFF',
            border: 'none',
            display: 'none'
          }}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Animated Nav Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          background: 'rgba(7, 26, 43, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(34, 211, 238, 0.2)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          animation: 'slideUp 0.3s ease forwards'
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#F8FAFC',
                  background: 'rgba(11, 37, 58, 0.8)'
                }}
              >
                <Icon size={18} color="#22D3EE" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* CSS Rules for Desktop vs Mobile Nav */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: block !important; }
          .desktop-only-text { display: none !important; }
        }
      `}</style>
    </header>
  );
};
