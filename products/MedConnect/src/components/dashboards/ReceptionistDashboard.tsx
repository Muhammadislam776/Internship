import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AppointmentScheduler } from '../scheduler/AppointmentScheduler';
import { TwilioMessageCenter } from '../twilio/TwilioMessageCenter';
import { StaffRotaTracker } from '../rota/StaffRotaTracker';
import { AiTriageAssistant } from '../triage/AiTriageAssistant';
import { GmbBookingWidget } from '../gmb/GmbBookingWidget';
import { HelpSupportView } from '../help/HelpSupportView';
import { UserProfileView } from '../profile/UserProfileView';
import { ClinicianAvailabilityView } from '../availability/ClinicianAvailabilityView';
import { AccountSettingsView } from '../settings/AccountSettingsView';
import {
  CalendarDays, Phone, Users, Globe, Stethoscope,
  CheckCircle2, AlertCircle, Clock, MessageSquare,
  ChevronRight, Plus, Search, Video, User,
  ArrowUpRight, TrendingUp, RefreshCw, Bell
} from 'lucide-react';

const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export const ReceptionistDashboard: React.FC = () => {
  const { appointments, twilioLogs, patients, doctors, activeTab, setActiveTab, updateAppointmentStatus } = useApp();
  const { currentUser } = useAuth();

  // Route sub-views
  if (activeTab === 'scheduler') return <AppointmentScheduler />;
  if (activeTab === 'twilio')    return <TwilioMessageCenter />;
  if (activeTab === 'gmb_saas') return <GmbBookingWidget />;
  if (activeTab === 'rota')      return <StaffRotaTracker />;
  if (activeTab === 'triage')    return <AiTriageAssistant />;
  if (activeTab === 'help')      return <HelpSupportView />;
  if (activeTab === 'profile')       return <UserProfileView />;
  if (activeTab === 'availability')  return <ClinicianAvailabilityView />;
  if (activeTab === 'settings')      return <AccountSettingsView />;

  const today = new Date().toDateString();
  const todayAppts = appointments.filter((a) => new Date(a.dateTime).toDateString() === today);
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const waiting = appointments.filter((a) => a.status === 'scheduled').length;
  const smsDelivered = twilioLogs.filter((l) => l.status === 'DELIVERED').length;
  const noShows = appointments.filter((a) => a.status === 'no_show').length;

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const statusColor: Record<string, string> = {
    scheduled:  'bg-blue-100 text-blue-700',
    confirmed:  'bg-emerald-100 text-emerald-700',
    in_progress:'bg-indigo-100 text-indigo-700',
    completed:  'bg-slate-100 text-slate-600',
    cancelled:  'bg-rose-100 text-rose-700',
    no_show:    'bg-red-100 text-red-700',
  };
  const statusLabel: Record<string, string> = {
    scheduled: 'Waiting', confirmed: 'Confirmed', in_progress: 'With Doctor',
    completed: 'Completed', cancelled: 'Cancelled', no_show: 'No-Show',
  };

  // Queue (non-completed today)
  const queue = todayAppts
    .filter((a) => a.status !== 'completed' && a.status !== 'cancelled' && a.status !== 'no_show')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  // Recent SMS logs
  const recentSms = twilioLogs.slice(0, 4);

  return (
    <div className="space-y-5">
      {/* ── Welcome ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
            {(currentUser?.name || 'HC').split(' ').map((n) => n[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {getGreeting()}, {currentUser?.name || 'Hannah Collins'}
            </h1>
            <p className="text-xs text-slate-500">
              Reception · {currentUser?.clinicName || 'St. James Health Centre'} · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab('scheduler')} className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all">
            <Plus className="w-3.5 h-3.5" /> New Booking
          </button>
          <button onClick={() => setActiveTab('twilio')} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-all">
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Send SMS
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-blue-50"><CalendarDays className="w-4 h-4 text-blue-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Today</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{todayAppts.length}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">{queue.length} remaining in queue</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-emerald-50"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Confirmed</span>
          </div>
          <div className="text-2xl font-black text-emerald-700">{confirmed}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">SMS confirmed</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-indigo-50"><MessageSquare className="w-4 h-4 text-indigo-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">SMS</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{smsDelivered}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Reminders delivered</p>
        </div>

        <div className={`bg-white border rounded-2xl p-4 shadow-sm ${noShows > 0 ? 'border-red-200' : 'border-slate-200'}`}>
          <div className="flex items-start justify-between mb-2">
            <div className={`p-2 rounded-xl ${noShows > 0 ? 'bg-red-50' : 'bg-slate-50'}`}>
              <AlertCircle className={`w-4 h-4 ${noShows > 0 ? 'text-red-500' : 'text-slate-400'}`} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">No-Shows</span>
          </div>
          <div className={`text-2xl font-black ${noShows > 0 ? 'text-red-700' : 'text-slate-900'}`}>{noShows}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Missed appointments</p>
        </div>
      </div>

      {/* ── Main Two Column ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* LEFT: Queue + Today's Appointments */}
        <div className="xl:col-span-2 space-y-5">
          {/* Patient Queue */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">Live Queue</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">{queue.length} waiting</span>
              </div>
              <button onClick={() => setActiveTab('scheduler')} className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                Full Schedule <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {queue.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">Queue is clear</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {queue.map((appt, idx) => {
                  const doctor = doctors.find((d) => d.id === appt.doctorId);
                  return (
                    <div key={appt.id} className={`flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors ${idx === 0 ? 'bg-blue-50/30' : ''}`}>
                      {/* Position */}
                      <div className={`w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {idx + 1}
                      </div>
                      {/* Time */}
                      <div className="w-12 text-center shrink-0">
                        <p className="text-xs font-bold text-slate-700">{formatTime(appt.dateTime)}</p>
                      </div>
                      {/* Patient */}
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {appt.patientName.split(' ').map((n) => n[0]).join('').slice(0,2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{appt.patientName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{appt.reasonForVisit} · {doctor?.name || appt.doctorName}</p>
                      </div>
                      {/* Mode */}
                      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${appt.mode === 'video_consultation' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                          {appt.mode === 'video_consultation' ? <><Video className="w-3 h-3" /> Video</> : <><User className="w-3 h-3" /> In Person</>}
                        </span>
                      </div>
                      {/* Status */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${statusColor[appt.status]}`}>
                        {statusLabel[appt.status] || appt.status}
                      </span>
                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, 'in_progress')}
                          className="text-[10px] px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                        >
                          Check In
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appt.id, 'no_show')}
                          className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-semibold transition-colors"
                        >
                          No-Show
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* All Today's Appointments */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Today's Full Schedule</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-2.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Time</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Patient</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider hidden md:table-cell">Doctor</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Type</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Status</th>
                    <th className="text-right px-5 py-2.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {appointments.slice(0, 8).map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs font-bold text-slate-700">{formatTime(appt.dateTime)}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {appt.patientName.split(' ').map((n) => n[0]).join('').slice(0,2)}
                          </div>
                          <span className="font-semibold text-slate-900 truncate max-w-[100px]">{appt.patientName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-500 hidden md:table-cell truncate max-w-[120px]">{appt.doctorName}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${appt.mode === 'video_consultation' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                          {appt.mode === 'video_consultation' ? 'Video' : appt.mode === 'phone' ? 'Phone' : 'In Person'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${statusColor[appt.status]}`}>
                          {statusLabel[appt.status] || appt.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => setActiveTab('scheduler')} className="text-[10px] px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition-colors">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: SMS Logs + Doctors on Duty + Quick Actions */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Actions</h3>
            {[
              { label: 'New Appointment', icon: <Plus className="w-3.5 h-3.5" />, color: 'bg-blue-600 text-white hover:bg-blue-700', tab: 'scheduler' },
              { label: 'Send SMS Reminder', icon: <MessageSquare className="w-3.5 h-3.5" />, color: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50', tab: 'twilio' },
              { label: 'Online Booking', icon: <Globe className="w-3.5 h-3.5" />, color: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50', tab: 'gmb_saas' },
              { label: 'Walk-In Triage', icon: <Stethoscope className="w-3.5 h-3.5" />, color: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50', tab: 'triage' },
              { label: 'Staff Rota', icon: <Users className="w-3.5 h-3.5" />, color: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50', tab: 'rota' },
            ].map((a) => (
              <button key={a.label} onClick={() => setActiveTab(a.tab)} className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${a.color}`}>
                {a.icon} {a.label}
              </button>
            ))}
          </div>

          {/* Doctors on Duty */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Doctors on Duty</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {doctors.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 px-4 py-3">
                  <img src={doc.avatar} alt={doc.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{doc.name}</p>
                    <p className="text-[10px] text-slate-500">{doc.patientsToday}/{doc.dailyPatientCapacity} today</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${doc.patientsToday < doc.dailyPatientCapacity ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent SMS Activity */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900">Recent SMS</h3>
              </div>
              <button onClick={() => setActiveTab('twilio')} className="text-xs text-blue-600 font-semibold">All →</button>
            </div>
            {recentSms.length === 0 ? (
              <div className="p-4 text-center"><p className="text-xs text-slate-400">No messages sent</p></div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentSms.map((log) => (
                  <div key={log.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900 truncate flex-1">{log.recipientName}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${log.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {log.status === 'DELIVERED' ? '✓' : '?'} {log.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{log.message}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{log.recipientPhone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
