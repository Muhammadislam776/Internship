import React from 'react';
import { FileQuestion } from 'lucide-react';

export const EmptyState = ({ title = 'No records found', description = 'There are no items to display at this time.', actionText, onAction, icon: Icon = FileQuestion }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 my-4">
      <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h4 className="text-base font-semibold text-slate-200">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
