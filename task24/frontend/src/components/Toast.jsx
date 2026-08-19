import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const borders = {
    success: "border-emerald-200 bg-white",
    error: "border-rose-200 bg-white",
    info: "border-blue-200 bg-white"
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-xl border ${borders[toast.type] || borders.info}`}>
        {icons[toast.type] || icons.info}
        <span className="text-sm font-semibold text-slate-800">
          {toast.message}
        </span>
      </div>
    </div>
  );
}
