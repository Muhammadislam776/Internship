import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0F172A] border border-indigo-500/40 shadow-2xl text-white text-xs">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
      <span className="font-medium">{toast.message}</span>
      <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
