import React from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationCenter({ events, onClose }) {
  const getRelativeTime = (isoString) => {
    if (!isoString) return 'Just now';
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 30) return 'Just now';
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const recent = events.slice(0, 6);

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-card-dark rounded-2xl p-4 shadow-2xl z-50 border border-[#22D3EE]/30 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <h4 className="font-heading font-bold text-white text-sm">Notifications</h4>
          <span className="bg-[#2563EB] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            {events.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="py-2 divide-y divide-white/5 max-h-80 overflow-y-auto">
        {recent.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#94A3B8]">
            No notification events recorded yet.
          </div>
        ) : (
          recent.map((item) => (
            <div key={item.id} className="py-3 px-2 hover:bg-white/5 rounded-xl transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {item.status === 'SENT' ? (
                    <div className="w-7 h-7 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center text-[#22C55E]">
                      <CheckCircle2 size={14} />
                    </div>
                  ) : item.status === 'FAILED' ? (
                    <div className="w-7 h-7 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444]">
                      <AlertCircle size={14} />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#FF7A18]/20 border border-[#FF7A18]/40 flex items-center justify-center text-[#FF7A18] animate-spin">
                      <RefreshCw size={14} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="font-bold text-white truncate">{item.event_type}</span>
                    <span className="text-[10px] text-[#94A3B8]">{getRelativeTime(item.created_at)}</span>
                  </div>
                  <p className="text-xs text-[#CBD5E1] truncate font-medium">{item.subject}</p>
                  <p className="text-[11px] text-[#94A3B8] truncate">{item.email}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-3 border-t border-white/10 text-center">
        <Link
          to="/emails"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs text-[#22D3EE] hover:text-white font-semibold transition-colors"
        >
          View all email logs <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
