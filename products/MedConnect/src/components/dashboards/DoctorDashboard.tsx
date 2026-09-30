import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AppointmentScheduler } from '../scheduler/AppointmentScheduler';
import { VideoConsultationRoom } from '../telemedicine/VideoConsultationRoom';
import { IntakeFormViewer } from '../intake/IntakeFormViewer';
import { PrescriptionRefills } from '../prescriptions/PrescriptionRefills';
import { AiTriageAssistant } from '../triage/AiTriageAssistant';
import { StaffRotaTracker } from '../rota/StaffRotaTracker';
import { ComplianceCenter } from '../compliance/ComplianceCenter';
import { DoctorCalendarView } from '../calendar/DoctorCalendarView';
import { HelpSupportView } from '../help/HelpSupportView';
import { UserProfileView } from '../profile/UserProfileView';
import { ClinicianAvailabilityView } from '../availability/ClinicianAvailabilityView';
import { AccountSettingsView } from '../settings/AccountSettingsView';
import {
  CalendarDays,
  Video,
  Pill,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PlayCircle,
  Phone,
  User,
  ChevronRight,
  FileText,
  MessageSquare,
  TrendingUp,
  Activity,
  Plus,
  Search,
  ArrowRight,
  CheckCheck,
  Stethoscope,
  RefreshCw,
  AlertTriangle,
  Circle
} from 'lucide-react';

// ─── Helpers ───────────────────────────────────────────────

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const getToday = () =>
  new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  scheduled:  { label: 'Scheduled',   color: 'bg-slate-100 text-slate-700',      dot: 'bg-slate-400' },
  confirmed:  { label: 'Confirmed',   color: 'bg-blue-100 text-blue-700',        dot: 'bg-blue-500' },
  in_progress:{ label: 'In Progress', color: 'bg-indigo-100 text-indigo-700',    dot: 'bg-indigo-500 animate-pulse' },
  completed:  { label: 'Completed',   color: 'bg-emerald-100 text-emerald-700',  dot: 'bg-emerald-500' },
  cancelled:  { label: 'Cancelled',   color: 'bg-rose-100 text-rose-700',        dot: 'bg-rose-500' },
  no_show:    { label: 'No-Show',     color: 'bg-red-100 text-red-700',          dot: 'bg-red-500' },
};

const modeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  in_person:         { label: 'In Person',   icon: <User className="w-3 h-3" />,    color: 'bg-blue-50 text-blue-700 border-blue-200' },
  video_consultation:{ label: 'Video Call',  icon: <Video className="w-3 h-3" />,   color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  phone:             { label: 'Phone',       icon: <Phone className="w-3 h-3" />,   color: 'bg-slate-50 text-slate-700 border-slate-200' },
};

const riskConfig: Record<string, { label: string; color: string }> = {
  low:      { label: 'Low Risk',      color: 'bg-emerald-50 text-emerald-700' },
  moderate: { label: 'Med. Risk',     color: 'bg-amber-50 text-amber-700' },
  high:     { label: 'High Risk',     color: 'bg-orange-50 text-orange-700' },
  critical: { label: 'Critical Risk', color: 'bg-red-50 text-red-700' },
};

// ─── Main Component ────────────────────────────────────────

