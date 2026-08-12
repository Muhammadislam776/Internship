import React from 'react';
import { ShieldCheck, User, CheckCircle2, Eye, Edit3, Trash2 } from 'lucide-react';

export const UserCard = ({ user, onSelectUser, onDeleteUser, onShowToast }) => {
  const getRoleBadge = (role) => {
    const r = (role || 'user').toLowerCase();
    if (r === 'admin') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40">Admin</span>;
    }
    if (r === 'moderator') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB]/20 text-[#22D3EE] border border-[#22D3EE]/40">Moderator</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white/80">User</span>;
  };

  return (
    <div 
      onClick={() => onSelectUser(user)}
      className="glass-panel rounded-2xl p-4 border border-[#22D3EE]/20 shadow-xl space-y-3 cursor-pointer hover:border-[#22D3EE]/60 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={user.avatar_url} 
            alt={user.full_name} 
            className="w-11 h-11 rounded-full object-cover border-2 border-[#22D3EE]" 
          />
          <div>
            <h4 className="font-bold text-white text-sm">{user.full_name}</h4>
            <p className="text-xs text-[#9FB0C2] font-mono">{user.email}</p>
          </div>
        </div>
        {getRoleBadge(user.role)}
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {user.email_confirmed ? (
            <span className="text-[#22C55E] flex items-center gap-1 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </span>
          ) : (
            <span className="text-amber-400 text-[11px] font-semibold">Unverified</span>
          )}
          <span className="text-white/20">•</span>
          <span className={`text-[10px] uppercase font-bold ${user.status === 'active' ? 'text-[#22C55E]' : 'text-red-400'}`}>
            {user.status}
          </span>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onSelectUser(user)}
            className="p-1.5 rounded-lg bg-white/5 text-[#9FB0C2] hover:text-[#22D3EE]"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onShowToast && onShowToast({ title: 'Edit User', message: `Modifying ${user.full_name}`, type: 'info' })}
            className="p-1.5 rounded-lg bg-white/5 text-[#9FB0C2] hover:text-white"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDeleteUser(user)}
            className="p-1.5 rounded-lg bg-white/5 text-[#9FB0C2] hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
