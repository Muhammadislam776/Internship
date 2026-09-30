import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RotaShift } from '../../types';
import {
  Users2,
  Calendar,
  Clock,
  Star,
  Award,
  TrendingUp,
  Activity,
  UserCheck,
  CheckCircle2,
  Plus,
  BarChart3,
  Building2,
  Stethoscope,
  SmilePlus,
  AlertCircle,
  XCircle
} from 'lucide-react';

export const StaffRotaTracker: React.FC = () => {
  const { rotaShifts, performanceMetrics, doctors, addRotaShift, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'rota' | 'performance'>('rota');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || 'doc_1');
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);

  // New shift state
  const [shiftDoctorId, setShiftDoctorId] = useState(doctors[0]?.id || 'doc_1');
  const [shiftDate, setShiftDate] = useState('2026-09-29');
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('17:00');
  const [room, setRoom] = useState('Consultation Room 3');
  const [shiftType, setShiftType] = useState<RotaShift['shiftType']>('full_day');
  const [maxCapacity, setMaxCapacity] = useState(28);

  const selectedMetric = performanceMetrics.find((m) => m.doctorId === selectedDoctorId) || performanceMetrics[0];
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find((d) => d.id === shiftDoctorId) || doctors[0];

    addRotaShift({
      doctorId: doc.id,
      doctorName: doc.name,
      specialty: doc.specialty,
      date: shiftDate,
      startTime,
      endTime,
      room,
      shiftType,
      maxPatientsCapacity: maxCapacity,
      status: 'scheduled'
    });

    setIsAddShiftOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-600">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Staff Rota & Clinician Performance Tracker</h2>
              <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                Practice Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Manage multi-specialty shifts, track daily patient throughput, consultation durations, and CSAT scores.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('rota')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'rota' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Staff Rota
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'performance' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Clinician CSAT & Metrics
            </button>
          </div>

          <button
            onClick={() => setIsAddShiftOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rota Shift</span>
          </button>
        </div>
      </div>

      {activeTab === 'rota' ? (
        /* ROTA SCHEDULE VIEW */
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Current Week Clinician Schedule</h3>
            <span className="text-xs text-slate-500 font-medium">Auto-synced with Google Calendar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rotaShifts.map((shift) => (
              <div
                key={shift.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-blue-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{shift.doctorName}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                    {shift.shiftType.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold text-slate-800">{shift.date}</span>
                    <span>({shift.startTime} - {shift.endTime})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{shift.room} • {shift.specialty}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1 pt-1 border-t border-slate-200">
                  <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
                    <span>Patient Capacity</span>
                    <span>{shift.bookedPatientsCount} / {shift.maxPatientsCapacity} booked</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (shift.bookedPatientsCount / shift.maxPatientsCapacity) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* PERFORMANCE & CSAT VIEW */
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedDoctor.name}</h3>
                  <p className="text-xs text-slate-500">{selectedDoctor.specialty} • {selectedDoctor.gmcNumber}</p>
                </div>
              </div>

              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>

            {/* Metric Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                <span className="text-[10px] text-blue-700 block uppercase font-bold">Monthly Patients</span>
                <span className="text-2xl font-black text-blue-950 font-mono">{selectedMetric.patientsSeen}</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block uppercase font-bold">Patient CSAT</span>
                <span className="text-2xl font-black text-emerald-950 font-mono">{selectedMetric.patientSatisfactionRate}%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Avg Consult Time</span>
                <span className="text-2xl font-black text-slate-900 font-mono">{selectedMetric.averageConsultationTimeMin}m</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                <span className="text-[10px] text-amber-700 block uppercase font-bold">No-Show Rate</span>
                <span className="text-2xl font-black text-amber-950 font-mono">{selectedMetric.noShowRate}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Shift Modal */}
      {isAddShiftOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Clinician Rota Shift</h3>
              <button onClick={() => setIsAddShiftOpen(false)} className="text-slate-400 hover:text-slate-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShift} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Doctor / Clinician</label>
                <select
                  value={shiftDoctorId}
                  onChange={(e) => setShiftDoctorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Shift Date</label>
                <input
                  type="date"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Room / Location</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddShiftOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
