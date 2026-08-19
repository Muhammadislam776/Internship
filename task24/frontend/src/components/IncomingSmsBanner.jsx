import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Smartphone, X, ShieldCheck } from 'lucide-react';

export default function IncomingSmsBanner() {
  const { incomingSms, setIncomingSms } = useApp();
  if (!incomingSms) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-bounce-short">
      <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-3xl p-4 shadow-2xl border border-blue-500/40 flex items-start space-x-3 text-xs">
        
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
          <MessageSquare className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-orange-400 text-[11px] uppercase tracking-wider flex items-center space-x-1">
              <Smartphone className="w-3.5 h-3.5 text-orange-400" />
              <span>Incoming Mobile SMS</span>
            </span>
            <span className="text-[10px] text-slate-400">{incomingSms.time || 'NOW'}</span>
          </div>

          <p className="text-slate-200 font-medium mt-1 leading-relaxed">
            {incomingSms.text}
          </p>

          <p className="text-[10px] text-emerald-400 font-bold mt-1">
            Sent to: {incomingSms.phone}
          </p>
        </div>

        <button
          onClick={() => setIncomingSms(null)}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
