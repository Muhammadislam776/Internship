import React from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { LayoutDashboard, Compass, Heart, Activity, BarChart2, Settings, Zap } from 'lucide-react';

export function Sidebar() {
  const { activeTab, setActiveTab, isOptimized, items } = usePerformance();

  const favCount = items.filter(i => i.isFavorite).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore Dataset', icon: Compass, badge: items.length },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favCount },
    { id: 'lab', label: 'Performance Lab', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-badge">
          <Zap size={22} />
        </div>
        <div>
          <h1 className="logo-title">HyperList</h1>
          <p className="logo-tagline">1000+ Item Performance Lab</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && (
                <span className="category-count">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="glass-card" style={{ padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className={isOptimized ? 'pulse-emerald' : 'pulse-rose'} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
              {isOptimized ? '⚡ Optimized Mode' : '🐢 Unoptimized'}
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            {isOptimized ? 'useMemo & useCallback active' : 'Inline refs & standard renders'}
          </p>
        </div>
      </div>
    </aside>
  );
}
