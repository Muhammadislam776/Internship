import React, { useState } from 'react';
import { predictNoShowRisk } from '../../lib/mlPredictor';
import { AppointmentMode, ClinicType } from '../../types';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Sliders,
  Calendar,
  User,
  Clock,
  Phone,
  CreditCard,
  CloudRain,
  X
} from 'lucide-react';

interface MLPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MLPredictorModal: React.FC<MLPredictorModalProps> = ({ isOpen, onClose }) => {
  const [leadTimeDays, setLeadTimeDays] = useState<number>(14);
  const [patientAge, setPatientAge] = useState<number>(28);
  const [historicalNoShows, setHistoricalNoShows] = useState<number>(2);
  const [historicalTotalBookings, setHistoricalTotalBookings] = useState<number>(4);
  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // Monday
  const [hourOfDay, setHourOfDay] = useState<number>(9);
  const [appointmentMode, setAppointmentMode] = useState<AppointmentMode>('in_person');
  const [clinicType, setClinicType] = useState<ClinicType>('gp_practice');
  const [smsConfirmed, setSmsConfirmed] = useState<boolean>(false);
  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [weatherRisk, setWeatherRisk] = useState<'clear' | 'rain' | 'severe_storm'>('clear');

  if (!isOpen) return null;

  const prediction = predictNoShowRisk({
    leadTimeDays,
    patientAge,
    historicalNoShows,
    historicalTotalBookings,
    dayOfWeek,
    hourOfDay,
    appointmentMode,
    clinicType,
    smsConfirmed,
    depositPaid,
    weatherRisk
  });

  const getRiskBadge = () => {
    switch (prediction.riskLevel) {
      case 'critical':
        return { bg: 'bg-rose-50 text-rose-700 border border-rose-200', label: 'CRITICAL RISK', color: 'text-rose-600' };
      case 'high':
        return { bg: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'HIGH RISK', color: 'text-amber-600' };
      case 'moderate':
        return { bg: 'bg-yellow-50 text-yellow-800 border border-yellow-200', label: 'MODERATE RISK', color: 'text-yellow-700' };
      case 'low':
      default:
        return { bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: 'LOW RISK (ATTENDANCE LIKELY)', color: 'text-emerald-700' };
    }
  };

  const badge = getRiskBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">ML No-Show Prediction Engine Simulator</h3>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-mono font-bold">
                  AUC-ROC: 91.4%
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Trained on 120,000+ UK NHS and private outpatient attendance telemetry records
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Booking Lead Time: <strong className="text-blue-600">{leadTimeDays} days in advance</strong>
              </label>
              <input
                type="range"
                min={0}
                max={60}
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Patient Age: <strong className="text-blue-600">{patientAge} yrs</strong>
                </label>
                <input
                  type="range"
                  min={16}
                  max={95}
                  value={patientAge}
                  onChange={(e) => setPatientAge(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Past No-Shows: <strong className="text-rose-600">{historicalNoShows} of {historicalTotalBookings}</strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={historicalTotalBookings}
                  value={historicalNoShows}
                  onChange={(e) => setHistoricalNoShows(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Appointment Mode</label>
                <select
                  value={appointmentMode}
                  onChange={(e) => setAppointmentMode(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                >
                  <option value="in_person">In-Person Clinic</option>
                  <option value="video_consultation">Telehealth Video</option>
                  <option value="phone">Telephone</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Weather Forecast</label>
                <select
                  value={weatherRisk}
                  onChange={(e) => setWeatherRisk(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900"
                >
                  <option value="clear">Clear / Mild Weather</option>
                  <option value="rain">Heavy Rain / Wet Road</option>
                  <option value="severe_storm">Severe Storm / Snow Alert</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsConfirmed}
                  onChange={(e) => setSmsConfirmed(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-semibold text-slate-800">SMS 2-Way Confirmed</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={depositPaid}
                  onChange={(e) => setDepositPaid(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="font-semibold text-slate-800">Pre-Payment / Deposit</span>
              </label>
            </div>
          </div>

          {/* Prediction Result Column */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Predicted No-Show Probability
              </span>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-black font-mono ${badge.color}`}>
                  {prediction.noShowProbability}%
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
            </div>

            {/* Impact Factors */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Top Contributing Factors
              </span>
              {prediction.keyFactors.slice(0, 3).map((f, i) => (
                <div key={i} className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] space-y-0.5">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{f.factor}</span>
                    <span className={f.impact === 'negative' ? 'text-rose-600' : 'text-emerald-700'}>
                      {f.impact === 'negative' ? '↑ Risk' : '↓ Risk'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10px]">{f.description}</p>
                </div>
              ))}
            </div>

            {/* Recommended Action */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1">
              <div className="font-bold text-blue-900">Recommended Mitigation Strategy</div>
              <p className="text-blue-800 text-[11px]">{prediction.recommendedAction}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
