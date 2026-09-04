import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
        <FileQuestion className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-white">404 — Page Not Found</h1>
      <p className="text-xs text-slate-400 max-w-sm">The page or certificate route you are looking for does not exist.</p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center space-x-2 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};
