import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StaffRotaTracker } from '../rota/StaffRotaTracker';
import { AppointmentScheduler } from '../scheduler/AppointmentScheduler';
import { ComplianceCenter } from '../compliance/ComplianceCenter';
import { TwilioMessageCenter } from '../twilio/TwilioMessageCenter';
import { PrescriptionRefills } from '../prescriptions/PrescriptionRefills';
import { SaaSSubscriptionSales } from '../gmb/SaaSSubscriptionSales';
import { HelpSupportView } from '../help/HelpSupportView';
import { UserProfileView } from '../profile/UserProfileView';
import { ClinicianAvailabilityView } from '../availability/ClinicianAvailabilityView';
import { AccountSettingsView } from '../settings/AccountSettingsView';
import {
  Users, CalendarDays, ShieldCheck, MessageSquare, Pill,
  CreditCard, TrendingUp, TrendingDown, BarChart3, Star,
  Clock, CheckCircle2, AlertCircle, ChevronRight, Plus,
  ArrowUpRight, Activity, DollarSign, Target, Award
} from 'lucide-react';

const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export const PracticeManagerDashboard: React.FC = () => {
  const {
    appointments, performanceMetrics, twilioLogs, refillRequests,
    doctors, patients, activeTab, setActiveTab
  } = useApp();
  const { currentUser } = useAuth();

  // Route sub-views
  if (activeTab === 'rota')          return <StaffRotaTracker />;
  if (activeTab === 'scheduler')     return <AppointmentScheduler />;
  if (activeTab === 'prescriptions') return <PrescriptionRefills />;
  if (activeTab === 'compliance')    return <ComplianceCenter />;
  if (activeTab === 'twilio')        return <TwilioMessageCenter />;
  if (activeTab === 'gmb_saas')      return <SaaSSubscriptionSales />;
  if (activeTab === 'help')          return <HelpSupportView />;
  if (activeTab === 'profile')       return <UserProfileView />;
  if (activeTab === 'availability')  return <ClinicianAvailabilityView />;
  if (activeTab === 'settings')      return <AccountSettingsView />;

  const totalPatientsSeen = performanceMetrics.reduce((acc, m) => acc + m.patientsSeen, 0);
  const avgSatisfaction = performanceMetrics.length > 0
    ? (performanceMetrics.reduce((acc, m) => acc + m.patientSatisfactionRate, 0) / performanceMetrics.length).toFixed(1)
    : '0';
  const pendingRefills = refillRequests.filter((r) => r.status === 'pending_review').length;
  const noShowRate = appointments.length > 0
    ? ((appointments.filter((a) => a.status === 'no_show').length / appointments.length) * 100).toFixed(1)
    : '0';
  const smsDelivered = twilioLogs.filter((l) => l.status === 'DELIVERED').length;
  const completedAppts = appointments.filter((a) => a.status === 'completed').length;

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  // Monthly revenue (mock data)
  const monthlyRevenue = [
    { month: 'Apr', value: 12400 }, { month: 'May', value: 15800 }, { month: 'Jun', value: 14200 },
    { month: 'Jul', value: 18600 }, { month: 'Aug', value: 17300 }, { month: 'Sep', value: 19250 },
  ];
  const maxRev = Math.max(...monthlyRevenue.map((m) => m.value));

  return (
    <div className="space-y-5">
      {/* ── Welcome ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
            {(currentUser?.name || 'PM').split(' ').map((n) => n[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {getGreeting()}, {currentUser?.name || 'Sarah Miller'}
            </h1>
            <p className="text-xs text-slate-500">
              Practice Manager · {currentUser?.clinicName || 'St. James Health Centre'} · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setActiveTab('rota')} className="flex items-center gap-2 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all">
            <Users className="w-3.5 h-3.5" /> Manage Rota
          </button>
          <button onClick={() => setActiveTab('compliance')} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-all">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Audit Logs
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-blue-50"><CalendarDays className="w-4 h-4 text-blue-600" /></div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold"><TrendingUp className="w-3 h-3" />+12%</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{appointments.length}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">{completedAppts} completed this month</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-emerald-50"><Star className="w-4 h-4 text-emerald-600" /></div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold"><TrendingUp className="w-3 h-3" />+2%</span>
          </div>
          <div className="text-2xl font-black text-emerald-700">{avgSatisfaction}%</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Patient satisfaction</p>
        </div>

        <div className={`bg-white border rounded-2xl p-4 shadow-sm ${pendingRefills > 0 ? 'border-amber-200' : 'border-slate-200'}`}>
          <div className="flex items-start justify-between mb-2">
            <div className={`p-2 rounded-xl ${pendingRefills > 0 ? 'bg-amber-50' : 'bg-slate-50'}`}>
              <Pill className={`w-4 h-4 ${pendingRefills > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Rx Queue</span>
          </div>
          <div className={`text-2xl font-black ${pendingRefills > 0 ? 'text-amber-700' : 'text-slate-900'}`}>{pendingRefills}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting sign-off</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-indigo-50"><Activity className="w-4 h-4 text-indigo-600" /></div>
            <span className={`flex items-center gap-1 text-[10px] font-bold ${parseFloat(noShowRate) > 10 ? 'text-red-600' : 'text-emerald-600'}`}>
              <TrendingDown className="w-3 h-3" /> {noShowRate}%
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{noShowRate}%</div>
          <p className="text-[11px] text-slate-500 mt-0.5">No-show rate</p>
        </div>
      </div>

      {/* ── Revenue + Performance Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Monthly Revenue</h2>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">£{monthlyRevenue[monthlyRevenue.length-1].value.toLocaleString()} Sep</span>
          </div>
          <div className="p-5">
            <div className="flex items-end justify-between gap-2 h-28">
              {monthlyRevenue.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-slate-500 font-bold">£{(m.value/1000).toFixed(1)}k</span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 transition-all"
                    style={{ height: `${(m.value / maxRev) * 72}px`, minHeight: '8px' }} />
                  <span className="text-[10px] text-slate-500 font-medium">{m.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
              <div className="text-center">
                <p className="text-[10px] text-slate-400">Total YTD</p>
                <p className="text-sm font-black text-slate-900">£97,550</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400">Recovered (no-show)</p>
                <p className="text-sm font-black text-emerald-700">£14,850</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400">Avg/month</p>
                <p className="text-sm font-black text-slate-900">£16,258</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Operations</h3>
          <div className="space-y-2">
            {[
              { label: 'Staff Rota & Performance', icon: <Users className="w-3.5 h-3.5" />, tab: 'rota', color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Master Appointment Schedule', icon: <CalendarDays className="w-3.5 h-3.5" />, tab: 'scheduler', color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Prescription Queue', icon: <Pill className="w-3.5 h-3.5" />, tab: 'prescriptions', color: 'text-amber-600', bg: 'bg-amber-50', badge: pendingRefills },
              { label: 'Audit & Compliance', icon: <ShieldCheck className="w-3.5 h-3.5" />, tab: 'compliance', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'SMS Communications', icon: <MessageSquare className="w-3.5 h-3.5" />, tab: 'twilio', color: 'text-indigo-600', bg: 'bg-indigo-50', badge: twilioLogs.length },
              { label: 'SaaS Subscription', icon: <CreditCard className="w-3.5 h-3.5" />, tab: 'gmb_saas', color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map((a) => (
              <button key={a.label} onClick={() => setActiveTab(a.tab)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group">
                <div className="flex items-center gap-2.5">
                  <span className={`p-1.5 rounded-lg ${a.bg} ${a.color}`}>{a.icon}</span>
                  <span className="text-xs font-semibold text-slate-700">{a.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {a.badge !== undefined && a.badge > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">{a.badge}</span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Doctor Performance Table ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Clinician Performance</h2>
          </div>
          <button onClick={() => setActiveTab('rota')} className="text-xs text-blue-600 font-semibold flex items-center gap-1">
            Full Rota <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-2.5 text-[10px] font-bold uppercase text-slate-400">Clinician</th>
                <th className="text-left px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400 hidden sm:table-cell">Specialty</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400">Patients/Day</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400 hidden md:table-cell">Rating</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400">Satisfaction</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400 hidden lg:table-cell">Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {doctors.map((doc) => {
                const pct = Math.round((doc.patientsToday / doc.dailyPatientCapacity) * 100);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={doc.avatar} alt={doc.name} className="w-7 h-7 rounded-xl object-cover shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 text-xs">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{doc.gmcNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className="text-[10px] font-medium text-slate-600 truncate block max-w-[140px]">{doc.specialty}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-xs font-bold text-slate-900">{doc.patientsToday}</span>
                      <span className="text-[10px] text-slate-400">/{doc.dailyPatientCapacity}</span>
                    </td>
                    <td className="px-3 py-3 text-center hidden md:table-cell">
                      <span className="text-xs font-bold text-amber-600">★ {doc.rating}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`text-xs font-bold ${doc.patientSatisfactionScore >= 95 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {doc.patientSatisfactionScore}%
                      </span>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct > 80 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium w-8">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom Row: Stats + Patients ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: patients.length.toString(), icon: <Users className="w-4 h-4 text-blue-500" />, bg: 'bg-blue-50', sub: `${patients.filter(p => p.intakeFormCompleted).length} with intake forms` },
          { label: 'SMS Delivered', value: smsDelivered.toString(), icon: <MessageSquare className="w-4 h-4 text-indigo-500" />, bg: 'bg-indigo-50', sub: `${twilioLogs.length} total dispatched` },
          { label: 'Total Visits', value: totalPatientsSeen.toString(), icon: <Activity className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-50', sub: 'This reporting period' },
          { label: 'Compliance Score', value: '94%', icon: <ShieldCheck className="w-4 h-4 text-purple-500" />, bg: 'bg-purple-50', sub: 'Last audit: Sept 2026' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${stat.bg} shrink-0`}>{stat.icon}</div>
            <div>
              <p className="text-xl font-black text-slate-900">{stat.value}</p>
              <p className="text-[10px] text-slate-500 font-medium">{stat.label}</p>
              <p className="text-[10px] text-slate-400">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
