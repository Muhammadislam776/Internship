import React from 'react';
import { Appointment, Patient, PrescriptionRefillRequest } from '../../types';
import {
  Calendar,
  Video,
  Pill,
  FileText,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Heart,
  Activity,
  Phone,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface PatientHomeProps {
  patient: Patient;
  nextAppointment?: Appointment;
  upcomingAppointments: Appointment[];
  activePrescriptions: PrescriptionRefillRequest[];
  onOpenBooking: () => void;
  onJoinTelehealth: (appt: Appointment) => void;
  onOpenPrescriptions: () => void;
  onOpenIntake: () => void;
  onViewAllAppointments: () => void;
  onViewAppointmentDetails: (appt: Appointment) => void;
}

const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export const PatientHome: React.FC<PatientHomeProps> = ({
  patient,
  nextAppointment,
  upcomingAppointments,
  activePrescriptions,
  onOpenBooking,
  onJoinTelehealth,
  onOpenPrescriptions,
  onOpenIntake,
  onViewAllAppointments,
  onViewAppointmentDetails
}) => {
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  const isNextApptToday = nextAppointment && new Date(nextAppointment.dateTime).toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ── 1. Compact Patient Header (Zero clutter, clean identity) ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
            {patient.firstName[0]}{patient.lastName ? patient.lastName[0] : ''}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {getGreeting()}, {patient.firstName}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> NHS Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
              <span>Registered with <strong className="text-slate-700 font-medium">{patient.gpPracticeName || 'St. James Health Centre'}</strong></span>
              <span>•</span>
              <span>NHS Number: <strong className="font-mono text-slate-700 font-medium">{patient.nhsNumber}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your healthcare records are secure & protected</span>
        </div>
      </div>

      {/* ── 2. SECTION 1: YOUR NEXT APPOINTMENT (Highest Visual Hierarchy) ── */}
      {nextAppointment ? (
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-10 top-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-xs text-blue-100 px-3 py-1 rounded-full border border-white/20">
                  Your Next Appointment
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                </span>
                {isNextApptToday && (
                  <span className="text-xs font-bold bg-orange-500 text-white px-3 py-1 rounded-full animate-pulse">
                    Today
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {nextAppointment.doctorName}
                </h2>
                <p className="text-blue-200 text-sm font-medium mt-0.5">
                  {nextAppointment.doctorSpecialty || 'General Practitioner'} · {nextAppointment.reasonForVisit}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-200 uppercase font-bold tracking-wider">Date & Time</p>
                    <p className="text-sm font-semibold text-white">
                      {formatDate(nextAppointment.dateTime)} at {formatTime(nextAppointment.dateTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    {nextAppointment.mode === 'video_consultation' ? (
                      <Video className="w-5 h-5 text-emerald-300" />
                    ) : (
                      <MapPin className="w-5 h-5 text-orange-300" />
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-200 uppercase font-bold tracking-wider">Consultation Type</p>
                    <p className="text-sm font-semibold text-white">
                      {nextAppointment.mode === 'video_consultation' ? 'Secure Video Consultation' : 'In-Person Appointment (Clinic)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions for Next Appointment */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:min-w-[220px]">
              {nextAppointment.mode === 'video_consultation' ? (
                <button
                  onClick={() => onJoinTelehealth(nextAppointment)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/30 transition-all cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  Join Video Consultation
                </button>
              ) : (
                <a
                  href="https://maps.google.com/?q=St+James+Health+Centre+London"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-md transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </a>
              )}

              <button
                onClick={() => onViewAppointmentDetails(nextAppointment)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/20 active:scale-[0.98] text-white font-semibold text-xs rounded-xl border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
              >
                View Appointment Details
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">You don't have any upcoming appointments</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Book a consultation with your registered GP practice. Video and in-person appointments are available.
          </p>
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <Calendar className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      )}

      {/* ── 3. SECTION 2: QUICK ACTIONS (4 Clear Touch-Friendly Cards) ── */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={onOpenBooking}
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Book Appointment
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Choose doctor & time slot
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              if (nextAppointment) onJoinTelehealth(nextAppointment);
              else onOpenBooking();
            }}
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Join Consultation
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Enter video waiting room
              </p>
            </div>
          </button>

          <button
            onClick={onOpenPrescriptions}
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-300 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                Request Refill
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Order repeat medication
              </p>
            </div>
          </button>

          <button
            onClick={onOpenIntake}
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Health Forms
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Complete pre-visit intake
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ── 4. SECTION 3: UPCOMING APPOINTMENTS LIST (2-3 items) ── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Upcoming Appointments</h3>
            <p className="text-xs text-slate-500 mt-0.5">Your confirmed consultations with the clinic</p>
          </div>
          <button
            onClick={onViewAllAppointments}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            View All ({upcomingAppointments.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {upcomingAppointments.slice(0, 3).map((appt) => {
              const statusBadge =
                appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                appt.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-slate-100 text-slate-600 border-slate-200';

              return (
                <div
                  key={appt.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2 -mx-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {appt.mode === 'video_consultation' ? (
                        <Video className="w-5 h-5 text-blue-600" />
                      ) : (
                        <MapPin className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{appt.doctorName}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge}`}>
                          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {appt.reasonForVisit} · <span className="font-medium text-slate-700">{formatDate(appt.dateTime)} at {formatTime(appt.dateTime)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {appt.mode === 'video_consultation' && (
                      <button
                        onClick={() => onJoinTelehealth(appt)}
                        className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Join Video
                      </button>
                    )}
                    <button
                      onClick={() => onViewAppointmentDetails(appt)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500">
            No upcoming appointments scheduled.
          </div>
        )}
      </div>

      {/* ── 5. SECTION 4: HEALTH FORMS & PRESCRIPTION SUMMARY ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Health Forms Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Health Questionnaires</h3>
                  <p className="text-[11px] text-slate-500">Required before your consultation</p>
                </div>
              </div>
              <button
                onClick={onOpenIntake}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Pre-Consultation Intake</p>
                    <p className="text-[10px] text-slate-500">Medical history & current symptoms</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Personal Health Record</p>
                    <p className="text-[10px] text-slate-500">Verified via NHS demographic database</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Completed ✓
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenIntake}
            className="w-full mt-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
          >
            Complete Health Questionnaire
          </button>
        </div>

        {/* Prescriptions Summary Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">My Repeat Prescriptions</h3>
                  <p className="text-[11px] text-slate-500">NHS Electronic Prescribing Service (EPS)</p>
                </div>
              </div>
              <button
                onClick={onOpenPrescriptions}
                className="text-xs font-bold text-orange-600 hover:text-orange-800"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {activePrescriptions.length > 0 ? (
                activePrescriptions.slice(0, 2).map((rx) => (
                  <div key={rx.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{rx.medicationName}</p>
                      <p className="text-[10px] text-slate-500">{rx.frequency || rx.dosage}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Salbutamol 100mcg Inhaler</p>
                    <p className="text-[10px] text-slate-500">1-2 puffs when required</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onOpenPrescriptions}
            className="w-full mt-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
          >
            Request Prescription Refill
          </button>
        </div>
      </div>
    </div>
  );
};
