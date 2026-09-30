import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Appointment, AppointmentMode } from '../../types';
import { BookAppointmentModal } from '../scheduler/BookAppointmentModal';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  Phone,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCheck,
  Stethoscope,
  Filter
} from 'lucide-react';

export const DoctorCalendarView: React.FC = () => {
  const {
    appointments,
    doctors,
    currentDoctorId,
    setActiveTelehealthAppointment,
    setActiveTab,
    updateAppointmentStatus
  } = useApp();
  const { currentUser } = useAuth();

  const currentDoctor = doctors.find((d) => d.id === currentDoctorId) || doctors[0];

  // Calendar State
  // Default to September 2026 to match mock data
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 29)); // Sep 29, 2026
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedMode, setSelectedMode] = useState<AppointmentMode | 'all'>('all');
  const [selectedDay, setSelectedDay] = useState<Date>(new Date(2026, 8, 29));
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [inspectAppointment, setInspectAppointment] = useState<Appointment | null>(null);

  // Filter appointments for this doctor and by mode
  const doctorAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchDoctor = !currentDoctorId || a.doctorId === currentDoctorId;
      const matchMode = selectedMode === 'all' || a.mode === selectedMode;
      return matchDoctor && matchMode;
    });
  }, [appointments, currentDoctorId, selectedMode]);

  // Calendar Date Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Month navigation
  const prevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
      setSelectedDay(d);
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
      setSelectedDay(d);
    }
  };

  const goToToday = () => {
    const today = new Date(2026, 8, 29); // Anchor to demo date
    setCurrentDate(today);
    setSelectedDay(today);
  };

  // Month Grid Calculation (Monday starting)
  const monthGridDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Day of week: 0 = Sun -> 6, 1 = Mon -> 0, etc.
    const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
    const totalDays = lastDayOfMonth.getDate();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Next month padding to round up to full weeks (35 or 42 cells)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  }, [year, month]);

  // Appointments mapping by date key "YYYY-MM-DD"
  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    doctorAppointments.forEach((a) => {
      const key = a.dateTime.split('T')[0];
      if (!map[key]) map[key] = [];
      map[key].push(a);
    });
    return map;
  }, [doctorAppointments]);

  // Appointments for the currently selected day
  const selectedDayKey = selectedDay.toISOString().split('T')[0];
  const dayAppointments = appointmentsByDate[selectedDayKey] || [];

  // Helpers
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const getModeIcon = (mode: AppointmentMode) => {
    switch (mode) {
      case 'video_consultation':
        return <Video className="w-3 h-3 text-indigo-600" />;
      case 'phone':
        return <Phone className="w-3 h-3 text-slate-500" />;
      default:
        return <User className="w-3 h-3 text-blue-600" />;
    }
  };

  const getStatusBadgeClass = (status: Appointment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in_progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'no_show':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Top Bar: Month Title, Controls, Google Calendar Sync ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Month / Year Title & Arrows */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {monthNames[month]} {year}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Clinical Diary & Room Allocation · {currentDoctor.name}
            </p>
          </div>

          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={prevPeriod}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextPeriod}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: View Toggle, Filters, Add Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Google Calendar Sync Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Google Calendar Synced</span>
          </div>

          {/* Mode Filter */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as any)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="in_person">In Person</option>
              <option value="video_consultation">Video Call</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day
            </button>
          </div>

          {/* Add Appointment CTA */}
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Slot</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace: Calendar Grid + Day Details Drawer ── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Left/Main Column: Calendar View (Month / Week / Day) */}
        <div className="xl:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {viewMode === 'month' && (
            <div>
              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70 text-center py-2.5 text-xs font-bold uppercase text-slate-400 tracking-wider">
                {daysOfWeek.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Month Cells Grid */}
              <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
                {monthGridDays.map((cell, idx) => {
                  const dateKey = cell.date.toISOString().split('T')[0];
                  const dayAppts = appointmentsByDate[dateKey] || [];
                  const isSelected = isSameDay(cell.date, selectedDay);
                  const isToday = isSameDay(cell.date, new Date(2026, 8, 29));

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDay(cell.date)}
                      className={`min-h-[105px] sm:min-h-[120px] p-2 flex flex-col justify-between transition-colors cursor-pointer group ${
                        !cell.isCurrentMonth
                          ? 'bg-slate-50/40 text-slate-300'
                          : isSelected
                          ? 'bg-blue-50/40 ring-2 ring-inset ring-blue-500'
                          : 'hover:bg-slate-50/60'
                      }`}
                    >
                      {/* Day Number Header */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold rounded-lg w-6 h-6 flex items-center justify-center ${
                            isToday
                              ? 'bg-blue-600 text-white'
                              : isSelected
                              ? 'bg-blue-100 text-blue-700'
                              : cell.isCurrentMonth
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {cell.date.getDate()}
                        </span>

                        {dayAppts.length > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                            {dayAppts.length}
                          </span>
                        )}
                      </div>

                      {/* Appointments Mini Badges */}
                      <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                        {dayAppts.slice(0, 3).map((app) => (
                          <div
                            key={app.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDay(cell.date);
                              setInspectAppointment(app);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border flex items-center gap-1 transition-all ${
                              app.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : app.mode === 'video_consultation'
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                            title={`${formatTime(app.dateTime)} - ${app.patientName} (${app.reasonForVisit})`}
                          >
                            {getModeIcon(app.mode)}
                            <span className="truncate">{formatTime(app.dateTime)} {app.patientName.split(' ')[0]}</span>
                          </div>
                        ))}

                        {dayAppts.length > 3 && (
                          <span className="text-[10px] font-bold text-slate-400 block px-1">
                            +{dayAppts.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'week' && (
            <div className="divide-y divide-slate-100">
              <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Week of {selectedDay.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {doctorAppointments.length} Total Booked Sessions
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {daysOfWeek.map((dayName, idx) => {
                  const dayDate = new Date(year, month, 28 + idx); // Week around Sep 28-Oct 4
                  const key = dayDate.toISOString().split('T')[0];
                  const appts = appointmentsByDate[key] || [];

                  return (
                    <div key={dayName} className="p-4 hover:bg-slate-50/40 transition-colors flex items-start gap-4">
                      <div className="w-24 shrink-0">
                        <span className="text-xs font-bold text-slate-900 block">{dayName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {dayDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {appts.length === 0 ? (
                          <span className="text-xs text-slate-400 italic py-1">No appointments booked</span>
                        ) : (
                          appts.map((a) => (
                            <div
                              key={a.id}
                              onClick={() => setInspectAppointment(a)}
                              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 cursor-pointer shadow-xs space-y-1 transition-all"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                  {getModeIcon(a.mode)}
                                  {formatTime(a.dateTime)} · {a.patientName}
                                </span>
                                <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full border ${getStatusBadgeClass(a.status)}`}>
                                  {a.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">{a.reasonForVisit}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'day' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedDay.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {dayAppointments.length} Appointments Scheduled · Room 3 (Ground Floor)
                  </p>
                </div>
                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Book Slot
                </button>
              </div>

              {dayAppointments.length === 0 ? (
                <div className="py-16 text-center">
                  <CalendarIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-slate-700">No appointments scheduled for this day</h4>
                  <p className="text-xs text-slate-400 mt-1">Select another day or add a new consultation slot.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayAppointments.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setInspectAppointment(app)}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white shadow-xs transition-all flex flex-wrap items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center font-bold">
                          <span className="text-xs">{formatTime(app.dateTime)}</span>
                          <span className="text-[10px] text-blue-500 font-normal">{app.durationMinutes}m</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{app.patientName}</span>
                            <span className="text-xs font-mono text-slate-500 font-medium">NHS: {app.patientNhsNumber}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{app.reasonForVisit}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(app.status)}`}>
                          {app.status}
                        </span>

                        {app.mode === 'video_consultation' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTelehealthAppointment(app);
                              setActiveTab('telehealth');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join Video Call</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateAppointmentStatus(app.id, 'in_progress');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                          >
                            Start Visit
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Selected Day Inspector & Upcoming Timeline */}
        <div className="space-y-4">
          {/* Day Inspector Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Selected Day
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedDay.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-mono">
                {dayAppointments.length} Visits
              </span>
            </div>

            {/* List of day appointments */}
            {dayAppointments.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No appointments for this date.
              </p>
            ) : (
              <div className="space-y-2.5">
                {dayAppointments.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setInspectAppointment(app)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-blue-300 bg-slate-50/50 hover:bg-white transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {formatTime(app.dateTime)}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{app.patientName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{app.reasonForVisit}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsBookModalOpen(true)}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Book Patient on This Date
            </button>
          </div>

          {/* Practice Google Calendar Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Google Calendar Integration</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Appointments scheduled in MedConnect are automatically synced to Google Calendar with two-way clash prevention.
            </p>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-700 truncate">
              Linked: dr.sarah.jenkins.gp@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {inspectAppointment && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setInspectAppointment(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Appointment Details</h3>
                  <span className="text-[10px] font-mono text-slate-400">Ref: {inspectAppointment.id}</span>
                </div>
              </div>
              <button
                onClick={() => setInspectAppointment(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Patient Information</span>
                <p className="text-sm font-bold text-slate-900">{inspectAppointment.patientName}</p>
                <p className="text-slate-500">NHS Number: <strong className="font-mono text-blue-700">{inspectAppointment.patientNhsNumber}</strong></p>
                <p className="text-slate-500">Phone: {inspectAppointment.patientPhone}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Date & Time</span>
                  <span className="font-semibold text-slate-900 block mt-0.5">
                    {new Date(inspectAppointment.dateTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">{formatTime(inspectAppointment.dateTime)} ({inspectAppointment.durationMinutes}m)</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mode & Room</span>
                  <span className="font-semibold text-slate-900 capitalize block mt-0.5">
                    {inspectAppointment.mode.replace('_', ' ')}
                  </span>
                  <span className="text-slate-500 text-[11px]">Room 3 (Ground Floor)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Reason for Consultation</span>
                <p className="font-medium text-slate-800 mt-1">{inspectAppointment.reasonForVisit}</p>
              </div>

              {inspectAppointment.mlPrediction && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center justify-between">
                  <span className="text-blue-900 font-semibold">Attendance Probability</span>
                  <span className="font-bold text-blue-700">
                    {100 - inspectAppointment.mlPrediction.noShowProbability}% Confirmed Attendance
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              {inspectAppointment.mode === 'video_consultation' ? (
                <button
                  onClick={() => {
                    setActiveTelehealthAppointment(inspectAppointment);
                    setActiveTab('telehealth');
                  }}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" /> Launch Video Room
                </button>
              ) : (
                <button
                  onClick={() => {
                    updateAppointmentStatus(inspectAppointment.id, 'in_progress');
                    setInspectAppointment(null);
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                >
                  Mark In-Progress
                </button>
              )}
              <button
                onClick={() => setInspectAppointment(null)}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        initialDoctorId={currentDoctorId}
      />
    </div>
  );
};
