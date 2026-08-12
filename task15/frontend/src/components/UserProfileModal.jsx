import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  User, 
  Calendar, 
  Clock, 
  Phone, 
  Key, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  ZoomIn, 
  Activity, 
  Code, 
  Sparkles,
  Lock
} from 'lucide-react';
import { ImageModal } from './ImageModal';

export const UserProfileModal = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showImageZoom, setShowImageZoom] = useState(false);

  if (!user) return null;

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role) => {
    const r = (role || 'user').toLowerCase();
    if (r === 'admin') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Admin
        </span>
      );
    }
    if (r === 'moderator') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#2563EB]/20 text-[#22D3EE] border border-[#22D3EE]/40 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22D3EE]" /> Moderator
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 text-white/80 border border-white/20 flex items-center gap-1">
        <User className="w-3.5 h-3.5 text-[#9FB0C2]" /> User
      </span>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-in">
        <div className="relative glass-panel rounded-3xl border border-[#22D3EE]/30 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header Banner */}
          <div className="relative h-28 bg-gradient-to-r from-[#0B253A] via-[#2563EB]/40 to-[#FF7A18]/30 p-6 flex items-start justify-between border-b border-white/10">
            <div className="absolute top-0 right-0 p-8 bg-gradient-to-br from-white/10 to-transparent blur-2xl pointer-events-none w-48 h-48" />
            <span className="px-3 py-1 rounded-full bg-[#071A2B]/80 text-[#22D3EE] text-[10px] font-mono border border-[#22D3EE]/30">
              SUPABASE AUTH RECORD
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#071A2B]/80 text-[#9FB0C2] hover:text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Overview Top Section */}
          <div className="px-6 pb-4 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-4">
              <div 
                className="relative group cursor-pointer" 
                onClick={() => setShowImageZoom(true)}
                title="Click to zoom image"
              >
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-[#071A2B] shadow-xl shadow-[#22D3EE]/20 group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <ZoomIn className="w-6 h-6 text-[#22D3EE]" />
                </div>
                {user.status === 'active' && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#22C55E] rounded-full ring-4 ring-[#071A2B]" />
                )}
              </div>
              <div className="mb-1">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {user.full_name}
                </h2>
                <p className="text-xs text-[#9FB0C2] font-mono mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1">
              {getRoleBadge(user.role)}
              {user.email_confirmed ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Unverified
                </span>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 border-b border-white/10 flex items-center gap-4 text-xs font-semibold text-[#9FB0C2]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'overview' ? 'border-[#22D3EE] text-[#22D3EE]' : 'border-transparent hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Overview
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'activity' ? 'border-[#22D3EE] text-[#22D3EE]' : 'border-transparent hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Activity Log
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'json' ? 'border-[#22D3EE] text-[#22D3EE]' : 'border-transparent hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> JSON Metadata
            </button>
          </div>

          {/* Modal Body Scroll Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl glass-card space-y-1">
                  <span className="text-[#9FB0C2] text-[10px] font-mono uppercase tracking-wider">User ID</span>
                  <p className="font-mono text-white font-semibold text-xs break-all">{user.id}</p>
                </div>

                <div className="p-3.5 rounded-2xl glass-card space-y-1">
                  <span className="text-[#9FB0C2] text-[10px] font-mono uppercase tracking-wider">Auth Provider</span>
                  <p className="font-semibold text-[#22D3EE] uppercase flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> {user.provider || 'email'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl glass-card space-y-1">
                  <span className="text-[#9FB0C2] text-[10px] font-mono uppercase tracking-wider">Phone Contact</span>
                  <p className="font-mono text-white flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#22D3EE]" /> {user.phone || 'N/A'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl glass-card space-y-1">
                  <span className="text-[#9FB0C2] text-[10px] font-mono uppercase tracking-wider">Account Created</span>
                  <p className="text-white flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#FFB86B]" /> {formatDate(user.created_at)}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl glass-card space-y-1 sm:col-span-2">
                  <span className="text-[#9FB0C2] text-[10px] font-mono uppercase tracking-wider">Last Sign In Timestamp</span>
                  <p className="text-white flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#22C55E]" /> {formatDate(user.last_sign_in_at)}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Authenticated via {user.provider}</p>
                      <p className="text-[10px] text-[#9FB0C2]">{formatDate(user.last_sign_in_at)}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-[#22C55E]/20 text-[#22C55E] text-[10px] rounded-full font-mono">Success</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#2563EB]/20 text-[#22D3EE] flex items-center justify-center">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">JWT Access Token Issued</p>
                      <p className="text-[10px] text-[#9FB0C2]">Supabase Auth Server</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-[#22D3EE]/20 text-[#22D3EE] text-[10px] rounded-full font-mono">Verified</span>
                </div>
              </div>
            )}

            {activeTab === 'json' && (
              <div className="bg-[#071A2B] p-4 rounded-2xl border border-white/10 font-mono text-[11px] text-[#22D3EE] overflow-x-auto max-h-60">
                <pre>{JSON.stringify(user, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 bg-[#071A2B]/80 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-[#9FB0C2] flex items-center gap-1 font-mono">
              <Lock className="w-3.5 h-3.5 text-[#22C55E]" /> Server-Side Admin Read Only
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0B253A] font-bold text-white text-xs border border-[#22D3EE]/40 hover:scale-105 transition-transform"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Lightbox */}
      {showImageZoom && (
        <ImageModal
          imageUrl={user.avatar_url}
          userName={user.full_name}
          onClose={() => setShowImageZoom(false)}
        />
      )}
    </>
  );
};
