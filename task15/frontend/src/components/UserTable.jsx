import React from 'react';
import { 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock, 
  Globe, 
  MoreVertical 
} from 'lucide-react';

export const UserTable = ({ 
  users, 
  onSelectUser, 
  onDeleteUser, 
  onShowToast 
}) => {
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    const r = (role || 'user').toLowerCase();
    if (r === 'admin') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40 inline-flex items-center gap-1 shadow-sm">
          <ShieldCheck className="w-3 h-3 text-purple-400" /> Admin
        </span>
      );
    }
    if (r === 'moderator') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2563EB]/20 text-[#22D3EE] border border-[#22D3EE]/40 inline-flex items-center gap-1 shadow-sm">
          <ShieldCheck className="w-3 h-3 text-[#22D3EE]" /> Moderator
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-[#9FB0C2] border border-white/20 inline-flex items-center gap-1">
        <User className="w-3 h-3 text-[#9FB0C2]" /> User
      </span>
    );
  };

  return (
    <div className="w-full overflow-hidden glass-panel rounded-2xl border border-[#22D3EE]/20 shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Sticky Header */}
          <thead>
            <tr className="bg-[#0B253A]/90 text-[#9FB0C2] text-[11px] font-extrabold uppercase tracking-wider border-b border-white/10 backdrop-blur-md sticky top-0 z-10">
              <th className="py-4 px-4 pl-6">User Profile</th>
              <th className="py-4 px-4">User ID</th>
              <th className="py-4 px-4">Role</th>
              <th className="py-4 px-4">Email Status</th>
              <th className="py-4 px-4">Joined</th>
              <th className="py-4 px-4">Last Login</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs text-white">
            {users.map((user) => (
              <tr 
                key={user.id}
                onClick={() => onSelectUser(user)}
                className="group hover:bg-[#0B253A]/80 transition-all duration-200 cursor-pointer hover:border-l-4 hover:border-l-[#22D3EE]"
              >
                {/* Avatar & Name */}
                <td className="py-3.5 px-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={user.avatar_url}
                        alt={user.full_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#22D3EE]/50 group-hover:border-[#22D3EE] group-hover:scale-105 shadow-md shadow-[#22D3EE]/20 transition-all"
                      />
                      {user.status === 'active' && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] rounded-full ring-2 ring-[#071A2B]" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs group-hover:text-[#22D3EE] transition-colors leading-tight">
                        {user.full_name}
                      </p>
                      <p className="text-[11px] text-[#9FB0C2] font-mono mt-0.5">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* User ID */}
                <td className="py-3.5 px-4 font-mono text-[11px] text-[#22D3EE]/90">
                  {user.id.substring(0, 14)}...
                </td>

                {/* Role */}
                <td className="py-3.5 px-4">
                  {getRoleBadge(user.role)}
                </td>

                {/* Email Status */}
                <td className="py-3.5 px-4">
                  {user.email_confirmed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#22C55E]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                      <XCircle className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </td>

                {/* Created At */}
                <td className="py-3.5 px-4 font-mono text-[11px] text-[#9FB0C2]">
                  {formatDate(user.created_at)}
                </td>

                {/* Last Login */}
                <td className="py-3.5 px-4 font-mono text-[11px] text-[#9FB0C2]">
                  {formatDate(user.last_sign_in_at)}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  {user.status === 'active' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 uppercase tracking-wider">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 uppercase tracking-wider">
                      Inactive
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onSelectUser(user)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-[#22D3EE]/20 text-[#9FB0C2] hover:text-[#22D3EE] transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onShowToast && onShowToast({ title: 'Edit Mode', message: `Editing role permissions for ${user.full_name}`, type: 'info' })}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#9FB0C2] hover:text-white transition-colors"
                      title="Edit User"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#9FB0C2] hover:text-red-400 transition-colors"
                      title="Revoke / Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
