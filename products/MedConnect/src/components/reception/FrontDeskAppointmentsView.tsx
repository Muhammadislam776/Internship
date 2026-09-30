import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Volume2,
  Calendar,
  X,
  Plus,
  Send,
  User,
  Video,
  AlertCircle
} from 'lucide-react';
import { NewBookingModal } from './NewBookingModal';
import { RescheduleCancelModal } from './RescheduleCancelModal';

export const FrontDeskAppointmentsView: React.FC = () => {
  const {
    appointments,
    doctors,
    updateAppointmentStatus,
    triggerTwilioReminder,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [modalAppt, setModalAppt] = useState<Appointment | null>(null);
  const [modalMode, setModalMode] = useState<'reschedule' | 'cancel'>('reschedule');
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const todayStr = new Date().toDateString();
  const todayAppts = appointments.filter((a) => new Date(a.dateTime).toDateString() === todayStr);

  const filtered = todayAppts.filter((a) => {
    if (selectedDoctor !== 'all' && a.doctorId !== selectedDoctor) return false;
    if (selectedStatus !== 'all' && a.status !== selectedStatus) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      a.patientName.toLowerCase().includes(q) ||
      a.patientNhsNumber.toLowerCase().includes(q) ||
      a.patientPhone.includes(q) ||
      a.reasonForVisit.toLowerCase().includes(q) ||
      a.doctorName.toLowerCase().includes(q)
    );
  }).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const statusBadges: Record<string, string> = {
    scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    in_progress: 'bg-amber-50 text-amber-800 border-amber-200',
    completed: 'bg-slate-100 text-slate-600 border-slate-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    no_show: 'bg-red-50 text-red-700 border-red-200',
  };

  const statusLabels: Record<string, string> = {
    scheduled: 'Confirmed',
    confirmed: 'Confirmed',
    in_progress: 'Checked In / Waiting',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No-Show',
  };

  const handleBroadcastReminders = async () => {
    const unconfirmed = todayAppts.filter((a) => a.status === 'scheduled');
    for (const a of unconfirmed) {
      await triggerTwilioReminder(a.id, 'standard_reminder');
    }
    showToast('success', 'SMS Reminders Sent', `Dispatched SMS reminders to ${unconfirmed.length} unconfirmed patients.`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            Today's Appointments Schedule
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
              {todayAppts.length} Total
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full timetable for {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBroadcastReminders}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Send className="w-3.5 h-3.5 text-blue-500" />
            Send Reminders ({todayAppts.filter((a) => a.status === 'scheduled').length})
          </button>
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            New Booking
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, NHS number, phone, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Doctor selector */}
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Clinicians</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>

          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">Checked In / Waiting</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No-Show</option>
          </select>
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No appointments matching criteria</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or search term</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                  <th className="px-5 py-3">Time</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Clinician</th>
                  <th className="px-4 py-3">Type & Reason</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Desk Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((appt) => {
                  const doc = doctors.find((d) => d.id === appt.doctorId);
                  const isCheckedIn = appt.status === 'in_progress';
                  const isConfirmed = appt.status === 'confirmed' || appt.status === 'scheduled';
                  const isCompleted = appt.status === 'completed';

                  return (
                    <tr key={appt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-slate-900 block">
                          {formatTime(appt.dateTime)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{appt.durationMinutes} min</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {appt.patientName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{appt.patientName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">NHS {appt.patientNhsNumber} · {appt.patientPhone}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-800">{doc?.name || appt.doctorName}</p>
                        <p className="text-[10px] text-slate-400">Room {doc?.roomNumber} · {doc?.specialty}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${
                            appt.mode === 'video_consultation'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {appt.mode === 'video_consultation' ? <Video className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {appt.mode.replace('_', ' ')}
                        </span>
                        <p className="text-[10px] text-slate-600 mt-0.5">{appt.reasonForVisit}</p>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border inline-block ${
                            statusBadges[appt.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {statusLabels[appt.status] || appt.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isConfirmed && (
                            <button
                              onClick={() => {
                                updateAppointmentStatus(appt.id, 'in_progress');
                                showToast('success', 'Patient Checked In', `${appt.patientName} placed in waiting queue.`);
                              }}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow-xs"
                            >
                              Check In
                            </button>
                          )}

                          {isCheckedIn && (
                            <button
                              onClick={() => {
                                showToast('info', `Patient Called to Room ${doc?.roomNumber}`, `Announced ${appt.patientName} to Room ${doc?.roomNumber}.`);
                              }}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-lg shadow-xs flex items-center gap-1"
                            >
                              <Volume2 className="w-3 h-3" /> Call
                            </button>
                          )}

                          {!isCompleted && appt.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() => {
                                  setModalAppt(appt);
                                  setModalMode('reschedule');
                                  setIsRescheduleOpen(true);
                                }}
                                className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-[10px] rounded-lg"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => {
                                  setModalAppt(appt);
                                  setModalMode('cancel');
                                  setIsRescheduleOpen(true);
                                }}
                                className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 font-semibold text-[10px] rounded-lg"
                              >
                                Cancel
                              </button>
                            </>
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

      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
      />

      <RescheduleCancelModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        appointment={modalAppt}
        initialMode={modalMode}
      />
    </div>
  );
};
