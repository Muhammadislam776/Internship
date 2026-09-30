import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, Appointment } from '../../types';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Plus,
  Send,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { NewBookingModal } from './NewBookingModal';

export const PatientDirectoryView: React.FC = () => {
  const { patients, appointments, showToast } = useApp();

  const [query, setQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const filteredPatients = patients.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.nhsNumber.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.dob.includes(q)
    );
  });

  // Patient appointments (operational only)
  const patientAppointments = selectedPatient
    ? appointments
        .filter((a) => a.patientId === selectedPatient.id || a.patientPhone === selectedPatient.phone)
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    : [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Patient Directory & Operations Lookup
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              {patients.length} Registered
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational demographics, emergency contact and booking history (Protected PHI)
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedPatient(null);
            setIsBookingOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Register & Book Patient
        </button>
      </div>

      {/* Two Column Layout: Left Search list, Right Detailed Record */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Patient List & Search */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Name, NHS Number, DOB, Phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
            {filteredPatients.map((p) => {
              const isSelected = selectedPatient?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">{p.firstName} {p.lastName}</p>
                    <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                      {p.gender.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">NHS: {p.nhsNumber}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">DOB: {p.dob} · {p.phone}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Operational Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPatient ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
              {/* Header profile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                    {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </h2>
                    <p className="text-xs text-slate-500 font-mono">
                      NHS Number: <strong>{selectedPatient.nhsNumber}</strong> · DOB: {selectedPatient.dob} ({selectedPatient.gender})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Book Appointment
                  </button>
                  <button
                    onClick={() => {
                      showToast('info', 'Twilio SMS Triggered', `Quick SMS composer opened for ${selectedPatient.phone}`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-500" />
                    Send SMS
                  </button>
                </div>
              </div>

              {/* Operational Demographics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Contact Details
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <p className="flex items-center gap-2 text-slate-800">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <strong>Phone:</strong> {selectedPatient.phone}
                    </p>
                    <p className="flex items-center gap-2 text-slate-800 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <strong>Email:</strong> {selectedPatient.email}
                    </p>
                    <p className="flex items-start gap-2 text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{selectedPatient.address.line1}, {selectedPatient.address.city}, {selectedPatient.address.postcode}</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Emergency & Next of Kin
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-800">
                      <strong>Name:</strong> {selectedPatient.emergencyContact.name}
                    </p>
                    <p className="text-slate-800">
                      <strong>Relationship:</strong> {selectedPatient.emergencyContact.relationship}
                    </p>
                    <p className="text-slate-800">
                      <strong>Emergency Phone:</strong> {selectedPatient.emergencyContact.phone}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      GP Practice: {selectedPatient.gpPracticeName || 'St. James Health Centre'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking History (Strictly Operational - No Clinical SOAP) */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Appointment & Booking History ({patientAppointments.length})
                </h3>

                {patientAppointments.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                    No recorded appointments for this patient yet.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
                    {patientAppointments.map((appt) => (
                      <div key={appt.id} className="p-3 flex items-center justify-between hover:bg-slate-50/70">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {new Date(appt.dateTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(appt.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="capitalize text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {appt.mode.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {appt.doctorName} ({appt.doctorSpecialty}) · Reason: {appt.reasonForVisit}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          appt.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : appt.status === 'confirmed'
                            ? 'bg-blue-50 text-blue-700'
                            : appt.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {appt.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Privacy Notice */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Front-Desk View: Clinical diagnosis and confidential doctor notes are restricted to authorised clinicians only.</span>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
              Select a patient from the list on the left to view operational details.
            </div>
          )}
        </div>
      </div>

      <NewBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedPatient={selectedPatient}
      />
    </div>
  );
};
