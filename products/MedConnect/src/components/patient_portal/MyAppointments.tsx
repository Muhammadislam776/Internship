import React, { useState } from 'react';
import { Appointment } from '../../types';
import {
  Calendar,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  CalendarPlus,
  X
} from 'lucide-react';

interface MyAppointmentsProps {
  appointments: Appointment[];
  onOpenBooking: () => void;
  onJoinTelehealth: (appt: Appointment) => void;
  onCancelAppointment: (apptId: string, reason: string) => void;
  onRescheduleAppointment: (apptId: string, newDate: string, newTime: string) => void;
}

export const MyAppointments: React.FC<MyAppointmentsProps> = ({
  appointments,
  onOpenBooking,
  onJoinTelehealth,
  onCancelAppointment,
  onRescheduleAppointment
}) => {
  const [tab, setTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Personal schedule conflict');
  const [showRescheduleModal, setShowRescheduleModal] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('2026-10-05');
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('11:00 AM');

  const now = new Date().getTime();

  const upcoming = appointments
    .filter((a) => a.status !== 'cancelled' && a.status !== 'completed' && new Date(a.dateTime).getTime() >= now - 3600000)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const past = appointments
    .filter((a) => a.status === 'completed' || (new Date(a.dateTime).getTime() < now && a.status !== 'cancelled'))
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const cancelled = appointments
    .filter((a) => a.status === 'cancelled')
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const currentList = tab === 'upcoming' ? upcoming : tab === 'past' ? past : cancelled;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Upcoming
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full animate-pulse">
            <Clock className="w-3 h-3" /> Waiting / Ready
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  const handleAddCalendar = (appt: Appointment) => {
    const title = encodeURIComponent(`Consultation with ${appt.doctorName} (MedConnect)`);
    const details = encodeURIComponent(`Reason: ${appt.reasonForVisit}\nType: ${appt.mode === 'video_consultation' ? 'Video' : 'In-Person'}`);
    const location = encodeURIComponent(appt.mode === 'video_consultation' ? 'ClinicFlow Telehealth Room' : 'St. James Health Centre, London');
    const startIso = new Date(appt.dateTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endIso = new Date(new Date(appt.dateTime).getTime() + 15 * 60000).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Book Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your past and upcoming consultations with St. James Health Centre
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Book New Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        {[
          { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { id: 'past', label: 'Past Consultations', count: past.length },
          { id: 'cancelled', label: 'Cancelled', count: cancelled.length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              tab === t.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                tab === t.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Appointment Cards List */}
      {currentList.length > 0 ? (
        <div className="space-y-4">
          {currentList.map((appt) => (
            <div
              key={appt.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  {appt.mode === 'video_consultation' ? (
                    <Video className="w-6 h-6" />
                  ) : (
                    <MapPin className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{appt.doctorName}</h3>
                    {getStatusBadge(appt.status)}
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      {appt.mode === 'video_consultation' ? 'Video' : 'In-Person'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {appt.reasonForVisit} · <span className="text-slate-400">{appt.doctorSpecialty}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {formatDate(appt.dateTime)} at {formatTime(appt.dateTime)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {appt.durationMinutes || 15} minutes
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">St. James Health Centre</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                {tab === 'upcoming' && appt.mode === 'video_consultation' && (
                  <button
                    onClick={() => onJoinTelehealth(appt)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" /> Join Video
                  </button>
                )}

                <button
                  onClick={() => setSelectedAppt(appt)}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  View Details
                </button>

                {tab === 'upcoming' && (
                  <>
                    <button
                      onClick={() => handleAddCalendar(appt)}
                      title="Add to Google Calendar"
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <CalendarPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowRescheduleModal(appt)}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => setShowCancelModal(appt)}
                      className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {tab === 'upcoming'
              ? 'No upcoming appointments'
              : tab === 'past'
              ? 'No past consultations recorded'
              : 'No cancelled appointments'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            {tab === 'upcoming'
              ? 'When you book a video or in-person consultation, it will appear here.'
              : 'Your clinical history with St. James Health Centre will be logged here.'}
          </p>
          {tab === 'upcoming' && (
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Book an Appointment
            </button>
          )}
        </div>
      )}

      {/* ── View Details Modal ── */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Appointment Details</h3>
              <button
                onClick={() => setSelectedAppt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Clinician</span>
                  <span className="font-bold text-slate-900">{selectedAppt.doctorName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Specialty</span>
                  <span className="font-medium text-slate-700">{selectedAppt.doctorSpecialty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Date & Time</span>
                  <span className="font-bold text-blue-700">
                    {formatDate(selectedAppt.dateTime)} at {formatTime(selectedAppt.dateTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Type</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {selectedAppt.mode === 'video_consultation' ? 'Secure Telehealth Video' : 'In-Person Surgery Visit'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Reason</span>
                  <span className="text-slate-800">{selectedAppt.reasonForVisit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status</span>
                  <span>{getStatusBadge(selectedAppt.status)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-[11px] text-blue-800">
                <p className="font-semibold">Preparation notes for your appointment:</p>
                <p className="mt-1 text-blue-700">
                  Please log in 5 minutes before your video call. For in-person visits, arrive at St. James Health Centre reception on time.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedAppt(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
              {selectedAppt.mode === 'video_consultation' && selectedAppt.status !== 'cancelled' && (
                <button
                  onClick={() => {
                    const a = selectedAppt;
                    setSelectedAppt(null);
                    onJoinTelehealth(a);
                  }}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Join Video Room
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel Modal ── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Cancel Appointment</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to cancel your appointment with <strong>{showCancelModal.doctorName}</strong> on {formatDate(showCancelModal.dateTime)}?
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Reason for cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Personal schedule conflict">Personal schedule conflict</option>
                <option value="Symptoms improved">Symptoms improved</option>
                <option value="Need to re-book for another day">Need to re-book for another day</option>
                <option value="Other">Other reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => {
                  onCancelAppointment(showCancelModal.id, cancelReason);
                  setShowCancelModal(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reschedule Modal ── */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reschedule Appointment</h3>
            <p className="text-xs text-slate-500">
              Select a new date and time for your consultation with {showRescheduleModal.doctorName}.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Available Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:30 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:15 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setRescheduleSlot(slot)}
                      className={`p-2 text-xs font-bold rounded-xl border transition-all ${
                        rescheduleSlot === slot
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRescheduleModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onRescheduleAppointment(showRescheduleModal.id, rescheduleDate, rescheduleSlot);
                  setShowRescheduleModal(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
