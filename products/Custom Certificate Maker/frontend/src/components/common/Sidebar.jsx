import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Award,
  Palette,
  FileText,
  ShieldAlert,
  Settings,
  PlusCircle,
  FileCheck,
  CheckCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const adminNav = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Organizations', path: '/admin/orgs', icon: Building2 },
    { label: 'Recipients & Users', path: '/admin/users', icon: Users },
    { label: 'All Certificates', path: '/admin/certificates', icon: Award },
    { label: 'Templates Manager', path: '/admin/templates', icon: Palette },
    { label: 'Verification Activity', path: '/admin/logs', icon: ShieldAlert },
    { label: 'System Settings', path: '/admin/settings', icon: Settings }
  ];

  const orgNav = [
    { label: 'Dashboard', path: '/org', icon: LayoutDashboard },
    { label: '+ Create Certificate', path: '/org/designer', icon: PlusCircle, highlight: true },
    { label: 'Issued Certificates', path: '/org/issued', icon: FileCheck },
    { label: 'Draft Certificates', path: '/org/drafts', icon: Clock },
    { label: 'Recipients Directory', path: '/org/recipients', icon: UserCheck },
    { label: 'Organization Profile', path: '/org/profile', icon: Building2 }
  ];

  const recipientNav = [
    { label: 'Dashboard', path: '/recipient', icon: LayoutDashboard },
    { label: 'My Certificates', path: '/recipient/certificates', icon: Award },
    { label: 'Account Profile', path: '/recipient/profile', icon: UserCheck }
  ];

  const navItems = user.role === 'admin' ? adminNav : user.role === 'organization' ? orgNav : recipientNav;

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="mb-6 px-3 py-2 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold uppercase">
          {user.name ? user.name[0] : 'U'}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-white truncate">{user.name}</p>
          <p className="text-[10px] text-slate-400 capitalize truncate">{user.role}</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/org' || item.path === '/recipient'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  item.highlight
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-semibold shadow-lg shadow-amber-500/10 hover:brightness-110 mb-3'
                    : isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className={`w-4 h-4 ${item.highlight ? 'text-white' : ''}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
