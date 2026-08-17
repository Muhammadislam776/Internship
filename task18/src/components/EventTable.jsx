import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye, RotateCcw, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { eventEngine } from '../services/eventEngine';

export default function EventTable({ events = [], onSelectEvent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [retryingId, setRetryingId] = useState(null);
  const itemsPerPage = 8;

  const filtered = events.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'ALL' || item.event_type === filterType;
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const eventTypes = ['ALL', 'New Booking', 'New User', 'New Order', 'Support Ticket', 'Payment'];
  const statusTypes = ['ALL', 'SENT', 'PROCESSING', 'FAILED', 'PENDING'];

  const handleRetry = async (eventId, e) => {
    e?.stopPropagation();
    setRetryingId(eventId);
    try {
      await eventEngine.retryNotificationEvent(eventId);
    } catch (err) {
      console.error('Retry error:', err);
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-[#E2E8F0] shadow-lg space-y-4">
      
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by ID, name, email or subject..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs text-[#071A2B] focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
            <Filter size={14} className="text-[#2563EB]" />
            Type:
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-[#F8FAFC] text-xs text-[#071A2B] cursor-pointer"
            >
              {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
            Status:
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-[#F8FAFC] text-xs text-[#071A2B] cursor-pointer"
            >
              {statusTypes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-heading font-bold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC]">
              <th className="py-3 px-4 rounded-l-xl">Event ID</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Recipient</th>
              <th className="py-3 px-4">Created At</th>
              <th className="py-3 px-4">Proc. Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No database events match the selected filters.
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedRecord(item)}
                  className="hover:bg-[#2563EB]/5 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2563EB]">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#071A2B]">
                    {item.event_type}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#071A2B]">{item.name}</div>
                    <div className="text-[11px] text-[#64748B]">{item.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B] font-mono text-[11px]">
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#22D3EE] font-bold">
                    ~480 ms
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {item.status === 'FAILED' && (
                      <button
                        onClick={(e) => handleRetry(item.id, e)}
                        disabled={retryingId === item.id}
                        className="px-2.5 py-1 rounded-lg bg-[#FF7A18] hover:bg-[#EA580C] text-white font-bold text-[11px] inline-flex items-center gap-1 transition-colors shadow-sm"
                        title="Retry Dispatch"
                      >
                        <RotateCcw size={12} className={retryingId === item.id ? 'animate-spin' : ''} />
                        {retryingId === item.id ? 'Retrying...' : 'RETRY'}
                      </button>
                    )}

                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedRecord(item); }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#2563EB] text-slate-600 hover:text-white transition-colors"
                      title="Inspect Details"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
        <div>
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} events
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-mono text-xs font-bold text-[#071A2B]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-100 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Record Inspector Drawer Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-[#071A2B]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card-dark w-full max-w-lg rounded-3xl p-6 border border-[#22D3EE]/30 relative shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#22D3EE] font-bold">Record Inspector</span>
                <span className="text-white font-heading font-bold text-sm">#{selectedRecord.id}</span>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-[#94A3B8] hover:text-white p-1 rounded-lg bg-white/10">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-white/5 p-3 rounded-xl space-y-1">
                <div className="text-[#94A3B8]">Recipient: <strong className="text-white">{selectedRecord.name}</strong> &lt;{selectedRecord.email}&gt;</div>
                <div className="text-[#94A3B8]">Event Type: <strong className="text-[#22D3EE]">{selectedRecord.event_type}</strong></div>
                <div className="text-[#94A3B8]">Subject: <strong className="text-white">{selectedRecord.subject}</strong></div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl space-y-1">
                <div className="text-[#94A3B8]">Status: <strong className={selectedRecord.status === 'SENT' ? 'text-[#22C55E]' : 'text-[#EF4444]'}>{selectedRecord.status}</strong></div>
                {selectedRecord.email_message_id && <div>Message ID: <strong className="text-[#22C55E]">{selectedRecord.email_message_id}</strong></div>}
                {selectedRecord.error_message && <div className="text-[#EF4444]">Error: {selectedRecord.error_message}</div>}
              </div>

              <div className="bg-white/5 p-3 rounded-xl space-y-1 text-[11px] text-[#94A3B8]">
                <div>Created At: {new Date(selectedRecord.created_at).toLocaleString()}</div>
                <div>Sent At: {selectedRecord.sent_at ? new Date(selectedRecord.sent_at).toLocaleString() : 'N/A'}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              {selectedRecord.status === 'FAILED' && (
                <button
                  onClick={(e) => { handleRetry(selectedRecord.id, e); setSelectedRecord(null); }}
                  className="btn-orange text-xs py-2 px-4 rounded-xl font-bold flex items-center gap-1.5"
                >
                  <RotateCcw size={14} /> Retry Dispatch Now
                </button>
              )}
              <button onClick={() => setSelectedRecord(null)} className="btn-secondary text-xs py-2 px-4">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
