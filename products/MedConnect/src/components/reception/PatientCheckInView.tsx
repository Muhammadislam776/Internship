import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  CheckCircle2,
  Search,
  UserCheck,
  Clock,
  User,
  Calendar,
  AlertCircle,
  Plus,
  Volume2
} from 'lucide-react';
import { WalkInModal } from './WalkInModal';

export const PatientCheckInView: React.FC = () => {
  const { appointments, doctors, updateAppointmentStatus, showToast } = useApp();

  const [query, setQuery] = useState('');
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);

  const todayStr = new Date().toDateString();
  const todayAppts = appointments.filter((a) => new Date(a.dateTime).toDateString() === todayStr);

  // Search match for today's appointment
  const matches = query.trim()
    ? todayAppts.filter(
        (a) =>
          a.patientName.toLowerCase().includes(query.toLowerCase()) ||
          a.patientNhsNumber.toLowerCase().includes(query.toLowerCase()) ||
          a.patientPhone.includes(query)
      )
    : [];

  const waitingPatients = todayAppts.filter((a) => a.status === 'in_progress');

  const handleInstantCheckIn = (appt: Appointment) => {
    updateAppointmentStatus(appt.id, 'in_progress');
    const doc = doctors.find((d) => d.id === appt.doctorId);
    showToast(
      'success',
      'Arrival Recorded & Checked In',
      `${appt.patientName} checked in. Assigned to Waiting Area for ${doc?.name || 'Clinician'} (Room ${doc?.roomNumber}).`
    );
    setQuery('');
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            Fast Patient Check-in
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rapid patient arrival logging, NHS number verification, and queue placement
          </p>
        </div>

        <button
          onClick={() => setIsWalkInOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Walk-in Check-in
        </button>
      </div>

      {/* Main Terminal Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <label className="text-xs font-bold text-slate-700 block">
          Scan Barcode, enter NHS Number, Patient Name, or Mobile Number:
        </label>
        <div className="relative">
          <Search className="w-5 h-5 text-blue-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 485 772 9012, Islam Jutt, or +44 7700..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-blue-100 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Search Results / Matches */}
        {query.trim() && (
          <div className="pt-2 space-y-2">
            <p className="text-xs font-bold text-slate-600">Matching Appointments for Today ({matches.length}):</p>
            {matches.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No scheduled appointment found for "{query}" today.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  If this patient arrived without an appointment, use Walk-in Intake.
                </p>
                <button
                  onClick={() => setIsWalkInOpen(true)}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                >
                  Register as Walk-in Patient
                </button>
              </div>
            ) : (
              matches.map((appt) => {
                const doc = doctors.find((d) => d.id === appt.doctorId);
                const isAlreadyCheckedIn = appt.status === 'in_progress';

                return (
                  <div
                    key={appt.id}
                    className="p-4 bg-blue-50/40 border-2 border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {appt.patientName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{appt.patientName}</h3>
                        <p className="text-xs text-slate-600 font-mono">
                          NHS {appt.patientNhsNumber} · {appt.patientPhone}
                        </p>
                        <p className="text-xs text-blue-700 font-semibold mt-0.5">
                          {formatTime(appt.dateTime)} with {doc?.name} (Room {doc?.roomNumber}) · {appt.reasonForVisit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAlreadyCheckedIn ? (
                        <span className="px-4 py-2 bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-300 flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> Already in Waiting Room
                        </span>
                      ) : (
                        <button
                          onClick={() => handleInstantCheckIn(appt)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                          <UserCheck className="w-4 h-4" />
                          Confirm Arrival & Check In
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Live Waiting Patients list */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900">Currently Waiting Patients ({waitingPatients.length})</h2>
          </div>
          <span className="text-xs text-slate-400">Sorted by arrival time</span>
        </div>

        {waitingPatients.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-medium">
            Waiting room is currently empty
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {waitingPatients.map((p, idx) => {
              const doc = doctors.find((d) => d.id === p.doctorId);
              const waitMins = 8 + idx * 6;
              return (
                <div key={p.id} className="py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 text-xs font-black flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{p.patientName}</p>
                      <p className="text-[10px] text-slate-500">
                        Seeing {doc?.name} (Room {doc?.roomNumber}) · {p.reasonForVisit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      waitMins > 15 ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Waiting {waitMins} min
                    </span>
                    <button
                      onClick={() => {
                        showToast('info', `Called to Room ${doc?.roomNumber}`, `Announced ${p.patientName} to proceed to Room ${doc?.roomNumber}.`);
                      }}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Volume2 className="w-3 h-3" /> Call
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <WalkInModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
      />
    </div>
  );
};
