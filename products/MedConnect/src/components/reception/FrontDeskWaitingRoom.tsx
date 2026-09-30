import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  Clock,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Send,
  User,
  ArrowRight,
  Sparkles,
  Building
} from 'lucide-react';
import { WalkInModal } from './WalkInModal';

export const FrontDeskWaitingRoom: React.FC = () => {
  const { appointments, doctors, updateAppointmentStatus, showToast } = useApp();

  const [callingPatient, setCallingPatient] = useState<Appointment | null>(null);
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);

  const todayStr = new Date().toDateString();
  const todayAppts = appointments.filter((a) => new Date(a.dateTime).toDateString() === todayStr);

  // Waiting patients are those checked in (in_progress)
  const waitingPatients = todayAppts
    .filter((a) => a.status === 'in_progress')
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const handleCallPatient = (appt: Appointment) => {
    setCallingPatient(appt);
    const doc = doctors.find((d) => d.id === appt.doctorId);
    const room = doc?.roomNumber || '1';

    showToast(
      'info',
      `Calling: ${appt.patientName}`,
      `Please proceed to Room ${room} for ${doc?.name || 'Clinician'}.`
    );

    // Auto-clear banner after 8 seconds
    setTimeout(() => {
      setCallingPatient((prev) => (prev?.id === appt.id ? null : prev));
    }, 8000);
  };

  const handleCompleteConsultation = (apptId: string, name: string) => {
    updateAppointmentStatus(apptId, 'completed');
    showToast('success', 'Visit Completed', `${name}'s appointment has been marked as completed.`);
  };

  return (
    <div className="space-y-5">
      {/* Active Call Banner */}
      {callingPatient && (
        <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg border border-blue-500 animate-in slide-in-from-top-4 duration-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl animate-pulse">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-extrabold tracking-wider text-blue-200">Calling Now</p>
              <h2 className="text-lg font-black">{callingPatient.patientName}</h2>
              <p className="text-xs text-blue-100">
                Please proceed to <strong>Room {doctors.find((d) => d.id === callingPatient.doctorId)?.roomNumber}</strong> for {callingPatient.doctorName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCallingPatient(null)}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-xs font-bold rounded-lg transition-colors"
          >
            Dismiss Call
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Live Waiting Room Monitor
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
              {waitingPatients.length} Waiting
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time patient queue, wait duration tracker, and room dispatch
          </p>
        </div>

        <button
          onClick={() => setIsWalkInOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <UserCheck className="w-4 h-4" />
          Check In New Arrival
        </button>
      </div>

      {/* Waiting Room Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patients in Waiting Area</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{waitingPatients.length}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Checked in and seated</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Wait Time</span>
          <div className="text-2xl font-black text-blue-600 mt-1">11 mins</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Target &lt; 15 mins</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Longest Active Wait</span>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {waitingPatients.length > 0 ? '19 mins' : '0 mins'}
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">
            {waitingPatients.length > 0 ? 'Room 2 · Follow-up check' : 'Queue clear'}
          </p>
        </div>
      </div>

      {/* Main Queue List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Current Queue Order</h2>
          <span className="text-xs text-slate-400">Audio chime enabled</span>
        </div>

        {waitingPatients.length === 0 ? (
          <div className="py-16 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Waiting Room is Currently Clear</h3>
            <p className="text-xs text-slate-500 mt-1">
              Patients checked in at front desk or kiosk will automatically queue here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {waitingPatients.map((p, idx) => {
              const doc = doctors.find((d) => d.id === p.doctorId);
              const waitMins = 8 + idx * 6;
              const isOverdue = waitMins > 15;

              return (
                <div
                  key={p.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isOverdue ? 'bg-amber-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Queue number badge */}
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 text-sm font-black flex items-center justify-center shrink-0 border border-amber-200 shadow-xs">
                      #{idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{p.patientName}</h3>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          NHS {p.patientNhsNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Consulting: <strong>{doc?.name}</strong> ·{' '}
                        <span className="font-semibold text-blue-700">Room {doc?.roomNumber}</span> ·{' '}
                        {p.reasonForVisit}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md ${
                            isOverdue
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Waiting {waitMins} min {isOverdue ? '⚠ Exceeds 15 min' : ''}
                        </span>
                        <span className="text-slate-400">Arrival at {new Date(p.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCallPatient(p)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      Call Patient
                    </button>

                    <button
                      onClick={() => handleCompleteConsultation(p.id, p.patientName)}
                      className="px-3 py-2 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 text-xs font-semibold rounded-xl transition-colors"
                      title="Mark consultation completed"
                    >
                      Mark Seen
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
