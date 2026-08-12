import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  KeyRound, 
  BarChart3, 
  FileText, 
  Settings, 
  Lock, 
  History, 
  HelpCircle,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const sections = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'User Management',
      items: [
        { id: 'users', label: 'Users Command Center', icon: Users, badge: '250' },
        { id: 'roles', label: 'RBAC Roles', icon: ShieldCheck, badge: '4' },
        { id: 'permissions', label: 'Permissions Matrix', icon: KeyRound }
      ]
    },
    {
      title: 'Analytics & Reports',
      items: [
        { id: 'analytics', label: 'Telemetry Analytics', icon: BarChart3 },
        { id: 'reports', label: 'Reports Center', icon: FileText, badge: '12' }
      ]
    },
    {
      title: 'System & Security',
      items: [
        { id: 'settings', label: 'Security Gateway', icon: Settings },
        { id: 'activity', label: 'Audit Log Stream', icon: History, badge: '5 Alert' },
        { id: 'support', label: 'Support & Help', icon: HelpCircle }
      ]
    }
  ];

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 glass-panel rounded-3xl p-4 border border-[#22D3EE]/25 shadow-2xl space-y-6">
        
        {/* Enterprise Workspace Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0B253A] via-[#071A2B] to-[#0B253A] border border-[#22D3EE]/30 flex items-center gap-3 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] flex items-center justify-center text-white shadow-md shadow-[#22D3EE]/30">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">Admin Workspace</p>
            <p className="text-[10px] text-[#22D3EE] font-mono mt-0.5">ID: SEC-9042-X</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-5">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h4 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#9FB0C2]/80">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#2563EB] via-[#0B253A] to-[#071A2B] text-white shadow-lg shadow-[#2563EB]/30 border border-[#22D3EE]/60'
                          : 'text-[#9FB0C2] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {/* Orange Accent Indicator Line for Active Tab */}
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-[#FF7A18] to-[#FFB86B] rounded-r-full shadow-sm shadow-[#FF7A18]" />
                      )}

                      <div className="flex items-center gap-3 pl-1">
                        <Icon 
                          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-[#22D3EE] animate-pulse' : 'text-[#9FB0C2] group-hover:text-[#22D3EE]'
                          }`} 
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge ? (
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${
                          isActive
                            ? 'bg-[#FF7A18] text-white border-white/20'
                            : 'bg-[#0B253A] text-[#22D3EE] border-[#22D3EE]/30'
                        }`}>
                          {item.badge}
                        </span>
                      ) : (
                        <ChevronRight className={`w-3.5 h-3.5 text-[#9FB0C2] opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100 text-[#22D3EE]' : ''}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Mini Profile Card */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
            alt="Admin" 
            className="w-8 h-8 rounded-full border border-[#22D3EE] object-cover" 
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">Alex Vance</p>
            <p className="text-[10px] text-[#FFB86B] font-mono">Super Admin</p>
          </div>
        </div>

      </div>
    </aside>
  );
};
