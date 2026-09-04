import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Key, Mail, Building, CheckCircle } from 'lucide-react';

export const AdminProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Super Admin');
  const [email, setEmail] = useState(user?.email || 'admin@certmaker.com');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Super Admin Profile</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage your administrator account credentials, master authorization keys, and security settings.
          </p>
        </div>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 font-extrabold text-xs rounded-full border border-orange-200">
          Master Administrator
        </span>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            SA
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{name}</h3>
            <p className="text-xs text-blue-600 font-semibold">{email}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Role: superadmin (Master Privilege)</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Admin Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Master Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {isSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
