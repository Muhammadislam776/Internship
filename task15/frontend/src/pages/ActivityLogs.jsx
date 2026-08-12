import React, { useState } from 'react';
import { History, ShieldAlert, Key, CheckCircle2, UserCheck, Search, Filter, Terminal, X } from 'lucide-react';

export const ActivityLogs = () => {
  const [severity, setSeverity] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const logs = [
    { id: 'log_901', action: 'Express Server SDK Auth', user: 'System Service Role', ip: '127.0.0.1', severity: 'security', time: 'Just now', payload: { route: '/admin/users', status: 200, key_type: 'service_role' } },
    { id: 'log_902', action: 'User Registration', user: 'Dr. Evelyn Vance (evelyn@lumina.io)', ip: '192.168.1.45', severity: 'info', time: '2m ago', payload: { provider: 'google', role: 'admin' } },
    { id: 'log_903', action: 'Email Verification Magic Link', user: 'Sarah Jenkins (sarah.j@quantum.net)', ip: '82.165.19.12', severity: 'info', time: '14m ago', payload: { verified: true } },
    { id: 'log_904', action: 'Failed Auth Attempt', user: 'Unknown (bad_token_attempt)', ip: '45.142.120.9', severity: 'critical', time: '35m ago', payload: { err: 'Invalid JWT signature', attempts: 3 } },
    { id: 'log_905', action: 'RBAC Permission Upgrade', user: 'Alex Vance (Super Admin)', ip: '10.0.0.1', severity: 'warning', time: '1h ago', payload: { granted: 'users:delete_account', target: 'Aria Montgomery' } }
  ];

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'critical':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">CRITICAL</span>;
      case 'warning':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-400/40">WARNING</span>;
      case 'security':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40">SECURITY</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40">INFO</span>;
    }
  };

  const filteredLogs = logs.filter(l => {
    const matchesSev = severity === 'all' || l.severity === severity;
    const matchesSearch = l.action.toLowerCase().includes(search.toLowerCase()) ||
                          l.user.toLowerCase().includes(search.toLowerCase()) ||
                          l.ip.includes(search);
    return matchesSev && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#22D3EE]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B253A]/90 border border-[#22D3EE]/40 text-xs font-semibold text-[#22D3EE] mb-3">
            <History className="w-4 h-4 text-[#22D3EE]" /> Live System Audit Log Stream
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Real-Time Audit &amp; Event Stream
          </h1>
          <p className="text-xs sm:text-sm text-[#9FB0C2] mt-1 max-w-2xl">
            Inspect live security logs, API route access, IP addresses, and payload signatures across system instances.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#22D3EE]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or IP..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
          />
        </div>
      </div>

      {/* Severity Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#9FB0C2] mr-2">Severity:</span>
        {['all', 'critical', 'warning', 'security', 'info'].map((s) => (
          <button
            key={s}
            onClick={() => setSeverity(s)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase transition-all ${
              severity === s
                ? 'bg-gradient-to-r from-[#2563EB] to-[#22D3EE] text-white shadow-md'
                : 'glass-card text-[#9FB0C2] hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B253A]/90 text-[#9FB0C2] text-[11px] font-extrabold uppercase tracking-wider border-b border-white/10">
                <th className="py-4 px-6">Event Action</th>
                <th className="py-4 px-4">User Account</th>
                <th className="py-4 px-4">IP Address</th>
                <th className="py-4 px-4">Severity</th>
                <th className="py-4 px-4">Time</th>
                <th className="py-4 px-6 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">
                    {log.action}
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-[#22D3EE]">
                    {log.user}
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-[#9FB0C2]">
                    {log.ip}
                  </td>
                  <td className="py-4 px-4">
                    {getSeverityBadge(log.severity)}
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px] text-[#9FB0C2]">
                    {log.time}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-3 py-1 rounded-xl bg-white/10 hover:bg-[#22D3EE]/20 text-[11px] font-semibold text-white border border-[#22D3EE]/30 transition-all"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative glass-panel rounded-3xl p-6 border border-[#22D3EE]/40 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#22D3EE]" />
                <h3 className="font-bold text-sm text-white">Log Payload Signature</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-1 rounded-lg bg-white/10 text-[#9FB0C2] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#071A2B] p-4 rounded-2xl border border-white/10 font-mono text-[11px] text-[#22D3EE] overflow-x-auto">
              <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
            </div>

            <div className="mt-4 text-right">
              <button onClick={() => setSelectedLog(null)} className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
