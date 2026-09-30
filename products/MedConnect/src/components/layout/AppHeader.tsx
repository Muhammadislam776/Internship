import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SupabaseConfigModal } from '../common/SupabaseConfigModal';
import {
  Activity,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  User,
  HelpCircle,
  Settings,
  Pill,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface AppHeaderProps {
  onOpenQuickBook: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onOpenSupabaseModal: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  onOpenSupabaseModal,
}) => {
  const { refillRequests, appointments, patients, setActiveTab, activeTab } = useApp();
  const { currentUser, logout } = useAuth();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ type: string; label: string; sub: string; action: () => void }[]>([]);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const pendingRefills = refillRequests.filter((r) => r.status === 'pending_review').length;
  const todayAppts = appointments.filter((a) => {
    const today = new Date().toDateString();
    return new Date(a.dateTime).toDateString() === today;
  });
  const notifCount = pendingRefills + (todayAppts.length > 0 ? 1 : 0);

  // Global search
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); setShowResults(false); return; }
    const results: { type: string; label: string; sub: string; action: () => void }[] = [];

    // Search patients
    patients.filter((p) => {
      const full = `${p.firstName} ${p.lastName} ${p.nhsNumber}`.toLowerCase();
      return full.includes(q.toLowerCase());
    }).slice(0, 3).forEach((p) => {
      results.push({
        type: 'patient',
        label: `${p.firstName} ${p.lastName}`,
        sub: `NHS ${p.nhsNumber}`,
        action: () => { setActiveTab('schedule'); setShowResults(false); },
      });
    });

    // Search appointments
    appointments.filter((a) => {
      return a.patientName.toLowerCase().includes(q.toLowerCase()) ||
             a.reasonForVisit.toLowerCase().includes(q.toLowerCase());
    }).slice(0, 2).forEach((a) => {
      results.push({
        type: 'appointment',
        label: a.patientName,
        sub: `${a.reasonForVisit} · ${new Date(a.dateTime).toLocaleDateString('en-GB')}`,
        action: () => { setActiveTab('scheduler'); setShowResults(false); },
      });
    });

    setSearchResults(results);
    setShowResults(true);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const userInitials = (name?: string) =>
    name ? name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() : 'U';

  const notifications = [
    ...(pendingRefills > 0 ? [{
      icon: <Pill className="w-3.5 h-3.5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-100',
      title: `${pendingRefills} prescription request${pendingRefills > 1 ? 's' : ''} pending`,
      sub: 'Awaiting your review and sign-off',
      time: 'Now',
      action: () => { setActiveTab('prescriptions'); setIsNotificationsOpen(false); },
    }] : []),
    ...(todayAppts.length > 0 ? [{
      icon: <Calendar className="w-3.5 h-3.5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
      title: `${todayAppts.length} appointments today`,
      sub: `Next: ${todayAppts[0]?.patientName || '—'} at ${todayAppts[0] ? new Date(todayAppts[0].dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—'}`,
      time: 'Today',
      action: () => { setActiveTab('scheduler'); setIsNotificationsOpen(false); },
    }] : []),
    {
      icon: <FileText className="w-3.5 h-3.5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-100',
      title: 'New intake form submitted',
      sub: 'Sarah Ahmed completed her health questionnaire',
      time: '2h ago',
      action: () => { setActiveTab('intake'); setIsNotificationsOpen(false); },
    },
    {
      icon: <AlertCircle className="w-3.5 h-3.5 text-orange-600" />,
      bg: 'bg-orange-50 border-orange-100',
      title: 'Appointment attendance risk',
      sub: 'Oliver Bennett — moderate risk for today 10:30 AM',
      time: '4h ago',
      action: () => { setActiveTab('schedule'); setIsNotificationsOpen(false); },
    },
  ];

  const typeIcon: Record<string, React.ReactNode> = {
    patient: <User className="w-3.5 h-3.5 text-blue-500" />,
    appointment: <Calendar className="w-3.5 h-3.5 text-emerald-500" />,
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-4 sm:px-5 lg:px-6 h-14 flex items-center justify-between gap-4">

          {/* ── Left: Toggle + Brand ── */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors lg:hidden"
              title="Toggle Sidebar"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm leading-tight block">ClinicFlow</span>
                <span className="text-[10px] text-slate-500 leading-tight block hidden sm:block">
                  {currentUser?.clinicName || 'St. James Health Centre'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Center: Search ── */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 relative" ref={searchRef}>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              placeholder="Search patients, NHS numbers, appointments..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 overflow-hidden">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={r.action}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 text-left transition-colors"
                  >
                    <span className="shrink-0">{typeIcon[r.type]}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{r.label}</p>
                      <p className="text-[10px] text-slate-500">{r.sub}</p>
                    </div>
                  </button>
                ))}
                {searchResults.length === 0 && (
                  <p className="px-4 py-3 text-xs text-slate-400">No results found</p>
                )}
              </div>
            )}
            {showResults && searchResults.length === 0 && searchQuery.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-3 px-4">
                <p className="text-xs text-slate-400">No results for "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* ── Right: Notifications + Profile ── */}
          <div className="flex items-center gap-1.5 shrink-0">

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileMenuOpen(false); }}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Notifications</span>
                    {notifCount > 0 && (
                      <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
                        {notifCount} new
                      </span>
                    )}
                  </div>
                  <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                    {notifications.map((n, i) => (
                      <button
                        key={i}
                        onClick={n.action}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                      >
                        <span className={`mt-0.5 p-1.5 rounded-lg border ${n.bg} shrink-0`}>{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">{n.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{n.sub}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">{n.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Help */}
            <button
              onClick={() => setActiveTab('help')}
              className={`p-2 rounded-lg transition-colors hidden sm:flex ${
                activeTab === 'help'
                  ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Help & Knowledge Base"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotificationsOpen(false); }}
                className="flex items-center gap-2 p-1 pr-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name || 'User'}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    {userInitials(currentUser?.name)}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser?.name?.split(' ').slice(0, 2).join(' ') || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight capitalize">
                    {currentUser?.role?.replace('_', ' ') || 'Doctor'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  {/* Profile header */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">{currentUser?.email}</p>
                    {currentUser?.gmcNumber && (
                      <p className="text-[10px] text-blue-600 font-mono mt-1">{currentUser.gmcNumber}</p>
                    )}
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    {[
                      { icon: <User className="w-3.5 h-3.5" />, label: 'My Profile', action: () => { setActiveTab('profile'); setIsProfileMenuOpen(false); } },
                      { icon: <Calendar className="w-3.5 h-3.5" />, label: 'My Availability', action: () => { setActiveTab('availability'); setIsProfileMenuOpen(false); } },
                      { icon: <Settings className="w-3.5 h-3.5" />, label: 'Account Settings', action: () => { setActiveTab('settings'); setIsProfileMenuOpen(false); } },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-slate-400">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </>
  );
};
