import React, { useState } from 'react';
import { HelpCircle, MessageSquare, LifeBuoy, BookOpen, Clock, CheckCircle2, Plus, Sparkles, X } from 'lucide-react';

export const Support = ({ onShowToast }) => {
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const tickets = [
    { id: 'TICK-402', subject: 'Supabase Service Role Secret Key Rotation', status: 'In Progress', priority: 'High', date: 'Today at 05:20' },
    { id: 'TICK-398', subject: 'Rate limiting configuration for /admin/users', status: 'Resolved', priority: 'Medium', date: 'Yesterday' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#22D3EE]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B253A]/90 border border-[#22D3EE]/40 text-xs font-semibold text-[#22D3EE] mb-3">
            <LifeBuoy className="w-4 h-4 text-[#22D3EE]" /> Enterprise SLA Support Desk
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Support &amp; Technical Assistance
          </h1>
          <p className="text-xs sm:text-sm text-[#9FB0C2] mt-1 max-w-2xl">
            24/7 dedicated enterprise support, API documentation, and SLA ticket resolution.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FFB86B] font-bold text-xs text-white shadow-lg hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* SLA Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-[#22D3EE]/30">
          <div className="flex items-center justify-between text-xs text-[#9FB0C2]">
            <span>Avg Response Time</span>
            <Clock className="w-4 h-4 text-[#22D3EE]" />
          </div>
          <h3 className="text-2xl font-extrabold text-white font-mono mt-2">8 Minutes</h3>
          <p className="text-[11px] text-[#22C55E] mt-1 font-semibold">Priority SLA Active</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#22C55E]/30">
          <div className="flex items-center justify-between text-xs text-[#9FB0C2]">
            <span>Resolution Index</span>
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          </div>
          <h3 className="text-2xl font-extrabold text-white font-mono mt-2">99.4%</h3>
          <p className="text-[11px] text-[#22C55E] mt-1 font-semibold">Resolved tickets</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#FF7A18]/30">
          <div className="flex items-center justify-between text-xs text-[#9FB0C2]">
            <span>Active Tickets</span>
            <MessageSquare className="w-4 h-4 text-[#FF7A18]" />
          </div>
          <h3 className="text-2xl font-extrabold text-white font-mono mt-2">{tickets.length} Open</h3>
          <p className="text-[11px] text-[#FFB86B] mt-1 font-semibold">Assigned engineers</p>
        </div>
      </div>

      {/* Active Tickets & Documentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <MessageSquare className="w-4 h-4 text-[#22D3EE]" /> Active Support Tickets
          </h3>

          <div className="space-y-3">
            {tickets.map((tick) => (
              <div key={tick.id} className="p-4 rounded-2xl glass-card flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#22D3EE] font-bold">{tick.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${tick.status === 'Resolved' ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#FF7A18]/20 text-[#FFB86B]'}`}>
                      {tick.status}
                    </span>
                  </div>
                  <p className="font-bold text-white mt-1">{tick.subject}</p>
                </div>
                <span className="text-[10px] text-[#9FB0C2] font-mono">{tick.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Links */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <BookOpen className="w-4 h-4 text-[#FF7A18]" /> Quick Documentation
          </h3>

          <div className="space-y-2 text-xs">
            <a href="#doc1" className="block p-3 rounded-2xl glass-card hover:border-[#22D3EE] transition-colors">
              <p className="font-bold text-white">Express Backend Supabase Setup Guide</p>
              <p className="text-[11px] text-[#9FB0C2] mt-0.5">How to store SUPABASE_SERVICE_ROLE_KEY safely in backend/.env</p>
            </a>
            <a href="#doc2" className="block p-3 rounded-2xl glass-card hover:border-[#22D3EE] transition-colors">
              <p className="font-bold text-white">RBAC Permission Override Specs</p>
              <p className="text-[11px] text-[#9FB0C2] mt-0.5">Configuring custom roles for enterprise auditors</p>
            </a>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative glass-panel rounded-3xl p-6 border border-[#22D3EE]/40 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#22D3EE]" />
                <h3 className="font-bold text-base text-white">Submit Ticket to Support</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg bg-white/10 text-[#9FB0C2] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9FB0C2] mb-1 font-semibold">Ticket Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Supabase Admin API connection issue" 
                  className="w-full glass-input p-3 rounded-xl text-white text-xs" 
                />
              </div>

              <div>
                <label className="block text-[#9FB0C2] mb-1 font-semibold">Issue Description</label>
                <textarea 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your technical inquiry..." 
                  className="w-full glass-input p-3 rounded-xl text-white text-xs" 
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    onShowToast && onShowToast({ title: 'Ticket Submitted', message: 'Support ticket dispatched to SLA queue', type: 'success' });
                    setShowModal(false);
                    setSubject('');
                    setMessage('');
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FFB86B] font-bold text-white shadow-lg"
                >
                  Submit Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
