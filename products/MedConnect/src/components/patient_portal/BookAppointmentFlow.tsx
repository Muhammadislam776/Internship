import React, { useState } from 'react';
import { Doctor, Appointment } from '../../types';
import {
  Calendar,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  CalendarPlus,
  Stethoscope,
  Star,
  User,
  X
} from 'lucide-react';

interface BookAppointmentFlowProps {
  doctors: Doctor[];
  onCompleteBooking: (newAppt: {
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    dateTime: string;
    mode: 'video_consultation' | 'in_person';
    reasonForVisit: string;
  }) => Promise<Appointment>;
  onClose: () => void;
  onViewAppointments: () => void;
}

export const BookAppointmentFlow: React.FC<BookAppointmentFlowProps> = ({
  doctors,
  onCompleteBooking,
  onClose,
  onViewAppointments
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Reason
  const [selectedReason, setSelectedReason] = useState<string>('General Consultation');
  const [customReasonText, setCustomReasonText] = useState<string>('');

  // Step 2: Type
  const [consultationType, setConsultationType] = useState<'video_consultation' | 'in_person'>('video_consultation');

  // Step 3: Doctor
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || 'doc_1');

  // Step 4: Real-time Slot
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-30');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:30 AM');

  // Step 5: Confirmation result
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const availableSlots = [
    { time: '09:30 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: false }, // booked
    { time: '11:30 AM', available: true },
    { time: '02:00 PM', available: true },
    { time: '02:30 PM', available: false }, // booked
    { time: '03:15 PM', available: true },
    { time: '04:00 PM', available: true }
  ];

  const reasonOptions = [
    { label: 'General Consultation', desc: 'Discuss new or ongoing health concerns with your GP' },
    { label: 'Follow-up', desc: 'Review progress after recent treatment or medication change' },
    { label: 'Prescription Review', desc: 'Discuss repeat medications or inhaler technique' },
    { label: 'Health Check', desc: 'Routine preventative check-up, blood pressure & vitals' },
    { label: 'Other', desc: 'Specific administrative or clinical inquiry' }
  ];

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const handleConfirmBooking = async () => {
    setIsBookingLoading(true);
    try {
      // Calculate ISO date
      const [hourPart, minutePartWithAm] = selectedSlot.split(':');
      const [minutePart, ampm] = minutePartWithAm.split(' ');
      let hours = parseInt(hourPart);
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      const dateObj = new Date(selectedDate);
      dateObj.setHours(hours, parseInt(minutePart), 0, 0);

      const appt = await onCompleteBooking({
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        dateTime: dateObj.toISOString(),
        mode: consultationType,
        reasonForVisit: selectedReason === 'Other' && customReasonText ? customReasonText : selectedReason
      });

      setConfirmedAppt(appt);
      setStep(5);
    } catch (e) {
      console.error('Booking failed', e);
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleAddCalendar = () => {
    if (!confirmedAppt) return;
    const title = encodeURIComponent(`Consultation with ${confirmedAppt.doctorName}`);
    const details = encodeURIComponent(`Reason: ${confirmedAppt.reasonForVisit}\nType: ${confirmedAppt.mode === 'video_consultation' ? 'Video' : 'In-Person'}`);
    const location = encodeURIComponent('St. James Health Centre, London');
    const startIso = new Date(confirmedAppt.dateTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endIso = new Date(new Date(confirmedAppt.dateTime).getTime() + 15 * 60000).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {step < 5 ? `Book an Appointment (Step ${step} of 4)` : 'Appointment Confirmed'}
            </h3>
            <p className="text-xs text-slate-500">St. James Health Centre NHS Patient Booking</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: What do you need help with? */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-700">What do you need help with?</p>
            <div className="space-y-2">
              {reasonOptions.map((opt) => (
                <label
                  key={opt.label}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedReason === opt.label
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={selectedReason === opt.label}
                    onChange={() => setSelectedReason(opt.label)}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-xs font-bold">{opt.label}</p>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {selectedReason === 'Other' && (
              <input
                type="text"
                placeholder="Briefly describe your health question..."
                value={customReasonText}
                onChange={(e) => setCustomReasonText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            )}
          </div>
        )}

        {/* STEP 2: Choose Appointment Type */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-700">Choose Appointment Type</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  consultationType === 'video_consultation'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <input
                    type="radio"
                    name="type"
                    checked={consultationType === 'video_consultation'}
                    onChange={() => setConsultationType('video_consultation')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Video Consultation</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Consult securely from home via high-definition NHS video link.
                  </p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  consultationType === 'in_person'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    type="radio"
                    name="type"
                    checked={consultationType === 'in_person'}
                    onChange={() => setConsultationType('in_person')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold">In-Person Appointment</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Clinic visit at St. James Health Centre (London W1).
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: Choose Doctor */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-700">Choose Clinician</p>
            <div className="space-y-3">
              {doctors.slice(0, 3).map((doc) => (
                <label
                  key={doc.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedDoctorId === doc.id
                      ? 'border-blue-600 bg-blue-50/50 text-blue-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="doctor"
                      checked={selectedDoctorId === doc.id}
                      onChange={() => setSelectedDoctorId(doc.id)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                      <p className="text-[11px] text-slate-500 font-normal">{doc.specialty}</p>
                      <p className="text-[10px] text-blue-700 font-mono mt-0.5">{doc.gmcNumber}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Next Slot: Today
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Real-time Availability */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">
                Available Slots for {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((s) => (
                  <button
                    key={s.time}
                    type="button"
                    disabled={!s.available}
                    onClick={() => setSelectedSlot(s.time)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                      !s.available
                        ? 'bg-slate-100 text-slate-300 border border-slate-100 cursor-not-allowed line-through'
                        : selectedSlot === s.time
                        ? 'bg-blue-600 text-white shadow-xs cursor-pointer'
                        : 'bg-white border border-slate-200 hover:border-blue-300 text-slate-700 cursor-pointer'
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Clinician:</span>
                <span className="font-bold text-slate-900">{selectedDoctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation:</span>
                <span className="font-semibold text-blue-700 capitalize">
                  {consultationType === 'video_consultation' ? 'Secure Video' : 'In-Person Surgery'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Appointment Confirmed ✓ */}
        {step === 5 && confirmedAppt && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Confirmed ✓
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Appointment Booked Successfully
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                A confirmation has been saved to your health profile.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-left space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor</span>
                <strong className="text-slate-900">{confirmedAppt.doctorName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time</span>
                <strong className="text-blue-700">
                  {new Date(confirmedAppt.dateTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at {selectedSlot}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type</span>
                <span className="font-semibold capitalize text-slate-800">
                  {confirmedAppt.mode === 'video_consultation' ? 'Video Consultation' : 'In-Person Appointment'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleAddCalendar}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4" /> Add to Calendar
              </button>
              <button
                onClick={() => {
                  onClose();
                  onViewAppointments();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                View in My Appointments
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation (Steps 1-4) */}
        {step < 5 && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                Continue <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isBookingLoading}
                onClick={handleConfirmBooking}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                {isBookingLoading ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
