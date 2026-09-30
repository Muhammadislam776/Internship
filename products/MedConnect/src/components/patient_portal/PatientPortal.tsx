import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DigitalIntakeForm } from '../intake/DigitalIntakeForm';
import {
  UserCircle2,
  Calendar,
  Video,
  Pill,
  FileCheck2,
  Lock,
  Clock,
  ShieldCheck,
  AlertCircle,
  Plus,
  Download,
  ChevronRight,
  ExternalLink,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const {
    patients,
    currentPatientId,
    setCurrentPatientId,
    appointments,
    refillRequests,
    setActiveTelehealthAppointment,
    setActiveTab,
    createRefillRequest,
    showToast
  } = useApp();

  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const patient = patients.find((p) => p.id === currentPatientId) || patients[0];

  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);
  const patientRefills = refillRequests.filter((r) => r.patientId === patient.id);

  return (
    <div className="space-y-6">
      {/* Patient Profile Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-xs">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">
                {patient.firstName} {patient.lastName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                NHS Verified
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
              <span>NHS Number: <strong className="font-mono text-blue-700">{patient.nhsNumber}</strong></span>
              <span>•</span>
              <span>DOB: {patient.dob}</span>
              <span>•</span>
              <span>GP: {patient.gpPracticeName || 'St. James Health Centre'}</span>
            </div>
          </div>
        </div>

        {/* Patient Switcher for Demo */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
          <span className="text-[11px] text-slate-500 font-semibold">Demo Patient:</span>
          <select
            value={currentPatientId}
            onChange={(e) => setCurrentPatientId(e.target.value)}
            className="bg-transparent text-xs text-slate-800 focus:outline-none cursor-pointer font-bold"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} (NHS: {p.nhsNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pre-Arrival Intake Form Banner (if not completed) */}
      {!patient.intakeFormCompleted && (
        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-900">Pre-Arrival Medical Intake Required</h3>
              <p className="text-xs text-blue-700">
                Please complete your medical history before your appointment. Encrypted client-side under AES-256.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowIntakeForm(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            Complete Digital Intake
          </button>
        </div>
      )}

      {/* Modal/Drawer for Intake form */}
      {showIntakeForm && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Digital Pre-Arrival Form</h3>
            <button
              onClick={() => setShowIntakeForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Close Form
            </button>
          </div>
          <DigitalIntakeForm patientId={patient.id} onComplete={() => setShowIntakeForm(false)} />
        </div>
      )}

      {/* Upcoming Visits */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>My Upcoming Consultations</span>
          </h3>
          <button
            onClick={() => setActiveTab('scheduler')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Book New Appointment</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {patientAppointments.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No upcoming appointments scheduled.</p>
          ) : (
            patientAppointments.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{app.doctorName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold uppercase">
                      {app.mode.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{app.reasonForVisit}</p>
                  <div className="text-xs text-slate-500 font-mono flex items-center gap-2 pt-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{new Date(app.dateTime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {app.mode === 'video_consultation' && (
                    <button
                      onClick={() => {
                        setActiveTelehealthAppointment(app);
                        setActiveTab('telehealth');
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Telehealth Call</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Repeat Prescriptions Summary */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-4 h-4 text-blue-600" />
            <span>My Repeat Prescriptions</span>
          </h3>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Request Refill</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {patientRefills.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">No active repeat prescription requests.</p>
          ) : (
            patientRefills.map((refill) => (
              <div
                key={refill.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{refill.medicationName}</div>
                  <div className="text-slate-500">{refill.dosage} — {refill.frequency}</div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    refill.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {refill.status.replace('_', ' ')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
