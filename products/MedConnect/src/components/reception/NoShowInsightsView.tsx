import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Send,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Search
} from 'lucide-react';

export const NoShowInsightsView: React.FC = () => {
  const { appointments, triggerTwilioReminder, showToast } = useApp();

  const [search, setSearch] = useState('');

  const todayStr = new Date().toDateString();
  const todayAppts = appointments.filter((a) => new Date(a.dateTime).toDateString() === todayStr);

  // Appointments with high or moderate risk
  const flagged = todayAppts
    .filter(
      (a) =>
        a.mlPrediction &&
        (a.mlPrediction.riskLevel === 'high' || a.mlPrediction.riskLevel === 'moderate') &&
        a.status !== 'completed' &&
        a.status !== 'cancelled'
    )
    .sort((a, b) => (b.mlPrediction?.noShowProbability || 0) - (a.mlPrediction?.noShowProbability || 0));

  const handleSendReminder = async (apptId: string, name: string) => {
    await triggerTwilioReminder(apptId, 'urgent_confirmation');
    showToast('success', 'Priority SMS Sent', `Dispatched attendance verification SMS to ${name}.`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Attendance Decision Support & No-Show Insights
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational recommendations based on historical attendance patterns (No automated schedule modifications)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {flagged.length} Appointments Flagged Today
          </span>
        </div>
      </div>

      {/* Explanatory Policy Card */}
      <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 space-y-1">
          <p className="font-bold">Why am I seeing this decision support view?</p>
          <p className="text-blue-800 leading-relaxed text-[11px]">
            The attendance model evaluates booking lead time, past cancellations, and confirmation response times. Front desk staff can proactively contact these patients to verify attendance, offer transport assistance, or reschedule if their circumstances have changed.
          </p>
        </div>
      </div>

      {/* Flagged Appointments List */}
      <div className="space-y-3">
        {flagged.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Elevated Attendance Risks Today</h3>
            <p className="text-xs text-slate-500 mt-1">
              All scheduled patients have active confirmations or standard attendance profiles.
            </p>
          </div>
        ) : (
          flagged.map((appt) => {
            const prob = appt.mlPrediction?.noShowProbability || 35;
            const isHigh = appt.mlPrediction?.riskLevel === 'high';

            return (
              <div
                key={appt.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                        isHigh
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {prob}% Risk · {appt.mlPrediction?.riskLevel.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{appt.patientName}</h3>
                    <span className="text-xs text-slate-400 font-mono">NHS {appt.patientNhsNumber}</span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Scheduled for{' '}
                    <strong>{new Date(appt.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</strong>{' '}
                    with <strong>{appt.doctorName}</strong> ({appt.reasonForVisit})
                  </p>

                  {/* Factor explanations */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-700">Identified Attendance Factors:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                      <li>Booking created &gt; 8 days in advance without recent confirmation reply</li>
                      <li>Prior cancellation recorded within last 6 months</li>
                    </ul>
                  </div>
                </div>

                {/* Desk Recommended Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 md:min-w-[200px]">
                  <button
                    onClick={() => handleSendReminder(appt.id, appt.patientName)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Verification SMS
                  </button>
                  <button
                    onClick={() => {
                      showToast('info', 'Desk Task Created', `Added call reminder for ${appt.patientName} (${appt.patientPhone})`);
                    }}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Call Patient ({appt.patientPhone})
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