export const DoctorDashboard: React.FC = () => {
  const {
    appointments, refillRequests, doctors, patients,
    currentDoctorId, activeTab, setActiveTab,
    updateAppointmentStatus, triggerTwilioReminder,
    setActiveTelehealthAppointment
  } = useApp();
  const { currentUser } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  const currentDoctor = doctors.find((d) => d.id === currentDoctorId) || doctors[0];

  // Filter appointments for this doctor
  const myAppointments = appointments
    .filter((a) => a.doctorId === currentDoctorId || !currentDoctorId)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const pendingRx = refillRequests.filter((r) => r.status === 'pending_review').length;
  const completedToday = myAppointments.filter((a) => a.status === 'completed').length;
  const remaining = myAppointments.filter(
    (a) => a.status !== 'completed' && a.status !== 'cancelled' && a.status !== 'no_show'
  ).length;

  // Next upcoming appointment (not completed/cancelled)
  const nextAppt = myAppointments.find(
    (a) => a.status !== 'completed' && a.status !== 'cancelled' && a.status !== 'no_show'
  );
  const nextPatient = nextAppt ? patients.find((p) => p.id === nextAppt.patientId) : null;

  // Attention items
  const attentionItems = [
    ...refillRequests.filter((r) => r.status === 'pending_review').slice(0, 2).map((r) => ({
      icon: <Pill className="w-3.5 h-3.5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-100',
      text: `Prescription refill: ${r.patientName}`,
      sub: r.medicationName,
      time: r.requestedDate,
      action: 'Review',
      onAction: () => setActiveTab('prescriptions'),
    })),
    ...myAppointments
      .filter((a) => (a.mlPrediction?.riskLevel === 'high' || a.mlPrediction?.riskLevel === 'critical') && a.status !== 'completed')
      .slice(0, 2)
      .map((a) => ({
        icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />,
        bg: 'bg-orange-50 border-orange-100',
        text: `Attendance risk: ${a.patientName}`,
        sub: `${formatTime(a.dateTime)} — ${riskConfig[a.mlPrediction.riskLevel]?.label}`,
        time: formatDate(a.dateTime),
        action: 'Remind',
        onAction: () => triggerTwilioReminder(a.id, 'urgent_confirmation'),
      })),
    ...patients.filter((p) => !p.intakeFormCompleted).slice(0, 1).map((p) => ({
      icon: <FileText className="w-3.5 h-3.5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
      text: `Incomplete intake form`,
      sub: `${p.firstName} ${p.lastName}`,
      time: 'Pending',
      action: 'View',
      onAction: () => setActiveTab('intake'),
    })),
  ].slice(0, 4);

  // Search results
  const searchResults = searchQ.trim().length > 1
    ? patients.filter((p) =>
        `${p.firstName} ${p.lastName} ${p.nhsNumber}`.toLowerCase().includes(searchQ.toLowerCase())
      ).slice(0, 5)
    : [];

  // ── SUB-VIEWS for non-home tabs ────────────────────────────
  if (activeTab === 'calendar')      return <DoctorCalendarView />;
  if (activeTab === 'telehealth')    return <VideoConsultationRoom />;
  if (activeTab === 'intake')        return <IntakeFormViewer />;
  if (activeTab === 'prescriptions') return <PrescriptionRefills />;
  if (activeTab === 'ai_triage')     return <AiTriageAssistant />;
  if (activeTab === 'rota')          return <StaffRotaTracker />;
  if (activeTab === 'compliance')    return <ComplianceCenter />;
  if (activeTab === 'scheduler')     return <AppointmentScheduler />;
  if (activeTab === 'help')          return <HelpSupportView />;
  if (activeTab === 'profile')       return <UserProfileView />;
  if (activeTab === 'availability')  return <ClinicianAvailabilityView />;
  if (activeTab === 'settings')      return <AccountSettingsView />;

  // ── MAIN DASHBOARD HOME ────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Welcome Bar ─────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {currentDoctor.avatar && (
            <img
              src={currentDoctor.avatar}
              alt={currentDoctor.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-100 shrink-0"
            />
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              {getGreeting()}, {currentUser?.name?.split(' ').slice(0, 3).join(' ') || currentDoctor.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentDoctor.specialty} &nbsp;·&nbsp; St. James Health Centre &nbsp;·&nbsp; {getToday()}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active session
        </span>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Appointments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-xl bg-blue-50">
              <CalendarDays className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Today</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{currentDoctor.patientsToday}</div>
          <p className="text-xs text-slate-500 mt-1">
            {remaining} remaining &nbsp;·&nbsp; {completedToday} done
          </p>
        </div>

        {/* Next Patient */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-xl bg-indigo-50">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Next</span>
          </div>
          {nextAppt ? (
            <>
              <div className="text-sm font-bold text-slate-900 truncate">{nextAppt.patientName}</div>
              <p className="text-xs text-slate-500 mt-1">
                {formatTime(nextAppt.dateTime)} &nbsp;·&nbsp; {modeConfig[nextAppt.mode]?.label}
              </p>
            </>
          ) : (
            <div className="text-sm font-medium text-slate-400">No upcoming</div>
          )}
        </div>

        {/* Pending Prescriptions */}
        <div className={`bg-white border rounded-2xl p-4 shadow-sm ${pendingRx > 0 ? 'border-amber-200' : 'border-slate-200'}`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-xl ${pendingRx > 0 ? 'bg-amber-50' : 'bg-slate-50'}`}>
              <Pill className={`w-4 h-4 ${pendingRx > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
            </div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Rx</span>
          </div>
          <div className={`text-2xl font-black ${pendingRx > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
            {pendingRx}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {pendingRx > 0 ? 'Needs your review' : 'All up to date'}
          </p>
        </div>

        {/* Patient Satisfaction */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-xl bg-emerald-50">
              <Star className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">CSAT</span>
          </div>
          <div className="text-2xl font-black text-emerald-700">{currentDoctor.patientSatisfactionScore}%</div>
          <p className="text-xs text-slate-500 mt-1">
            {currentDoctor.rating}/5 &nbsp;·&nbsp; {currentDoctor.totalReviews} reviews
          </p>
        </div>
      </div>

      {/* ── Quick Actions ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={() => setActiveTab('scheduler')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New Appointment
        </button>
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-sm transition-all"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          Search Patient
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-sm transition-all"
        >
          <Pill className="w-3.5 h-3.5 text-amber-500" />
          Prescription Requests
          {pendingRx > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {pendingRx}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('telehealth')}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-sm transition-all"
        >
          <Video className="w-3.5 h-3.5 text-indigo-500" />
          Start Consultation
        </button>
      </div>

      {/* ── Search Patient Modal ─────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-start justify-center pt-20 px-4" onClick={() => setSearchOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  autoFocus
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search by name, NHS number..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <div className="p-2 max-h-72 overflow-y-auto">
              {searchResults.length > 0 ? searchResults.map((p) => (
                <button
                  key={p.id}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors"
                  onClick={() => { setSearchOpen(false); setSearchQ(''); }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {p.firstName[0]}{p.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{p.firstName} {p.lastName}</p>
                    <p className="text-xs text-slate-500">NHS {p.nhsNumber} · {p.medicalConditions[0] || 'No conditions'}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 ml-auto" />
                </button>
              )) : searchQ.length > 1 ? (
                <p className="text-center py-6 text-sm text-slate-400">No patients found for "{searchQ}"</p>
              ) : (
                <p className="text-center py-6 text-sm text-slate-400">Type to search patients...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Two-Column Content ──────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── LEFT: Schedule + Recent Patients ── */}
        <div className="xl:col-span-2 space-y-5">

          {/* Today's Schedule */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Today's Schedule</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                  {myAppointments.length}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('scheduler')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                Full Schedule <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myAppointments.length === 0 ? (
              <div className="py-12 text-center">
                <CalendarDays className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-400">Your schedule is clear today</p>
                <p className="text-xs text-slate-400 mt-1">No appointments scheduled</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {myAppointments.map((appt) => {
                  const status = statusConfig[appt.status] || statusConfig.scheduled;
                  const mode = modeConfig[appt.mode] || modeConfig.in_person;
                  const risk = appt.mlPrediction?.riskLevel;
                  const showRisk = risk === 'moderate' || risk === 'high' || risk === 'critical';
                  const smsDelivered = appt.twilioRemindersSent?.some((r) => r.status === 'delivered');

                  return (
                    <div
                      key={appt.id}
                      className={`flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors ${
                        appt.status === 'in_progress' ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      {/* Time */}
                      <div className="w-14 shrink-0 text-center">
                        <span className="text-xs font-bold text-slate-700 block">{formatTime(appt.dateTime)}</span>
                        <span className="text-[10px] text-slate-400">{appt.durationMinutes}m</span>
                      </div>

                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {appt.patientName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 truncate">{appt.patientName}</span>
                          {appt.intakeFormAttached && (
                            <span title="Intake form submitted">
                              <FileText className="w-3 h-3 text-emerald-500" />
                            </span>
                          )}
                          {smsDelivered && (
                            <span title="SMS reminder sent">
                              <CheckCheck className="w-3 h-3 text-blue-400" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{appt.reasonForVisit}</p>
                      </div>

                      {/* Badges */}
                      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${mode.color}`}>
                          {mode.icon} {mode.label}
                        </span>
                        {showRisk && (
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${riskConfig[risk].color}`}>
                            {riskConfig[risk].label}
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>

                        {/* Action */}
                        {appt.status === 'completed' ? (
                          <button
                            className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition-colors whitespace-nowrap"
                            onClick={() => setActiveTab('intake')}
                          >
                            Notes
                          </button>
                        ) : appt.mode === 'video_consultation' ? (
                          <button
                            className="text-[10px] px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors whitespace-nowrap flex items-center gap-1"
                            onClick={() => {
                              setActiveTelehealthAppointment(appt);
                              setActiveTab('telehealth');
                            }}
                          >
                            <Video className="w-3 h-3" /> Join
                          </button>
                        ) : (
                          <button
                            className="text-[10px] px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors whitespace-nowrap"
                            onClick={() => updateAppointmentStatus(appt.id, 'in_progress')}
                          >
                            Start
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Patients */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Recent Patients</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-2.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Patient</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider hidden md:table-cell">NHS Number</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider hidden lg:table-cell">Condition</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Intake Form</th>
                    <th className="text-right px-5 py-2.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {patients.slice(0, 5).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {p.firstName[0]}{p.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{p.firstName} {p.lastName}</p>
                            <p className="text-[10px] text-slate-400">
                              {new Date().getFullYear() - parseInt(p.dob.split('-')[0])} yrs · {p.gender}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-500 font-mono text-[10px] hidden md:table-cell">{p.nhsNumber}</td>
                      <td className="px-3 py-3 hidden lg:table-cell">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {p.medicalConditions[0] || 'No conditions'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {p.intakeFormCompleted ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Done
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                            <AlertCircle className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[10px] font-semibold transition-colors"
                          onClick={() => setActiveTab('intake')}
                        >
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

        {/* ── RIGHT: Next Patient + Attention + Stats ── */}
        <div className="space-y-5">

          {/* Next Patient Card */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-blue-600 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Next Patient</span>
              {nextAppt?.mode === 'video_consultation' && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ready to join
                </span>
              )}
            </div>

            {nextAppt && nextPatient ? (
              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
                    {nextPatient.firstName[0]}{nextPatient.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {nextPatient.firstName} {nextPatient.lastName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {formatTime(nextAppt.dateTime)} &nbsp;·&nbsp; {modeConfig[nextAppt.mode]?.label}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      NHS {nextPatient.nhsNumber}
                    </p>
                  </div>
                </div>

                {/* Patient details */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-slate-400 mb-0.5">Intake Form</p>
                    <p className={`font-bold ${nextPatient.intakeFormCompleted ? 'text-emerald-700' : 'text-amber-600'}`}>
                      {nextPatient.intakeFormCompleted ? '✓ Completed' : '⚠ Incomplete'}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-slate-400 mb-0.5">Active Rx</p>
                    <p className="font-bold text-slate-700">{nextPatient.activePrescriptionsCount}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-slate-400 mb-0.5">Allergies</p>
                    <p className="font-bold text-slate-700 truncate">{nextPatient.allergies[0] || 'None known'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-slate-400 mb-0.5">Reason</p>
                    <p className="font-bold text-slate-700 truncate">{nextAppt.reasonForVisit}</p>
                  </div>
                </div>

                {/* SMS status */}
                {nextAppt.twilioRemindersSent?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5">
                    <CheckCheck className="w-3 h-3" />
                    SMS reminder delivered
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setActiveTab('intake')}
                  >
                    Open Patient
                  </button>
                  <button
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    onClick={() => {
                      setActiveTelehealthAppointment(nextAppt);
                      setActiveTab('telehealth');
                    }}
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    Start
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No upcoming patients</p>
              </div>
            )}
          </div>

          {/* Requires Attention */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <h2 className="text-sm font-bold text-slate-900">Requires Attention</h2>
              {attentionItems.length > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">
                  {attentionItems.length}
                </span>
              )}
            </div>

            {attentionItems.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">All clear — nothing needs attention</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {attentionItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50/50 transition-colors">
                    <span className={`mt-0.5 p-1.5 rounded-lg border shrink-0 ${item.bg}`}>
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{item.text}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
                    </div>
                    <button
                      onClick={item.onAction}
                      className="shrink-0 text-[10px] px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-semibold transition-colors"
                    >
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 space-y-3">
            <h2 className="text-xs font-bold text-slate-900">Today's Overview</h2>
            <div className="space-y-2">
              {[
                {
                  label: "Patient load",
                  value: `${currentDoctor.patientsToday} / ${currentDoctor.dailyPatientCapacity}`,
                  pct: Math.round((currentDoctor.patientsToday / currentDoctor.dailyPatientCapacity) * 100),
                  color: 'bg-blue-500',
                },
                {
                  label: "Avg. consultation",
                  value: `${currentDoctor.averageConsultationMinutes} min`,
                  pct: Math.min(100, Math.round((currentDoctor.averageConsultationMinutes / 20) * 100)),
                  color: 'bg-indigo-400',
                },
                {
                  label: "Satisfaction score",
                  value: `${currentDoctor.patientSatisfactionScore}%`,
                  pct: currentDoctor.patientSatisfactionScore,
                  color: 'bg-emerald-500',
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-500 font-medium">{stat.label}</span>
                    <span className="text-slate-700 font-bold">{stat.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stat.color} rounded-full`}
                      style={{ width: `${stat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
