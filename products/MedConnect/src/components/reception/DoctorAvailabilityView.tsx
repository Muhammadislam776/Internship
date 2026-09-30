import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Clock,
  UserCheck,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Plus
} from 'lucide-react';
import { NewBookingModal } from './NewBookingModal';

export const DoctorAvailabilityView: React.FC = () => {
  const { doctors, appointments } = useApp();

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const todayStr = new Date().toDateString();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Doctor Availability & Room Allocation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time clinician attendance, room numbers, and slot capacity for front desk dispatch
          </p>
        </div>

        <button
          onClick={() => setIsBookingOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Book Slot
        </button>
      </div>

      {/* Grid of Clinicians */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {doctors.map((doc, idx) => {
          const docTodayAppts = appointments.filter(
            (a) => a.doctorId === doc.id && new Date(a.dateTime).toDateString() === todayStr
          );
          const completed = docTodayAppts.filter((a) => a.status === 'completed').length;
          const remaining = docTodayAppts.filter((a) => a.status !== 'completed' && a.status !== 'cancelled').length;
          const capacity = doc.dailyPatientCapacity || 16;
          const percentBooked = Math.min(100, Math.round((docTodayAppts.length / capacity) * 100));

          // Simulated status
          const status = idx === 0 ? 'In Consultation' : idx === 1 ? 'Available' : 'Available';

          return (
            <div
              key={doc.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Doctor Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-xs"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-slate-500">{doc.specialty}</p>
                    <p className="text-[10px] text-blue-600 font-mono mt-0.5">GMC {doc.gmcNumber}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    status === 'In Consultation'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {status}
                </span>
              </div>

              {/* Consultation Room & Shift */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Location
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    Room {doc.roomNumber}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Shift Hours
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    08:30 – 17:00
                  </span>
                </div>
              </div>

              {/* Daily Patient Load Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Daily Capacity</span>
                  <span className="font-bold text-slate-900">
                    {docTodayAppts.length} / {capacity} booked ({percentBooked}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentBooked > 85 ? 'bg-orange-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${percentBooked}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>{completed} Completed</span>
                  <span>{remaining} Remaining</span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  setSelectedDoctorId(doc.id);
                  setIsBookingOpen(true);
                }}
                className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
              >
                + Book Patient with {doc.name.split(' ').slice(-1)[0]}
              </button>
            </div>
          );
        })}
      </div>

      <NewBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
