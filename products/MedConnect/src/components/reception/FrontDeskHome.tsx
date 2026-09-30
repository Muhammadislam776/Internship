import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Appointment, Patient } from '../../types';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  UserCheck,
  Send,
  Video,
  User,
  Phone,
  Bell,
  Sparkles,
  ArrowUpRight,
  MoreVertical,
  ChevronRight,
  Volume2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { NewBookingModal } from './NewBookingModal';
import { WalkInModal } from './WalkInModal';
import { RescheduleCancelModal } from './RescheduleCancelModal';

export const FrontDeskHome: React.FC = () => {
  const {
    appointments,
    patients,
    doctors,
    twilioLogs,
    setActiveTab,
    updateAppointmentStatus,
    triggerTwilioReminder,
    showToast
  } = useApp();
  const { currentUser } = useAuth();

  // Modals state
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [modalAppt, setModalAppt] = useState<Appointment | null>(null);
  const [modalMode, setModalMode] = useState<'reschedule' | 'cancel'>('reschedule');
  const [isRescheduleCancelOpen, setIsRescheduleCancelOpen] = useState(false);

  // Table filter & search
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked_in' | 'waiting' | 'attention' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Doctor Delay state
  const [isDoctorDelayNotifying, setIsDoctorDelayNotifying] = useState(false);

  // Time format helper
  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };

  const todayStr = new Date().toDateString();
  const todayAppts = appointments.filter((a) => new Date(a.dateTime).toDateString() === todayStr);

  // KPI Calculations
  const totalToday = todayAppts.length;
  const completedToday = todayAppts.filter((a) => a.status === 'completed').length;
  
  // Waiting patients: status in_progress (checked in to waiting room) or scheduled without arrival
  const waitingPatients = todayAppts.filter((a) => a.status === 'in_progress');
  const waitingOver15 = waitingPatients.filter((a) => {
    const diffMins = Math.floor((Date.now() - new Date(a.dateTime).getTime()) / 60000);
    return diffMins > 15;
  }).length;

  const checkedInCount = todayAppts.filter((a) => a.status === 'in_progress' || a.status === 'completed').length;
  const checkedInPercentage = totalToday > 0 ? Math.round((checkedInCount / totalToday) * 100) : 0;

  // Actions required: late arrivals, no-shows, high risk without confirmation
  const actionsRequired = todayAppts.filter(
    (a) => a.status === 'no_show' || (a.status === 'scheduled' && a.mlPrediction?.riskLevel === 'high') || waitingOver15 > 0
  ).length;

  // Status badges & text
  const statusConfig: Record<string, { label: string; badge: string }> = {
    scheduled: { label: 'Confirmed', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    confirmed: { label: 'Confirmed', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    in_progress: { label: 'Checked In / Waiting', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
    completed: { label: 'Completed', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
    cancelled: { label: 'Cancelled', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
    no_show: { label: 'No-Show', badge: 'bg-red-50 text-red-700 border-red-200' },
  };

  // Filter today's appointments
  const filteredAppointments = todayAppts.filter((appt) => {
    // Search query
    const matchSearch =
      appt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.patientNhsNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.reasonForVisit.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (statusFilter === 'checked_in') return appt.status === 'in_progress';
    if (statusFilter === 'waiting') return appt.status === 'in_progress' || appt.status === 'scheduled';
    if (statusFilter === 'attention') return appt.status === 'no_show' || (appt.mlPrediction?.riskLevel === 'high' && appt.status !== 'completed');
    if (statusFilter === 'completed') return appt.status === 'completed';
    return true;
  }).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  // Call patient action
  const handleCallPatient = (appt: Appointment) => {
    const doc = doctors.find((d) => d.id === appt.doctorId);
    const room = doc?.roomNumber || 'Consultation Room';
    showToast('info', `Patient Called to Room ${room}`, `Announced ${appt.patientName} to proceed to Room ${room} for ${doc?.name || 'Doctor'}.`);
  };

  // Check In action
  const handleCheckIn = (apptId: string, name: string) => {
    updateAppointmentStatus(apptId, 'in_progress');
    showToast('success', 'Patient Checked In', `${name} has arrived and is placed in the waiting room.`);
  };

  // Notify patients for doctor delay
  const handleNotifyDoctorDelay = async () => {
    setIsDoctorDelayNotifying(true);
    try {
      const affected = todayAppts.filter((a) => a.doctorId === 'doc_1' && a.status !== 'completed');
      for (const a of affected) {
        await triggerTwilioReminder(a.id, 'standard_reminder');
      }
      showToast('success', 'SMS Broadcast Sent', `Notified ${affected.length} patients that Dr. Jenkins is delayed by 15 minutes.`);
    } catch (e) {
      console.error(e);
      showToast('error', 'Broadcast Failed', 'Could not dispatch delay notifications.');
    } finally {
      setIsDoctorDelayNotifying(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* ── 1. Compact Welcome Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
            {(currentUser?.name || 'HC')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {getGreeting()}, {currentUser?.name || 'Hannah Collins'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Front Desk · {currentUser?.clinicName || 'St. James Health Centre'} ·{' '}
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Clinic Online · Front Desk Active
          </span>
        </div>
      </div>

      {/* ── 2. KPI Cards (4 Operational Metrics) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Today's Appointments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-blue-50">
              <CalendarDays className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalToday}</div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{completedToday} completed so far</p>
        </div>

        {/* Metric 2: Waiting Patients */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-amber-50">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Waiting</span>
          </div>
          <div className="text-2xl font-black text-amber-700">{waitingPatients.length}</div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            {waitingOver15 > 0 ? (
              <span className="text-amber-700 font-semibold">{waitingOver15} waiting &gt; 15 min</span>
            ) : (
              'All waiting &lt; 15 min'
            )}
          </p>
        </div>

        {/* Metric 3: Checked In */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-emerald-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arrivals</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{checkedInCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{checkedInPercentage}% of today's visits</p>
        </div>

        {/* Metric 4: Actions Required */}
        <div
          className={`bg-white border rounded-2xl p-4 shadow-xs transition-all ${
            actionsRequired > 0 ? 'border-orange-300 ring-2 ring-orange-50' : 'border-slate-200'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className={`p-2 rounded-xl ${actionsRequired > 0 ? 'bg-orange-50' : 'bg-slate-50'}`}>
              <AlertCircle className={`w-4 h-4 ${actionsRequired > 0 ? 'text-orange-600' : 'text-slate-400'}`} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attention</span>
          </div>
          <div className={`text-2xl font-black ${actionsRequired > 0 ? 'text-orange-600' : 'text-slate-900'}`}>
            {actionsRequired}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            {actionsRequired > 0 ? 'Needs front-desk action' : 'All running on schedule'}
          </p>
        </div>
      </div>

      {/* ── 3. Quick Actions Bar ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick Operational Actions</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Action */}
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            + New Booking
          </button>

          {/* Secondary Action 1: Check In Patient */}
          <button
            onClick={() => setActiveTab('reception_checkin')}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-xs transition-all shrink-0"
          >
            <UserCheck className="w-4 h-4" />
            Check In Patient
          </button>

          {/* Secondary Action 2: Find Patient */}
          <button
            onClick={() => setActiveTab('reception_patients')}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl shadow-xs transition-all shrink-0"
          >
            <Search className="w-4 h-4 text-slate-400" />
            Find Patient
          </button>

          {/* Secondary Action 3: Walk-in Patient */}
          <button
            onClick={() => setIsWalkInOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl shadow-xs transition-all shrink-0"
          >
            <User className="w-4 h-4 text-orange-500" />
            Walk-in Patient
          </button>

          {/* Secondary Action 4: Send Reminder */}
          <button
            onClick={() => setActiveTab('reception_reminders')}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl shadow-xs transition-all shrink-0"
          >
            <Send className="w-4 h-4 text-blue-500" />
            Send Reminder
          </button>
        </div>
      </div>

      {/* ── 4. Main Two Column Grid (Appointments + Live Waiting & Alerts) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* ── LEFT: Today's Appointments (Largest Section) ── */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            {/* Table Header & Controls */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  Today's Appointments
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {filteredAppointments.length}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Live clinic schedule, check-in states and desk actions</p>
              </div>

              {/* Table search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter patient, NHS, doctor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
              {[
                { id: 'all', label: `All (${todayAppts.length})` },
                { id: 'checked_in', label: `Checked In (${waitingPatients.length})` },
                { id: 'waiting', label: `Waiting Room (${waitingPatients.length})` },
                { id: 'attention', label: `Attention Needed (${actionsRequired})` },
                { id: 'completed', label: `Completed (${completedToday})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition-colors ${
                    statusFilter === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Table or Responsive List */}
            {filteredAppointments.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No appointments found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting the filter or search term</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                      <th className="px-4 py-3">Time</th>
                      <th className="px-3 py-3">Patient</th>
                      <th className="px-3 py-3 hidden md:table-cell">Clinician</th>
                      <th className="px-3 py-3">Type</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Desk Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.map((appt) => {
                      const doctor = doctors.find((d) => d.id === appt.doctorId);
                      const isWaiting = appt.status === 'in_progress';
                      const isConfirmed = appt.status === 'confirmed' || appt.status === 'scheduled';
                      const isCompleted = appt.status === 'completed';

                      return (
                        <tr key={appt.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Time */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="font-mono text-xs font-bold text-slate-900 block">
                              {formatTime(appt.dateTime)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">15 min</span>
                          </td>

                          {/* Patient */}
                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                {appt.patientName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate max-w-[130px]">{appt.patientName}</p>
                                <p className="text-[10px] text-slate-500 font-mono">NHS {appt.patientNhsNumber}</p>
                              </div>
                            </div>
                          </td>

                          {/* Clinician */}
                          <td className="px-3 py-3.5 hidden md:table-cell">
                            <p className="font-semibold text-slate-800 truncate max-w-[130px]">
                              {doctor?.name || appt.doctorName}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {doctor?.specialty} · Room {doctor?.roomNumber}
                            </p>
                          </td>

                          {/* Appointment Type */}
                          <td className="px-3 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${
                                appt.mode === 'video_consultation'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  : 'bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              {appt.mode === 'video_consultation' ? (
                                <>
                                  <Video className="w-3 h-3" /> Video
                                </>
                              ) : (
                                <>
                                  <User className="w-3 h-3" /> In Person
                                </>
                              )}
                            </span>
                            <p className="text-[10px] text-slate-500 truncate max-w-[120px] mt-0.5">
                              {appt.reasonForVisit}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-bold px-2 py-1 rounded-lg border inline-block ${
                                statusConfig[appt.status]?.badge || 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {statusConfig[appt.status]?.label || appt.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Check In Button */}
                              {isConfirmed && (
                                <button
                                  onClick={() => handleCheckIn(appt.id, appt.patientName)}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow-xs transition-colors"
                                >
                                  Check In
                                </button>
                              )}

                              {/* Call Patient Button */}
                              {isWaiting && (
                                <button
                                  onClick={() => handleCallPatient(appt)}
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                                >
                                  <Volume2 className="w-3 h-3" />
                                  Call
                                </button>
                              )}

                              {/* Reschedule Button */}
                              {!isCompleted && appt.status !== 'cancelled' && (
                                <button
                                  onClick={() => {
                                    setModalAppt(appt);
                                    setModalMode('reschedule');
                                    setIsRescheduleCancelOpen(true);
                                  }}
                                  className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-[10px] rounded-lg transition-colors"
                                >
                                  Reschedule
                                </button>
                              )}

                              {/* Cancel Button */}
                              {!isCompleted && appt.status !== 'cancelled' && (
                                <button
                                  onClick={() => {
                                    setModalAppt(appt);
                                    setModalMode('cancel');
                                    setIsRescheduleCancelOpen(true);
                                  }}
                                  className="px-1.5 py-1 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors text-[10px]"
                                  title="Cancel Appointment"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── 5. Quiet Smart Scheduling & No-Show Decision Support ── */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">Attendance Decision Support</h3>
                <span className="text-[10px] text-slate-500 font-medium">(No automated changes applied)</span>
              </div>
              <button
                onClick={() => setActiveTab('reception_noshow')}
                className="text-[11px] text-blue-600 font-bold hover:underline"
              >
                View Full Insights →
              </button>
            </div>
            <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
              Based on historical attendance telemetry, the following patient has an elevated risk of late arrival or non-attendance today. Front desk staff can proactively verify attendance:
            </p>

            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900">David Clarke · 15:30 General Consultation</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Reason: 2 prior missed appointments in the past 6 months · Lead time &gt; 10 days
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast('success', 'SMS Confirmation Sent', 'Sent priority reminder SMS to David Clarke (+44 7700 900342).');
                  }}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] rounded-lg transition-colors"
                >
                  Send Verification SMS
                </button>
                <button
                  onClick={() => {
                    showToast('info', 'Desk Note Logged', 'Flagged for receptionist phone confirmation at 13:00.');
                  }}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] rounded-lg transition-colors"
                >
                  Flag for Call
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Waiting Room Widget & Front Desk Alerts ── */}
        <div className="space-y-4">
          {/* Waiting Room Widget */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900">Live Waiting Patients</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold">
                  {waitingPatients.length}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('reception_waiting')}
                className="text-[11px] text-blue-600 font-bold hover:underline"
              >
                Waiting Room →
              </button>
            </div>

            {waitingPatients.length === 0 ? (
              <div className="p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-700">Waiting room is clear</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No checked-in patients in queue</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {waitingPatients.map((p, idx) => {
                  const doc = doctors.find((d) => d.id === p.doctorId);
                  // Simulated wait minutes: 12 + idx * 8
                  const waitMinutes = 10 + idx * 7;
                  const isLongWait = waitMinutes > 15;

                  return (
                    <div key={p.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{p.patientName}</p>
                            <p className="text-[10px] text-slate-500">
                              {doc?.name} · Room {doc?.roomNumber}
                            </p>
                          </div>
                        </div>

                        {/* Call action */}
                        <button
                          onClick={() => handleCallPatient(p)}
                          className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Volume2 className="w-3 h-3" /> Call
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-md ${
                            isLongWait ? 'bg-rose-50 text-rose-700 font-bold' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          Waiting {waitMinutes} min {isLongWait ? '⚠ Needs attention' : ''}
                        </span>
                        <span className="text-slate-400">Scheduled {formatTime(p.dateTime)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Front Desk Operational Alerts & Delay Management */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-4 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-bold text-slate-900">Front Desk Alerts & Delays</h3>
            </div>

            {/* Doctor Running Late Card */}
            <div className="p-3 bg-orange-50/60 border border-orange-200 rounded-xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-orange-950">Dr. Sarah Jenkins delayed 15 min</p>
                  <p className="text-[10px] text-orange-800 mt-0.5">
                    Consultation overruns in Room 1 · 3 scheduled patients affected
                  </p>
                </div>
              </div>

              {/* One-Click Action: Notify Affected Patients */}
              <button
                disabled={isDoctorDelayNotifying}
                onClick={handleNotifyDoctorDelay}
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isDoctorDelayNotifying ? 'Sending Notifications...' : 'Notify Affected Patients via SMS'}
              </button>
            </div>

            {/* Long Wait Alert */}
            {waitingOver15 > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="text-[11px] text-amber-900">
                  <strong>{waitingOver15} patient(s)</strong> waiting over 15 minutes. Check in with Room 2.
                </div>
              </div>
            )}

            {/* Doctors On Duty Quick Overview */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700">Doctors in Clinic Today</span>
                <button
                  onClick={() => setActiveTab('reception_availability')}
                  className="text-[10px] text-blue-600 font-bold hover:underline"
                >
                  Manage Rota →
                </button>
              </div>

              <div className="space-y-1.5">
                {doctors.slice(0, 3).map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-slate-800 truncate max-w-[130px]">{d.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Room {d.roomNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
      />

      <WalkInModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
      />

      <RescheduleCancelModal
        isOpen={isRescheduleCancelOpen}
        onClose={() => setIsRescheduleCancelOpen(false)}
        appointment={modalAppt}
        initialMode={modalMode}
      />
    </div>
  );
};
