import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TwilioLog } from '../../types';
import {
  MessageSquareCode,
  PhoneCall,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Smartphone,
  Phone,
  RotateCcw,
  Zap
} from 'lucide-react';

export const TwilioMessageCenter: React.FC = () => {
  const { twilioLogs, simulatePatientSmsReply, appointments, showToast } = useApp();

  const [selectedLogId, setSelectedLogId] = useState<string>(twilioLogs[0]?.id || '');
  const [patientReplyInput, setPatientReplyInput] = useState<string>('YES I WILL ATTEND');

  const selectedLog = twilioLogs.find((l) => l.id === selectedLogId) || twilioLogs[0];
  const totalCostGbp = twilioLogs.reduce((acc, l) => acc + l.costGbp, 0).toFixed(3);

  const handleSimulateReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLog) return;
    simulatePatientSmsReply(selectedLog.id, patientReplyInput);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Twilio 2-Way SMS & Voice Dispatch Center</h2>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                Interactive Webhooks Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Automatic delivery of reminder SMS, urgent voice calls, and automated webhook parsing for attendance confirmation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500">Twilio Outbound Cost:</span>
          <span className="text-emerald-700 font-mono font-bold">£{totalCostGbp} GBP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live SMS Logs (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Outbound SMS & Automated Call Logs</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">{twilioLogs.length} messages</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {twilioLogs.map((log) => {
              const isSelected = selectedLog?.id === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLogId(log.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{log.recipientName}</span>
                      <span className="text-[11px] font-mono text-blue-700">({log.recipientPhone})</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        log.status === 'REPLIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-sans leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                    {log.message}
                  </p>

                  <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                    <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString('en-GB')}</span>
                    {log.patientReply && (
                      <span className="text-emerald-700 font-bold">
                        Patient Replied: "{log.patientReply}"
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inbound Twilio Webhook Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Simulate Patient Inbound SMS</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate Twilio SMS replies (YES / NO / RESCHEDULE) to test automated confirmation triggers.
            </p>
          </div>

          {selectedLog ? (
            <form onSubmit={handleSimulateReply} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Replying to Message:</span>
                <p className="text-slate-800 font-medium line-clamp-2">{selectedLog.message}</p>
                <div className="text-[11px] text-blue-700 font-mono pt-1">
                  Recipient: {selectedLog.recipientName} ({selectedLog.recipientPhone})
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Patient SMS Response Text
                </label>
                <input
                  type="text"
                  value={patientReplyInput}
                  onChange={(e) => setPatientReplyInput(e.target.value)}
                  placeholder="e.g. YES, NO, CANCEL, CONFIRMED"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              {/* Fast quick reply buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPatientReplyInput('YES - CONFIRMED')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold"
                >
                  ✓ "YES - CONFIRMED"
                </button>
                <button
                  type="button"
                  onClick={() => setPatientReplyInput('CANCEL APPOINTMENT')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold"
                >
                  ✗ "CANCEL"
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simulate Inbound Webhook</span>
              </button>
            </form>
          ) : (
            <p className="text-xs text-slate-500">Select an SMS log on the left to simulate a patient reply.</p>
          )}
        </div>
      </div>
    </div>
  );
};
