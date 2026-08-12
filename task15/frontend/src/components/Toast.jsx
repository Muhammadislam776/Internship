import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getVariantStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-[#0B253A]/90 border-[#22C55E]/50 text-white',
          icon: <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0" />,
          accent: 'bg-[#22C55E]'
        };
      case 'warning':
        return {
          bg: 'bg-[#0B253A]/90 border-[#FF7A18]/50 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-[#FF7A18] flex-shrink-0" />,
          accent: 'bg-[#FF7A18]'
        };
      case 'error':
        return {
          bg: 'bg-[#0B253A]/90 border-[#EF4444]/50 text-white',
          icon: <XCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />,
          accent: 'bg-[#EF4444]'
        };
      default:
        return {
          bg: 'bg-[#0B253A]/90 border-[#22D3EE]/50 text-white',
          icon: <Info className="w-5 h-5 text-[#22D3EE] flex-shrink-0" />,
          accent: 'bg-[#22D3EE]'
        };
    }
  };

  const style = getVariantStyles();

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md">
      <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl ${style.bg} relative overflow-hidden`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.accent}`} />
        {style.icon}
        <div className="flex-1 pr-4">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.message && <p className="text-xs text-[#9FB0C2] mt-0.5">{toast.message}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-[#9FB0C2] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
