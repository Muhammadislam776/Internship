import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Video,
  User,
  Phone,
  Save,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  RefreshCw,
  Sliders,
  ShieldCheck,
  CalendarCheck,
  Check,
  Zap,
  Info
} from 'lucide-react';

interface DaySchedule {
  day: string;
  dayShort: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  modes: { inPerson: boolean; video: boolean; phone: boolean };
}

export const ClinicianAvailabilityView: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast, setActiveTab } = useApp();

  const [schedule, setSchedule] = useState<DaySchedule[]>([
    {
      day: 'Monday',
      dayShort: 'Mon',
      enabled: true,
      startTime: '08:30',
      endTime: '17:30',
      breakStart: '12:30',
      breakEnd: '13:30',
      modes: { inPerson: true, video: true, phone: true }
    },
    {
      day: 'Tuesday',
      dayShort: 'Tue',
      enabled: true,
      startTime: '08:30',
      endTime: '17:30',
      breakStart: '12:30',
      breakEnd: '13:30',
      modes: { inPerson: true, video: true, phone: true }
    },
    {
      day: 'Wednesday',
      dayShort: 'Wed',
      enabled: true,
      startTime: '08:30',
      endTime: '17:30',
      breakStart: '12:30',
      breakEnd: '13:30',
      modes: { inPerson: true, video: true, phone: false }
    },
    {
      day: 'Thursday',
      dayShort: 'Thu',
      enabled: true,
      startTime: '09:00',
      endTime: '18:00',
      breakStart: '13:00',
      breakEnd: '14:00',
      modes: { inPerson: true, video: true, phone: true }
    },
    {
      day: 'Friday',
      dayShort: 'Fri',
      enabled: true,
      startTime: '08:30',
      endTime: '16:30',
      breakStart: '12:30',
      breakEnd: '13:30',
      modes: { inPerson: true, video: true, phone: false }
    },
    {
      day: 'Saturday',
      dayShort: 'Sat',
      enabled: true,
      startTime: '09:00',
      endTime: '13:00',
      breakStart: '11:00',
      breakEnd: '11:15',
      modes: { inPerson: false, video: true, phone: true }
    },
    {
      day: 'Sunday',
      dayShort: 'Sun',
      enabled: false,
      startTime: '10:00',
      endTime: '14:00',
      breakStart: '12:00',
      breakEnd: '12:30',
      modes: { inPerson: false, video: true, phone: false }
    }
  ]);

  // General Slot Configurations
  const [slotDurationMinutes, setSlotDurationMinutes] = useState<number>(15);
  const [bufferBetweenAppointments, setBufferBetweenAppointments] = useState<number>(5);
  const [maxPatientsPerSession, setMaxPatientsPerSession] = useState<number>(18);
  const [isGoogleSyncActive, setIsGoogleSyncActive] = useState<boolean>(true);
  const [autoBlockGoogleEvents, setAutoBlockGoogleEvents] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Leave / Out of office requests
  const [upcomingLeave, setUpcomingLeave] = useState<Array<{ id: string; dates: string; reason: string; coverDoctor: string }>>([
    {
      id: 'leave-1',
      dates: '12 Oct 2026 – 16 Oct 2026',
      reason: 'NHS Clinical Training & CME Revalidation',
      coverDoctor: 'Dr. Marcus Vance'
    }
  ]);

  const handleToggleDay = (idx: number) => {
    const updated = [...schedule];
    updated[idx].enabled = !updated[idx].enabled;
    setSchedule(updated);
  };

  const handleTimeChange = (idx: number, field: keyof DaySchedule, val: string) => {
    const updated = [...schedule];
    (updated[idx] as any)[field] = val;
    setSchedule(updated);
  };

  const handleToggleMode = (idx: number, mode: 'inPerson' | 'video' | 'phone') => {
    const updated = [...schedule];
    updated[idx].modes[mode] = !updated[idx].modes[mode];
    setSchedule(updated);
  };

  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(
        'success',
        'Clinician Availability Saved',
        `Weekly schedule updated and 2-way synchronized with Google Calendar (${isGoogleSyncActive ? 'Synced' : 'Local Only'}).`
      );
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* ── Top Header Banner ── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  Clinician Rota & Consultation Availability
                </h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Google Sync Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your active weekly clinic hours, consultation modes, and Google Calendar 2-way synchronization.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('calendar')}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Open Calendar View</span>
          </button>
        </div>
      </div>

      {/* ── Main Form ── */}
      <form onSubmit={handleSaveAvailability} className="space-y-6">
        {/* Weekly Day-by-Day Roster */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Weekly Duty Schedule
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Patients will only be able to book appointment slots during your active duty windows.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700">
              {schedule.filter((s) => s.enabled).length} Days Active
            </span>
          </div>

          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div
                key={item.day}
                className={`p-4 rounded-2xl border transition-all ${
                  item.enabled ? 'bg-white border-slate-200 shadow-2xs' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Day & Toggle */}
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <button
                      type="button"
                      onClick={() => handleToggleDay(idx)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        item.enabled ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          item.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{item.day}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.enabled ? 'On Duty' : 'Off Duty'}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Working Hours & Lunch Break */}
                  {item.enabled ? (
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {/* Hours */}
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500 text-[11px] font-medium">Hours:</span>
                        <input
                          type="time"
                          value={item.startTime}
                          onChange={(e) => handleTimeChange(idx, 'startTime', e.target.value)}
                          className="bg-transparent font-mono font-bold text-slate-900 focus:outline-none"
                        />
                        <span className="text-slate-400">–</span>
                        <input
                          type="time"
                          value={item.endTime}
                          onChange={(e) => handleTimeChange(idx, 'endTime', e.target.value)}
                          className="bg-transparent font-mono font-bold text-slate-900 focus:outline-none"
                        />
                      </div>

                      {/* Break */}
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
                        <span className="text-slate-500 text-[11px] font-medium">Lunch:</span>
                        <input
                          type="time"
                          value={item.breakStart}
                          onChange={(e) => handleTimeChange(idx, 'breakStart', e.target.value)}
                          className="bg-transparent font-mono text-slate-700 focus:outline-none"
                        />
                        <span className="text-slate-400">–</span>
                        <input
                          type="time"
                          value={item.breakEnd}
                          onChange={(e) => handleTimeChange(idx, 'breakEnd', e.target.value)}
                          className="bg-transparent font-mono text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">No scheduled appointments</div>
                  )}

                  {/* Right: Consultation Modes */}
                  {item.enabled && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleMode(idx, 'inPerson')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          item.modes.inPerson ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                        title="In-Person Visits"
                      >
                        <User className="w-3 h-3" />
                        <span>In-Person</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleMode(idx, 'video')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          item.modes.video ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                        title="Telehealth Video Room"
                      >
                        <Video className="w-3 h-3" />
                        <span>Video</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleMode(idx, 'phone')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          item.modes.phone ? 'bg-slate-200 text-slate-800 border border-slate-300' : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                        title="Telephone Consultation"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Phone</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slot Length & Sync Preferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Slot Rules */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Consultation Slot Dynamics</h3>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Default Consultation Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 15, 20, 30].map((mins) => (
                    <button
                      type="button"
                      key={mins}
                      onClick={() => setSlotDurationMinutes(mins)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        slotDurationMinutes === mins
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Documentation Buffer Between Visits
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 5, 10].map((buffer) => (
                    <button
                      type="button"
                      key={buffer}
                      onClick={() => setBufferBetweenAppointments(buffer)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        bufferBetweenAppointments === buffer
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {buffer === 0 ? 'None' : `${buffer} mins`}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Reserved time to complete clinical SOAP notes and sanitize examination room.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Max Daily Patients per Shift
                </label>
                <input
                  type="number"
                  min={5}
                  max={40}
                  value={maxPatientsPerSession}
                  onChange={(e) => setMaxPatientsPerSession(parseInt(e.target.value) || 16)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Google Calendar 2-Way Sync Settings */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Google Calendar 2-Way Sync</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Connected
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Synchronize Appointments</h4>
                  <p className="text-[10px] text-slate-500">Push ClinicFlow bookings into Google Calendar in real-time.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGoogleSyncActive(!isGoogleSyncActive)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    isGoogleSyncActive ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isGoogleSyncActive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Auto-Block External Google Events</h4>
                  <p className="text-[10px] text-slate-500">Personal Google events will block patient booking slots automatically.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoBlockGoogleEvents(!autoBlockGoogleEvents)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    autoBlockGoogleEvents ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      autoBlockGoogleEvents ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Primary Calendar Synced
                </span>
                <p className="text-[11px] text-emerald-800 font-mono">
                  sarah.jenkins@stjamesgp.nhs.uk (Google Workspace)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Changes take effect immediately for online patient booking and clinic reception desk.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Rota...' : 'Save Availability & Sync'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
