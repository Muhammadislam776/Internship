import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  Video,
  FileCheck2,
  Pill,
  Users2,
  TrendingUp,
  ShieldCheck,
  MessageSquareCode,
  UserCircle2,
  Brain
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, refillRequests, appointments } = useApp();

  const pendingRefillsCount = refillRequests.filter((r) => r.status === 'pending_review').length;
  const criticalAppointmentsCount = appointments.filter(
    (a) => a.mlPrediction?.riskLevel === 'high' || a.mlPrediction?.riskLevel === 'critical'
  ).length;

  const navItems = [
    {
      id: 'scheduler',
      label: 'Intelligent Scheduler',
      badge: criticalAppointmentsCount > 0 ? `${criticalAppointmentsCount} ML alerts` : undefined,
      badgeColor: 'bg-amber-500 text-black',
      icon: CalendarDays,
      description: 'ML No-Show & Google Calendar'
    },
    {
      id: 'triage',
      label: 'AI Clinical Triage',
      badge: 'NHS 111',
      badgeColor: 'bg-indigo-500 text-white',
      icon: Brain,
      description: 'Symptom Classifier'
    },
    {
      id: 'telemedicine',
      label: 'Video Consultation',
      badge: 'WebRTC Live',
      badgeColor: 'bg-teal-500 text-black',
      icon: Video,
      description: 'Supabase Realtime Telehealth'
    },
    {
      id: 'intake',
      label: 'Digital Intake Forms',
      badge: 'AES-256',
      badgeColor: 'bg-indigo-500 text-white',
      icon: FileCheck2,
      description: 'Encrypted Pre-Arrival PHI'
    },
    {
      id: 'prescriptions',
      label: 'Prescription Refills',
      badge: pendingRefillsCount > 0 ? `${pendingRefillsCount} Pending` : undefined,
      badgeColor: 'bg-rose-500 text-white',
      icon: Pill,
      description: '1-Click Sign-off & EPS'
    },
    {
      id: 'rota',
      label: 'Staff Rota & Analytics',
      icon: Users2,
      description: 'Doctor Load & CSAT Ratings'
    },
    {
      id: 'gmb_saas',
      label: 'GMB Widget & SaaS',
      badge: 'UK Strategy',
      badgeColor: 'bg-blue-500 text-white',
      icon: TrendingUp,
      description: 'Google Maps Booking Funnel'
    },
    {
      id: 'compliance',
      label: 'Compliance & Audit',
      badge: 'GDPR / HIPAA',
      badgeColor: 'bg-emerald-600 text-white',
      icon: ShieldCheck,
      description: 'Immutable Audit & RLS'
    },
    {
      id: 'twilio',
      label: 'Twilio Message Center',
      icon: MessageSquareCode,
      description: 'Automated 2-Way SMS & Calls'
    },
    {
      id: 'patient_portal',
      label: 'Patient Portal',
      icon: UserCircle2,
      description: 'UK Patient Self-Service'
    }
  ];

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 overflow-x-auto scrollbar-none">
      <div className="flex items-center space-x-1.5 min-w-max py-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                isActive
                  ? 'bg-gradient-to-r from-nhs-blue to-teal-600 text-white shadow-lg shadow-nhs-blue/25 ring-1 ring-white/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
