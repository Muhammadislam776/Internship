import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Folder, 
  UploadCloud, 
  Share2, 
  Star, 
  Trash2, 
  Settings,
  HardDrive
} from 'lucide-react';
import { formatBytes } from '../services/analyticsService';

export default function Sidebar({ isOpen, onClose, storageStats }) {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Files', path: '/files', icon: Folder },
    { label: 'Upload', path: '/files?upload=true', icon: UploadCloud },
    { label: 'Shared Files', path: '/shared', icon: Share2 },
    { label: 'Favorites', path: '/favorites', icon: Star },
    { label: 'Trash', path: '/trash', icon: Trash2 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const usedBytes = storageStats?.totalStorageBytes || 0;
  const limitBytes = storageStats?.storageLimitBytes || (10 * 1024 * 1024 * 1024);
  const percentage = Math.min(100, Math.round((usedBytes / limitBytes) * 100));

  // Determine storage progress color based on usage
  let progressColor = 'var(--cyber-cyan)';
  if (percentage >= 90) progressColor = 'var(--red)';
  else if (percentage >= 70) progressColor = 'var(--vibrant-orange)';

  return (
    <aside className={`sidebar-glass ${isOpen ? 'open' : ''}`}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', tracking: '0.1em', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
          Navigation
        </div>
        <nav>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path.includes('upload') && location.search.includes('upload'));
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={onClose}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Storage Usage Widget */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(34, 211, 238, 0.15)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1rem',
        marginTop: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--white)', fontWeight: 600 }}>
            <HardDrive size={16} color="var(--cyber-cyan)" />
            <span>Storage Usage</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--cyber-cyan)', fontWeight: 700 }}>
            {percentage}%
          </span>
        </div>

        <div className="progress-bar-bg" style={{ marginBottom: '0.6rem' }}>
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${percentage}%`, 
              backgroundColor: progressColor,
              boxShadow: `0 0 10px ${progressColor}`
            }} 
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(248, 250, 252, 0.65)' }}>
          <span>{formatBytes(usedBytes)} used</span>
          <span>10 GB total</span>
        </div>
      </div>
    </aside>
  );
}
