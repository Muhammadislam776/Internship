import React, { useState } from 'react';
import { KeyRound, Shield, Lock, Search, AlertOctagon, CheckCircle2, RefreshCw } from 'lucide-react';

export const Permissions = ({ onShowToast }) => {
  const [search, setSearch] = useState('');
  const [permissionsState, setPermissionsState] = useState([
    { id: 'perm_01', key: 'auth:service_role_access', name: 'Supabase Service Role Bypass', category: 'Authentication', risk: 'CRITICAL', enabled: true, desc: 'Allows Express server to bypass RLS and read all Supabase Auth user profiles.' },
    { id: 'perm_02', key: 'users:read_all', name: 'List & Search All Users', category: 'User Management', risk: 'MEDIUM', enabled: true, desc: 'Grants access to query user lists, search emails, and fetch metadata.' },
    { id: 'perm_03', key: 'users:write_profile', name: 'Modify Profile Metadata', category: 'User Management', risk: 'HIGH', enabled: true, desc: 'Permission to edit full names, phone numbers, and status badges.' },
    { id: 'perm_04', key: 'users:delete_account', name: 'Revoke / Delete User Account', category: 'User Management', risk: 'CRITICAL', enabled: false, desc: 'Destructive deletion of auth accounts and cascade deletion of profile rows.' },
    { id: 'perm_05', key: 'export:data_csv_json', name: 'Export CSV & JSON Datasets', category: 'Data & Telemetry', risk: 'HIGH', enabled: true, desc: 'Allows downloading filtered user records directly to local disk.' },
    { id: 'perm_06', key: 'keys:rotate_api', name: 'Rotate Service & API Keys', category: 'Security Gateway', risk: 'CRITICAL', enabled: false, desc: 'Generates new Supabase Service Role and JWT secret pairs.' },
    { id: 'perm_07', key: 'telemetry:view_audit', name: 'Inspect Audit Stream Logs', category: 'Auditing', risk: 'LOW', enabled: true, desc: 'Read-only access to real-time event logs and IP tracking telemetry.' }
  ]);

  const togglePermission = (id) => {
    setPermissionsState(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.enabled;
        onShowToast && onShowToast({
          title: item.name,
          message: `Permission set to ${nextState ? 'ENABLED' : 'DISABLED'}`,
          type: nextState ? 'success' : 'warning'
        });
        return { ...item, enabled: nextState };
      }
      return item;
    }));
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF7A18]/20 text-[#FFB86B] border border-[#FF7A18]/40">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-400/40">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40">LOW</span>;
    }
  };

  const filteredPermissions = permissionsState.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.key.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#22D3EE]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B253A]/90 border border-[#22D3EE]/40 text-xs font-semibold text-[#22D3EE] mb-3">
            <KeyRound className="w-4 h-4 text-[#22D3EE]" /> System Permission Matrix
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            API Scope &amp; System Permissions
          </h1>
          <p className="text-xs sm:text-sm text-[#9FB0C2] mt-1 max-w-2xl">
            Toggle granular API endpoints, enforcement rules, and data access scopes across server layers.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#22D3EE]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search permissions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
          />
        </div>
      </div>

      {/* Permissions Table */}
      <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B253A]/90 text-[#9FB0C2] text-[11px] font-extrabold uppercase tracking-wider border-b border-white/10">
                <th className="py-4 px-6">Permission Scope</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Risk Severity</th>
                <th className="py-4 px-4">Description</th>
                <th className="py-4 px-6 text-right">Toggle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white">
              {filteredPermissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-semibold">
                    <p className="text-white text-xs">{perm.name}</p>
                    <p className="text-[11px] font-mono text-[#22D3EE] mt-0.5">{perm.key}</p>
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-[#9FB0C2]">
                    {perm.category}
                  </td>

                  <td className="py-4 px-4">
                    {getRiskBadge(perm.risk)}
                  </td>

                  <td className="py-4 px-4 text-[#9FB0C2] text-xs max-w-sm">
                    {perm.desc}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => togglePermission(perm.id)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        perm.enabled ? 'bg-[#22C55E]' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          perm.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
