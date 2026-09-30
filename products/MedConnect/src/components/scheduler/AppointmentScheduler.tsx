import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, RiskLevel, ClinicType, AppointmentMode } from '../../types';
import { MLPredictorModal } from './MLPredictorModal';
import { BookAppointmentModal } from './BookAppointmentModal';
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  Video,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  Sliders,
  DollarSign,
  TrendingUp,
  FileCheck2,
  CalendarCheck
} from 'lucide-react';

export const AppointmentScheduler: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    runMlPredictionForAppointment,
    triggerTwilioReminder,
    setActiveTelehealthAppointment,
    setActiveTab,
    selectedClinicType,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
  const [filterMode, setFilterMode] = useState<AppointmentMode | 'all'>('all');
  const [isMlModalOpen, setIsMlModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Filter appointments
  const filteredAppointments = appointments.filter((app) => {
    if (selectedClinicType !== 'all' && app.clinicType !== selectedClinicType) return false;
    if (filterRisk !== 'all' && app.mlPrediction?.riskLevel !== filterRisk) return false;
    if (filterMode !== 'all' && app.mode !== filterMode) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.patientName.toLowerCase().includes(q);
      const matchNhs = app.patientNhsNumber.toLowerCase().includes(q);
      const matchDoc = app.doctorName.toLowerCase().includes(q);
      const matchReason = app.reasonForVisit.toLowerCase().includes(q);
      return matchName || matchNhs || matchDoc || matchReason;
    }
    return true;
  });

  // KPI Calculations
  const highRiskCount = appointments.filter(
    (a) => a.mlPrediction?.riskLevel === 'high' || a.mlPrediction?.riskLevel === 'critical'
  ).length;

  const smsConfirmedCount = appointments.filter(
    (a) => a.status === 'confirmed' || a.twilioRemindersSent.some((t) => t.status === 'responded_confirmed')
  ).length;
  const revenueSavedGbp = (appointments.length * 48.5).toFixed(0);

  const handleBulkReminders = async () => {
    const highRiskAppointments = appointments.filter(
      (a) => a.mlPrediction?.riskLevel === 'high' || a.mlPrediction?.riskLevel === 'critical'
    );
    showToast('info', 'Bulk Reminder Dispatch Started', `Sending interactive 2-way Twilio SMS to ${highRiskAppointments.length} high-risk patients.`);
    for (const app of highRiskAppointments) {
      await triggerTwilioReminder(app.id, 'urgent_confirmation');
    }
  };

  const getRiskBadge = (prediction: Appointment['mlPrediction']) => {
    if (!prediction) return null;
    const { riskLevel, noShowProbability } = prediction;

    switch (riskLevel) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>CRITICAL ({noShowProbability}%)</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>HIGH RISK ({noShowProbability}%)</span>
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-50 text-yellow-800 border border-yellow-200">
            <span>MODERATE ({noShowProbability}%)</span>
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>LOW RISK ({noShowProbability}%)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Intelligent Appointment Scheduler
            </h2>
            <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" /> ML No-Show Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Predicts no-show probabilities, auto-schedules Twilio reminders, and synchronizes real-time with Google Calendar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsMlModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all"
          >
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>ML Risk Simulator</span>
          </button>

          {highRiskCount > 0 && (
            <button
              onClick={handleBulkReminders}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-all"
            >
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>Bulk Urgent SMS ({highRiskCount})</span>
            </button>
          )}

          <button
            onClick={() => setIsBookModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Scheduled</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{appointments.length}</span>
            <span className="text-xs text-slate-500">active visits</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">High No-Show Risk</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 font-mono">{highRiskCount}</span>
            <span className="text-xs text-amber-700">flagged for overbooking</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Twilio 2-Way Confirmed</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700 font-mono">{smsConfirmedCount}</span>
            <span className="text-xs text-slate-500">patient replies logged</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Revenue Preserved</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-700 font-mono">£{revenueSavedGbp}</span>
            <span className="text-xs text-slate-500">via ML recovery</span>
          </div>
        </div>
      </div>

      {/* Dynamic Overbooking Recommendation Banner */}
      {highRiskCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                AI Optimization Notice: {highRiskCount} slot(s) flagged for potential absence
              </h4>
              <p className="text-xs text-amber-800">
                ClinicFlow suggests auto-overbooking a standby patient or switching high-risk slots to Telehealth Video.
              </p>
            </div>
          </div>
          <button
            onClick={handleBulkReminders}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all"
          >
            Dispatch Automated Twilio Reminders
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by patient name, NHS number (e.g. 485 772 9012), doctor, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-700">
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-500">Risk:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as any)}
              className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Risk (&gt;65%)</option>
              <option value="high">High Risk (40-64%)</option>
              <option value="moderate">Moderate Risk</option>
              <option value="low">Low Risk (&lt;20%)</option>
            </select>
          </div>

          {/* Mode Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-[11px] text-slate-500">Mode:</span>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as any)}
              className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Modes</option>
              <option value="in_person">In-Person Clinic</option>
              <option value="video_consultation">Telehealth Video</option>
              <option value="phone">Telephone</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List View */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
            <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No appointments found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the filters or schedule a new appointment.</p>
          </div>
        ) : (
          filteredAppointments.map((app) => {
            const apptDate = new Date(app.dateTime);

            return (
              <div
                key={app.id}
                className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-2xl p-4 sm:p-5 shadow-xs transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Patient info & Clinic Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>{app.patientName}</span>
                      </h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        NHS: {app.patientNhsNumber}
                      </span>
                      {getRiskBadge(app.mlPrediction)}
                      {app.gmbSource && (
                        <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                          via Google Profile
                        </span>
                      )}
                      {app.intakeFormAttached && (
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FileCheck2 className="w-3 h-3 text-emerald-600" /> AES Intake Ready
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-medium">{app.reasonForVisit}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-semibold font-mono">
                          {apptDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at{' '}
                          {apptDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} ({app.durationMinutes}m)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.doctorName}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {app.mode === 'video_consultation' ? (
                          <span className="flex items-center gap-1 text-blue-700 font-medium">
                            <Video className="w-3.5 h-3.5" /> Telehealth Video Room
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5" /> In-Person Clinic
                          </span>
                        )}
                      </div>

                      {app.googleCalendarEventId && (
                        <span className="text-[11px] text-emerald-700 font-mono">
                          ✓ GCal Synced ({app.googleCalendarEventId})
                        </span>
                      )}
                    </div>

                    {/* Twilio Reminder Status Indicator */}
                    {app.twilioRemindersSent.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-emerald-600" /> Twilio Status:
                        </span>
                        {app.twilioRemindersSent.map((t, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              t.status === 'responded_confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {t.type.toUpperCase()}: {t.status === 'responded_confirmed' ? 'PATIENT CONFIRMED (YES)' : t.status.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Quick Action Buttons */}
                  <div className="flex flex-wrap lg:flex-col items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="flex items-center gap-2">
                      {/* Video Consultation Fast Join */}
                      {app.mode === 'video_consultation' && (
                        <button
                          onClick={() => {
                            setActiveTelehealthAppointment(app);
                            setActiveTab('telehealth');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold shadow-2xs transition-all"
                        >
                          <Video className="w-3.5 h-3.5 text-blue-600" />
                          <span>Launch Video</span>
                        </button>
                      )}

                      {/* Twilio SMS Reminder */}
                      <button
                        onClick={() => triggerTwilioReminder(app.id, 'standard_reminder')}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-all"
                        title="Dispatch automated Twilio SMS reminder"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">Send SMS</span>
                      </button>

                      {/* Run ML Recalculation */}
                      <button
                        onClick={() => runMlPredictionForAppointment(app.id)}
                        className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-blue-600 border border-slate-200 transition-all"
                        title="Recalculate ML Risk Score"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Status Toggle buttons */}
                    <div className="flex items-center gap-1.5">
                      {app.status !== 'confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'confirmed')}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold"
                        >
                          Confirm
                        </button>
                      )}
                      {app.status !== 'completed' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'completed')}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold"
                        >
                          Mark Arrived
                        </button>
                      )}
                      {app.status !== 'no_show' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'no_show')}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold"
                        >
                          Mark No-Show
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <MLPredictorModal isOpen={isMlModalOpen} onClose={() => setIsMlModalOpen(false)} />
      <BookAppointmentModal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} />
    </div>
  );
};
