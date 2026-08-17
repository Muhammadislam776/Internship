import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Mail, Search, Eye, X, ExternalLink, RefreshCw } from 'lucide-react';
import { generateEmailHTML } from '../utils/emailTemplates';

export default function EmailLogs({ events = [] }) {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = events.filter(e => {
    const matchesSearch =
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search email recipient or subject..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs text-[#071A2B] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-[#64748B] shrink-0">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs text-[#071A2B] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Delivery Statuses</option>
            <option value="SENT">SENT (Emerald)</option>
            <option value="PROCESSING">PROCESSING (Orange)</option>
            <option value="FAILED">FAILED (Red)</option>
            <option value="PENDING">PENDING (Blue)</option>
          </select>
        </div>
      </div>

      {/* Email Logs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 glass-card p-12 text-center text-slate-400 text-xs">
            No transactional email logs found matching search.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedEmail(item)}
              className="glass-card rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#2563EB]/40 transition-all cursor-pointer group relative overflow-hidden"
            >
              {/* Left Color Indicator Stripe */}
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                item.status === 'SENT' ? 'bg-[#22C55E]' : item.status === 'FAILED' ? 'bg-[#EF4444]' : 'bg-[#FF7A18]'
              }`}></div>

              <div className="pl-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#2563EB] font-bold">
                    {item.event_type}
                  </span>
                  <StatusBadge status={item.status} />
                </div>

                <div>
                  <h4 className="font-heading text-sm font-bold text-[#071A2B] group-hover:text-[#2563EB] transition-colors truncate">
                    {item.subject}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5 truncate">
                    To: <strong className="text-[#071A2B]">{item.name}</strong> &lt;{item.email}&gt;
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span>Sent: {item.sent_at ? new Date(item.sent_at).toLocaleTimeString() : 'Pending'}</span>
                  <span className="flex items-center gap-1 text-[#2563EB] font-semibold group-hover:underline">
                    Inspect HTML Email <ExternalLink size={12} />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rendered HTML Email Inspector Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 bg-[#071A2B]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#071A2B] text-white p-4 px-6 flex items-center justify-between border-b border-[#22D3EE]/20">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#22D3EE]" />
                <div>
                  <div className="text-xs font-mono text-[#22D3EE] font-bold">Rendered HTML Template Preview</div>
                  <div className="text-sm font-bold text-white truncate max-w-md">{selectedEmail.subject}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmail(null)}
                className="text-[#94A3B8] hover:text-white p-1.5 rounded-xl bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* IFrame Render of HTML Email */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#F8FAFC]">
              <iframe
                title="Email Preview"
                srcDoc={generateEmailHTML({
                  name: selectedEmail.name,
                  email: selectedEmail.email,
                  eventType: selectedEmail.event_type,
                  subject: selectedEmail.subject,
                  message: selectedEmail.message,
                  sentAt: selectedEmail.sent_at,
                  messageId: selectedEmail.email_message_id
                })}
                className="w-full h-[450px] rounded-2xl border border-slate-200 shadow-md"
              />
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 px-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div>Recipient: <strong className="text-slate-800">{selectedEmail.email}</strong></div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="btn-primary text-xs py-2 px-4"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
