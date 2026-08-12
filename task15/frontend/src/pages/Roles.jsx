import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  KeyRound, 
  Plus, 
  Check, 
  X, 
  Users, 
  Sparkles, 
  Lock,
  Edit3
} from 'lucide-react';

export const Roles = ({ onShowToast }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  const rolesList = [
    {
      id: 'admin',
      name: 'Super Admin',
      description: 'Full system authorization including Supabase Service Role key operations and user deletion.',
      members: 48,
      color: 'from-purple-600 to-indigo-600',
      borderColor: 'border-purple-400/40',
      badgeColor: 'bg-purple-500/20 text-purple-300',
      permissions: [
        'Supabase Service Role API Access',
        'User Account Creation & Revocation',
        'RBAC Role Assignment & Overrides',
        'Database Schema Inspections',
        'Full Data Exporter Access',
        'Security Audit Stream View'
      ]
    },
    {
      id: 'moderator',
      name: 'System Moderator',
      description: 'Operational user management, support ticket resolution, and daily platform monitoring.',
      members: 120,
      color: 'from-[#2563EB] to-[#22D3EE]',
      borderColor: 'border-[#22D3EE]/40',
      badgeColor: 'bg-[#22D3EE]/20 text-[#22D3EE]',
      permissions: [
        'View User Profiles & Metadata',
        'Trigger Password Reset Magic Links',
        'Filter & Search Users Table',
        'View Activity Audit Timeline',
        'Export User Reports (CSV / JSON)'
      ]
    },
    {
      id: 'auditor',
      name: 'Security Auditor',
      description: 'Compliance monitoring, IP security checks, and read-only telemetry oversight.',
      members: 15,
      color: 'from-[#FF7A18] to-[#FFB86B]',
      borderColor: 'border-[#FF7A18]/40',
      badgeColor: 'bg-[#FF7A18]/20 text-[#FFB86B]',
      permissions: [
        'Read-Only Security Telemetry',
        'Inspect API Status & Latency',
        'Audit Log Stream Inspection',
        'Export Compliance Data'
      ]
    },
    {
      id: 'user',
      name: 'Standard User',
      description: 'Default role for registered end-users across the platform applications.',
      members: 12372,
      color: 'from-[#0B253A] to-[#071A2B]',
      borderColor: 'border-white/20',
      badgeColor: 'bg-white/10 text-white/80',
      permissions: [
        'Self Profile Management',
        'Standard Application Workspace',
        'View Personal Login History'
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#22D3EE]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B253A]/90 border border-[#22D3EE]/40 text-xs font-semibold text-[#22D3EE] mb-3">
            <ShieldCheck className="w-4 h-4 text-[#22D3EE]" /> Role-Based Access Control (RBAC)
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Role &amp; Privilege Management
          </h1>
          <p className="text-xs sm:text-sm text-[#9FB0C2] mt-1 max-w-2xl">
            Configure system authorization levels, manage privilege scope bounds, and assign roles to registered accounts.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FFB86B] font-bold text-xs text-white shadow-lg shadow-[#FF7A18]/30 hover:scale-105 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Role</span>
        </button>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rolesList.map((role) => (
          <div 
            key={role.id}
            className={`glass-panel rounded-3xl p-6 border ${role.borderColor} shadow-2xl space-y-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#22D3EE] transition-all`}
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${role.badgeColor} border border-white/10 flex items-center gap-1.5`}>
                  <ShieldAlert className="w-3.5 h-3.5" /> {role.name}
                </span>
                <span className="text-xs font-mono text-[#9FB0C2] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#22D3EE]" /> <strong className="text-white">{role.members.toLocaleString()}</strong> Members
                </span>
              </div>

              <p className="text-xs text-[#9FB0C2] mt-3 leading-relaxed">
                {role.description}
              </p>
            </div>

            {/* Permissions Checklist */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#22D3EE]">Granted Scope Permissions:</h4>
              <div className="space-y-1.5">
                {role.permissions.map((perm, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-white">
                    <div className="w-4 h-4 rounded-full bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => onShowToast && onShowToast({ title: role.name, message: `Editing permissions for ${role.name}`, type: 'info' })}
                className="flex items-center gap-1 text-xs font-semibold text-[#22D3EE] hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Scope Matrix
              </button>
              <span className="text-[10px] font-mono text-[#9FB0C2] flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#22C55E]" /> Enforced Server-Side
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative glass-panel rounded-3xl p-6 border border-[#22D3EE]/40 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#22D3EE]" />
                <h3 className="font-bold text-base text-white">Create Custom Security Role</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg bg-white/10 text-[#9FB0C2] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9FB0C2] mb-1 font-semibold">Role Identifier Name</label>
                <input 
                  type="text" 
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Compliance Officer" 
                  className="w-full glass-input p-3 rounded-xl text-white text-xs" 
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    onShowToast && onShowToast({ title: 'Role Created', message: `Custom role ${newRoleName || 'Compliance Officer'} defined`, type: 'success' });
                    setShowCreateModal(false);
                    setNewRoleName('');
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FFB86B] font-bold text-white shadow-lg"
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
