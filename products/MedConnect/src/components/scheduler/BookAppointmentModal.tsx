import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentMode, ClinicType } from '../../types';
import { GoogleCalendarService } from '../../lib/googleCalendar';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Video,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  CreditCard,
  Building2
} from 'lucide-react';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoctorId?: string;
  initialMode?: AppointmentMode;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  initialDoctorId,
  initialMode = 'in_person'
}) => {
  const { patients, doctors, appointments, createAppointment, showToast } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'pat_1');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId || doctors[0]?.id || 'doc_1');
  const [clinicType, setClinicType] = useState<ClinicType>('gp_practice');
  const [mode, setMode] = useState<AppointmentMode>(initialMode);
  const [date, setDate] = useState<string>('2026-09-29');
  const [time, setTime] = useState<string>('10:30');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [reasonForVisit, setReasonForVisit] = useState<string>('Routine health consultation & medication review');
  const [paymentStatus, setPaymentStatus] = useState<'exempt_nhs' | 'deposit_paid' | 'paid' | 'unpaid'>('exempt_nhs');
  const [feeGbp, setFeeGbp] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const requestedDateTimeIso = `${date}T${time}:00.000Z`;

  // Real-time Google Calendar Availability Check
  const availabilityCheck = GoogleCalendarService.isSlotAvailable(
    requestedDateTimeIso,
    durationMinutes,
    appointments,
    selectedDoctorId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!availabilityCheck.available) {
      showToast('error', 'Slot Conflict Detected', availabilityCheck.conflictReason || 'Please choose a different time slot.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createAppointment({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        patientNhsNumber: selectedPatient.nhsNumber,
        patientPhone: selectedPatient.phone,
        patientEmail: selectedPatient.email,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        clinicType,
        dateTime: requestedDateTimeIso,
        durationMinutes,
        mode,
        status: 'scheduled',
        reasonForVisit,
        paymentStatus,
        feeGbp: paymentStatus === 'exempt_nhs' ? 0 : (feeGbp || 50),
        intakeFormAttached: selectedPatient.intakeFormCompleted,
        gmbSource: false
      });
      onClose();
    } catch (err) {
      showToast('error', 'Booking Failed', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Schedule Patient Consultation</h3>
              <p className="text-xs text-slate-500">Google Calendar 2-Way Sync & ML No-Show Protection</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          {/* Patient Selection */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Patient (NHS Record)</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-medium"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} — NHS: {p.nhsNumber} ({p.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Clinician Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Attending Clinician</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => {
                  setSelectedDoctorId(e.target.value);
                  const doc = doctors.find((d) => d.id === e.target.value);
                  if (doc) setClinicType(doc.clinicType);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Consultation Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('in_person')}
                  className={`p-2 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'in_person'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>In-Person</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('video_consultation')}
                  className={`p-2 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'video_consultation'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Telehealth</span>
                </button>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Duration</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
              >
                <option value={10}>10 min (Quick Review)</option>
                <option value={15}>15 min (Standard NHS)</option>
                <option value={30}>30 min (Complex/Dental)</option>
                <option value={45}>45 min (Initial Physio)</option>
              </select>
            </div>
          </div>

          {/* Availability notice */}
          {availabilityCheck.available ? (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Slot is clear on Google Calendar. Automated Twilio SMS confirmation queued.</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{availabilityCheck.conflictReason || 'Slot conflict.'}</span>
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Reason for Visit / Chief Complaint</label>
            <textarea
              rows={2}
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !availabilityCheck.available}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming with GCal...' : 'Confirm & Sync Google Calendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
