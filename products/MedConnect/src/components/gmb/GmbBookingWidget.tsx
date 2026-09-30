import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GoogleCalendarService } from '../../lib/googleCalendar';
import {
  Search,
  MapPin,
  Star,
  Globe,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  DollarSign
} from 'lucide-react';

export const GmbBookingWidget: React.FC = () => {
  const { doctors, createAppointment, showToast } = useApp();

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || 'doc_1');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-29');
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [patientName, setPatientName] = useState<string>('Harry Mitchell');
  const [patientNhs, setPatientNhs] = useState<string>('772 109 8831');
  const [patientPhone, setPatientPhone] = useState<string>('+44 7700 900555');
  const [patientEmail, setPatientEmail] = useState<string>('harry.mitchell@example.co.uk');
  const [reason, setReason] = useState<string>('Routine checkup & private consultation');
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const handleGmbBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createAppointment({
        patientId: `pat_gmb_${Date.now().toString().slice(-4)}`,
        patientName,
        patientNhsNumber: patientNhs,
        patientPhone,
        patientEmail,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        clinicType: selectedDoctor.clinicType,
        dateTime: `${selectedDate}T${selectedTime}:00.000Z`,
        durationMinutes: 20,
        mode: 'in_person',
        status: 'confirmed',
        reasonForVisit: reason,
        gmbSource: true,
        paymentStatus: 'exempt_nhs'
      });

      setIsBooked(true);
      showToast('success', 'Booked via Google Profile', 'Google Calendar synchronized in real-time. Confirmation SMS sent.');
    } catch (err) {
      showToast('error', 'Booking error', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Strategy Hero Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Search className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Google Business Profile (GMB) Direct Booking Strategy
              </h2>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                Zero Receptionist Phone Queues
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              UK patients search for clinics on Google Maps. Instead of waiting on phone hold at 8:00 AM, ClinicFlow allows patients to click <strong className="text-blue-600">"Book Appointment"</strong> directly on Google with real-time 2-way calendar sync.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-blue-700 font-mono font-bold">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>SaaS Conversion: +340% Higher Patient Bookings</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Simulated Google Search/Maps Profile + Interactive Booking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Google Search Listing Preview (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">Google Search & Maps Listing Preview</span>
            </div>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">Live Widget</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div>
              <h3 className="text-base font-bold text-blue-700 hover:underline cursor-pointer">
                St. James Health Centre — London W1 GP & Dental Practice
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                <span className="flex items-center text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9
                </span>
                <span className="text-slate-400">•</span>
                <span>(342 Google Reviews)</span>
                <span className="text-slate-400">•</span>
                <span>Medical Clinic in London</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>14 St. James's Square, London SW1Y 4LG</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-emerald-700 font-bold">Open now • Closes 18:30</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+44 20 7946 0912</span>
              </div>
            </div>

            {/* Simulated Google Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs">
                Book Online (ClinicFlow)
              </button>
              <button className="px-3 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">
                Directions
              </button>
              <button className="px-3 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">
                Call
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Instant Booking Form (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Direct Google Appointment Reservation</span>
            </h3>
            <span className="text-[10px] text-emerald-700 font-bold">2-Way Sync</span>
          </div>

          {isBooked ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Appointment Confirmed!</h4>
              <p className="text-xs text-slate-600">
                Created on Google Calendar and automated Twilio confirmation SMS sent to {patientPhone}.
              </p>
              <button
                onClick={() => setIsBooked(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Book Another Slot
              </button>
            </div>
          ) : (
            <form onSubmit={handleGmbBook} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Attending Clinician</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 focus:bg-white"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time</label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone (for Twilio SMS)</label>
                  <input
                    type="text"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Visit</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Syncing with Google Calendar...' : 'Confirm Appointment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
