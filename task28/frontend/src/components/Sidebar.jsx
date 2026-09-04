import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Kanban, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings,
  Sparkles,
  Flame
} from 'lucide-react';

const Sidebar = ({ projects = [] }) => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Kanban Board', path: '/board', icon: Kanban },
    { name: 'My Tasks', path: '/my-tasks', icon: CheckSquare },
    { name: 'Team Workspace', path: '/team', icon: Users },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 glass-panel min-h-[calc(100vh-4rem)] p-4 border-r border-cyber/15">
      {/* Primary Workspace Links */}
      <div className="mb-6">
        <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
          Workspace Overview
        </p>
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path || (link.path === '/dashboard' && location.pathname === '/');
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-electric/20 text-cyber border border-cyber/30 shadow-cyan-glow'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-cyber' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Active Projects List */}
      <div className="mb-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Active Projects ({projects.length})
          </p>
          <Link to="/projects" className="text-[10px] font-bold text-cyber hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-1">
          {projects.slice(0, 5).map((project) => {
            const active = location.pathname.includes(`/projects/${project._id}`);
            return (
              <Link
                key={project._id}
                to={`/projects/${project._id}/board`}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-midnight-hover text-cyber border border-cyber/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span className="truncate max-w-[130px]">{project.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyber/10 text-cyber border border-cyber/20">
                  {project.progress || 0}%
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Productivity Pro Badge Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-midnight-card via-midnight to-electric/20 border border-cyber/25 relative overflow-hidden shadow-glass">
        <div className="flex items-center gap-2 mb-1.5">
          <Flame className="w-4 h-4 text-vibrant animate-pulse" />
          <span className="text-xs font-bold text-white">Flow Board Pro</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-tight mb-3">
          Drag & drop sync enabled with instant API persistence.
        </p>
        <div className="w-full h-1.5 bg-midnight rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-electric via-cyber to-vibrant w-full animate-pulse" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
