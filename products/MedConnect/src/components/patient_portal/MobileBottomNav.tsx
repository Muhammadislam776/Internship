import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Pill,
  FileText,
  Menu
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMoreMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMoreMenu
}) => {
  const tabs = [
    {
      id: 'patient_dashboard',
      label: 'Home',
      icon: LayoutDashboard
    },
    {
      id: 'patient_appointments',
      label: 'Appointments',
      icon: Calendar
    },
    {
      id: 'patient_prescriptions',
      label: 'Prescriptions',
      icon: Pill
    },
    {
      id: 'patient_forms',
      label: 'Forms',
      icon: FileText
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 lg:hidden flex items-center justify-around shadow-lg">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelectTab(t.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className="text-[10px] tracking-tight">{t.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMoreMenu}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
      >
        <Menu className="w-5 h-5 mb-0.5 text-slate-400" />
        <span className="text-[10px] tracking-tight">More</span>
      </button>
    </nav>
  );
};
