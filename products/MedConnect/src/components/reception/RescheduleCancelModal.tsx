import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  X,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Trash2,
  ArrowRight
} from 'lucide-react';

interface RescheduleCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  initialMode: 'reschedule' | 'cancel';
}

export const RescheduleCancelModal: React.FC<RescheduleCancelModalProps> = ({
  isOpen,
  onClose,
  appointment,
  initialMode
}) => {
  const { rescheduleAppointment, cancelAppointment, showToast } = useApp();

  const [mode, setMode] = useState<'reschedule' | 'cancel'>(initialMode);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (appointment) {
      return appointment.dateTime.split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [reason, setReason] = useState('Patient requested time change');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !appointment) return null;

  const timeSlots = [
    '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleAction = async () => {
    setIsSubmitting(true);
    try {
      if (mode === 'reschedule') {
        const [hours, mins] = selectedTime.split(':').map(Number);
        const newDate = new Date(selectedDate);
        newDate.setHours(hours, mins, 0, 0);

        await rescheduleAppointment(appointment.id, newDate.toISOString(), reason);
        showToast('success', 'Appointment Rescheduled', `Updated to ${newDate.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}. SMS confirmation sent.`);
      } else {
        await cancelAppointment(appointment.id, reason);
        showToast('info', 'Appointment Cancelled', 'Appointment cancelled and SMS sent to patient.');
      }
      onClose();
    } catch (err) {
      console.error(err);
      showToast('error', 'Operation Failed', 'Could not complete requested action.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mode === 'reschedule' ? (
              <Calendar className="w-5 h-5 text-blue-600" />
            ) : (
              <Trash2 className="w-5 h-5 text-rose-600" />
            )}
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {mode === 'reschedule' ? 'Reschedule Appointment' : 'Cancel Appointment'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {appointment.patientName} · {appointment.doctorName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setMode('reschedule')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
              mode === 'reschedule'
                ? 'bg-blue-50 text-blue-700 border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Reschedule
          </button>
          <button
            type="button"
            onClick={() => setMode('cancel')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
              mode === 'cancel'
                ? 'bg-rose-50 text-rose-700 border-rose-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Cancel Appointment
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Current appointment info */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Current Slot:</span>
              <span className="font-bold text-slate-900 font-mono">
                {new Date(appointment.dateTime).toLocaleDateString('en-GB')} at {new Date(appointment.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Patient Phone:</span>
              <span className="font-semibold text-slate-700">{appointment.patientPhone}</span>
            </div>
          </div>

          {mode === 'reschedule' ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">New Appointment Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select New Time Slot</label>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all ${
                        selectedTime === slot
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Reschedule</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                >
                  <option value="Patient requested time change">Patient requested time change</option>
                  <option value="Doctor running late / delayed">Doctor running late / delayed</option>
                  <option value="Clinic timetable reorganization">Clinic timetable reorganization</option>
                  <option value="Emergency slot required">Emergency slot required</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-800 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Cancelling this appointment will automatically dispatch a cancellation SMS to the patient and free the slot for walk-ins or waitlist.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cancellation Reason *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                >
                  <option value="Patient cancelled by phone/desk">Patient cancelled by phone/desk</option>
                  <option value="Patient no longer requires consultation">Patient no longer requires consultation</option>
                  <option value="Clinician unavailable / sick leave">Clinician unavailable / sick leave</option>
                  <option value="Duplicate booking made in error">Duplicate booking made in error</option>
                  <option value="Referred to secondary care / hospital">Referred to secondary care / hospital</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Dismiss
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleAction}
            className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50 ${
              mode === 'reschedule'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {mode === 'reschedule' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {isSubmitting ? 'Updating...' : 'Confirm Reschedule & Send SMS'}
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
