import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TwilioService } from '../../lib/twilioSimulator';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Bell,
  Sparkles,
  Smartphone
} from 'lucide-react';

export const FrontDeskMessaging: React.FC = () => {
  const { twilioLogs, appointments, patients, triggerTwilioReminder, simulatePatientSmsReply, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'DELIVERED' | 'REPLIED' | 'FAILED'>('all');

  // Custom single message state
  const [recipientPhone, setRecipientPhone] = useState('+44 7700 ');
  const [recipientName, setRecipientName] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Broadcast state
  const [isBroadcastModal, setIsBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState(
    'Notice from St. James Practice: Today clinics are experiencing minor delays of approximately 15 minutes. We thank you for your patience.'
  );

  const filteredLogs = twilioLogs.filter((log) => {
    if (statusFilter !== 'all' && log.status !== statusFilter) return false;
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      log.recipientName.toLowerCase().includes(q) ||
      log.recipientPhone.includes(q) ||
      log.message.toLowerCase().includes(q)
    );
  });

  const handleSendSingleSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientPhone || !customBody.trim()) {
      showToast('error', 'Missing Information', 'Phone number and message text are required.');
      return;
    }

    setIsSending(true);
    try {
      const { log } = await TwilioService.dispatchSms({
        toPhone: recipientPhone,
        patientName: recipientName || 'Patient',
        appointmentId: 'desk_custom',
        appointmentTime: 'Today',
        doctorName: 'Front Desk',
        clinicName: 'St. James Practice',
        type: 'standard_reminder'
      });
      // override text
      log.message = customBody;

      showToast('success', 'SMS Delivered', `Sent to ${recipientPhone} via Twilio.`);
      setCustomBody('');
      setRecipientName('');
    } catch (e) {
      console.error(e);
      showToast('error', 'Delivery Failed', 'Unable to send SMS message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSimulateReply = (logId: string, replyText: string) => {
    simulatePatientSmsReply(logId, replyText);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Patient SMS & Communication Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Twilio-powered automated reminders, delay broadcasts, and operational SMS
          </p>
        </div>

        <button
          onClick={() => setIsBroadcastModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Bell className="w-4 h-4" />
          Broadcast Delay Alert
        </button>
      </div>

      {/* Grid: Left Composer, Right Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Quick SMS Composer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" />
            Send Direct SMS to Patient
          </h2>

          <form onSubmit={handleSendSingleSms} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Patient Name</label>
              <input
                type="text"
                placeholder="e.g. David Clarke"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone Number *</label>
              <input
                type="tel"
                required
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Message Content *</label>
              <textarea
                required
                rows={4}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                placeholder="e.g. Please note your consultation with Dr. Jenkins is ready in Room 1. Please proceed to the room."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 resize-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Standard 160 GSM SMS characters</span>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSending ? 'Sending SMS...' : 'Dispatch SMS'}
            </button>
          </form>

          {/* Preset Templates */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-600">Quick Templates</span>
            <div className="space-y-1.5">
              {[
                {
                  label: 'Doctor is ready in room',
                  text: 'St. James Practice: Dr. Jenkins is ready to see you now in Consultation Room 1.'
                },
                {
                  label: 'Running 15m late',
                  text: 'St. James Practice: Your appointment is running approximately 15 minutes behind schedule. We apologize for the wait.'
                },
                {
                  label: 'Prescription ready to collect',
                  text: 'St. James Practice: Your repeat prescription has been approved and is ready for collection at the front desk.'
                }
              ].map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setCustomBody(t.text)}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-[11px] text-slate-700 hover:text-blue-700 border border-slate-200/60 transition-colors"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Message Log */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Communication History</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                {filteredLogs.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search SMS logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="DELIVERED">Delivered</option>
                <option value="REPLIED">Replied</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100 flex-1 max-h-[600px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">No communication logs match criteria.</div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{log.recipientName}</span>
                      <span className="text-[10px] font-mono text-slate-500">({log.recipientPhone})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.status === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : log.status === 'REPLIED'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {log.message}
                  </p>

                  {/* If patient replied */}
                  {log.patientReply ? (
                    <div className="flex items-center gap-2 text-[11px] text-blue-700 bg-blue-50/60 p-2 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        <strong>Patient Replied:</strong> "{log.patientReply}"
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <span className="text-slate-400">Simulate reply:</span>
                      <button
                        onClick={() => handleSimulateReply(log.id, 'YES')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded text-[10px] font-semibold"
                      >
                        "YES"
                      </button>
                      <button
                        onClick={() => handleSimulateReply(log.id, 'RESCHEDULE')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 rounded text-[10px] font-semibold"
                      >
                        "RESCHEDULE"
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {isBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                Clinic-wide Delay Broadcast
              </h3>
              <button
                onClick={() => setIsBroadcastModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              This message will be dispatched via Twilio SMS to all patients with appointments booked for today who have not yet arrived.
            </p>

            <textarea
              rows={4}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBroadcastModal(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('success', 'Delay Broadcast Dispatched', 'Broadcast sent to all remaining scheduled patients for today.');
                  setIsBroadcastModal(false);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
