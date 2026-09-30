import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  Calendar,
  Video,
  FileText,
  Pill,
  Users,
  MessageSquare,
  ShieldCheck,
  Activity,
  User,
  Settings,
  ClipboardList,
  Building2,
  LogOut,
  HelpCircle,
  BarChart3,
  Globe,
  Stethoscope,
  Clock,
  HeartPulse,
  Lock,
  Bell
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, refillRequests, appointments } = useApp();
  const { currentUser, logout } = useAuth();

  const role = currentUser?.role || 'doctor';
  const pendingRefills = refillRequests.filter((r) => r.status === 'pending_review').length;
  const todayAppts = appointments.filter((a) => {
    const today = new Date().toDateString();
    return new Date(a.dateTime).toDateString() === today;
  }).length;

  const getNavItemsForRole = (role: UserRole): NavSection[] => {
    switch (role) {
      case 'doctor':
        return [
          {
            section: 'Workspace',
            items: [
              {
                id: 'schedule',
                label: 'Dashboard',
                icon: LayoutDashboard,
              },
              {
                id: 'scheduler',
                label: "Today's Schedule",
                icon: Calendar,
                badge: todayAppts || undefined,
                badgeColor: 'bg-blue-100 text-blue-700',
              },
              {
                id: 'calendar',
                label: 'Calendar',
                icon: Clock,
              },
            ],
          },
          {
            section: 'Clinical',
            items: [
              {
                id: 'telehealth',
                label: 'Telemedicine',
                icon: Video,
                badge: 'Live',
                badgeColor: 'bg-emerald-100 text-emerald-700',
              },
              {
                id: 'prescriptions',
                label: 'Prescription Requests',
                icon: Pill,
                badge: pendingRefills || undefined,
                badgeColor: 'bg-amber-100 text-amber-800',
              },
              {
                id: 'intake',
                label: 'Digital Intake Forms',
                icon: FileText,
              },
              {
                id: 'ai_triage',
                label: 'Triage Assistant',
                icon: HeartPulse,
              },
            ],
          },
          {
            section: 'Management',
            items: [
              {
                id: 'rota',
                label: 'Staff Rota',
                icon: Users,
              },
            ],
          },
          {
            section: 'Insights',
            items: [
              {
                id: 'compliance',
                label: 'Audit & Compliance',
                icon: ShieldCheck,
              },
            ],
          },
        ];

      case 'patient':
        return [
          {
            section: 'MY HEALTHCARE',
            items: [
              { id: 'patient_dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'patient_appointments', label: 'Appointments', icon: Calendar },
              { id: 'patient_prescriptions', label: 'Prescriptions', icon: Pill },
              { id: 'patient_forms', label: 'Health Forms', icon: FileText },
              { id: 'patient_records', label: 'Medical Records', icon: ClipboardList },
            ],
          },
          {
            section: 'CONSULTATIONS',
            items: [
              { id: 'patient_consultations', label: 'Video Consultations', icon: Video, badge: 'Live', badgeColor: 'bg-emerald-100 text-emerald-700' },
              { id: 'patient_messages', label: 'Messages', icon: MessageSquare },
            ],
          },
          {
            section: 'ACCOUNT',
            items: [
              { id: 'patient_profile', label: 'My Profile', icon: User },
              { id: 'patient_notifications', label: 'Notifications', icon: Bell },
              { id: 'patient_privacy', label: 'Privacy & Security', icon: ShieldCheck },
            ],
          },
        ];

      case 'receptionist':
        return [
          {
            section: 'Front Desk',
            items: [
              {
                id: 'scheduler',
                label: 'Appointment Scheduler',
                icon: Calendar,
                badge: appointments.length,
                badgeColor: 'bg-blue-100 text-blue-700',
              },
              { id: 'twilio', label: 'Patient Messaging', icon: MessageSquare },
              { id: 'gmb_saas', label: 'Online Booking', icon: Globe },
              { id: 'rota', label: 'Staff Rota', icon: Users },
            ],
          },
        ];

      case 'practice_manager':
        return [
          {
            section: 'Practice Operations',
            items: [
              { id: 'rota', label: 'Rota & Operations', icon: Users },
              {
                id: 'scheduler',
                label: 'All Appointments',
                icon: Calendar,
              },
              {
                id: 'prescriptions',
                label: 'Prescription Queue',
                icon: Pill,
                badge: pendingRefills || undefined,
                badgeColor: 'bg-amber-100 text-amber-800',
              },
              { id: 'twilio', label: 'SMS & Communications', icon: MessageSquare },
              { id: 'gmb_saas', label: 'SaaS & Subscriptions', icon: Globe },
              { id: 'compliance', label: 'Compliance & Audit', icon: ShieldCheck },
            ],
          },
        ];

      case 'saas_admin':
        return [
          {
            section: 'Super Admin',
            items: [
              { id: 'gmb_saas', label: 'Clinic Tenants', icon: Building2 },
              { id: 'compliance', label: 'Security & Audit', icon: ShieldCheck },
              { id: 'scheduler', label: 'All Appointments', icon: Calendar },
              { id: 'twilio', label: 'Communication Logs', icon: MessageSquare },
              { id: 'rota', label: 'Global Rota', icon: Users },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const navSections = getNavItemsForRole(role as UserRole);

  const roleLabel: Record<string, string> = {
    doctor: 'Doctor',
    patient: 'Patient',
    receptionist: 'Receptionist',
    practice_manager: 'Practice Manager',
    saas_admin: 'Super Admin',
  };

  const roleColor: Record<string, string> = {
    doctor: 'bg-blue-600',
    patient: 'bg-emerald-600',
    receptionist: 'bg-amber-600',
    practice_manager: 'bg-purple-600',
    saas_admin: 'bg-slate-700',
  };

  const roleInitials = (name?: string) =>
    name
      ? name
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase()
      : 'U';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-14 left-0 z-40 h-screen lg:h-[calc(100vh-3.5rem)] bg-white border-r border-slate-200 w-60 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Doctor identity card */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl ${roleColor[role] || 'bg-slate-600'} text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm`}
            >
              {roleInitials(currentUser?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentUser?.name || 'Clinician'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {roleLabel[role] || role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                {section.section}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <button
            onClick={() => {
              setActiveTab(role === 'patient' ? 'patient_help' : 'help');
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === (role === 'patient' ? 'patient_help' : 'help')
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className={`w-4 h-4 ${activeTab === (role === 'patient' ? 'patient_help' : 'help') ? 'text-white' : 'text-slate-400'}`} />
            <span>Help & Support</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          {/* Subtle security indicator */}
          <div className="flex items-center gap-1.5 px-2.5 pt-1">
            <Lock className="w-3 h-3 text-slate-300" />
            <span className="text-[10px] text-slate-400 font-medium">Secure session</span>
          </div>
        </div>
      </aside>
    </>
  );
};
