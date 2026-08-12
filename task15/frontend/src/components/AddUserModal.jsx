import React, { useState } from 'react';
import { X, UserPlus, Mail, Phone, Shield, Sparkles } from 'lucide-react';
import { createAdminUserApi } from '../services/api';

export const AddUserModal = ({ onClose, onSuccess, onShowToast }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email) {
      onShowToast && onShowToast({ title: 'Validation Error', message: 'Full Name and Email are required', type: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await createAdminUserApi({
        full_name: fullName,
        email,
        phone,
        role
      });
      if (res.success) {
        onShowToast && onShowToast({ title: 'User Created', message: `${fullName} was created successfully via Express API`, type: 'success' });
        onSuccess && onSuccess();
        onClose();
      } else {
        throw new Error(res.error || 'Failed to create user');
      }
    } catch (err) {
      onShowToast && onShowToast({ title: 'Error Creating User', message: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative glass-panel rounded-3xl p-6 border border-[#22D3EE]/40 shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#22D3EE]" />
            <h3 className="font-bold text-base text-white">Create New Platform User</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-white/10 text-[#9FB0C2] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#9FB0C2] mb-1 font-semibold">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Alexis Vance"
              className="w-full glass-input p-3 rounded-xl text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-[#9FB0C2] mb-1 font-semibold">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alexis@enterprise.io"
              className="w-full glass-input p-3 rounded-xl text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-[#9FB0C2] mb-1 font-semibold">Phone Contact</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 234-5678"
              className="w-full glass-input p-3 rounded-xl text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-[#9FB0C2] mb-1 font-semibold">Assign Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full glass-input p-3 rounded-xl text-white text-xs bg-[#071A2B]"
            >
              <option value="user" className="bg-[#071A2B]">Standard User</option>
              <option value="moderator" className="bg-[#071A2B]">Moderator</option>
              <option value="admin" className="bg-[#071A2B]">Administrator</option>
            </select>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FFB86B] font-bold text-white shadow-lg shadow-[#FF7A18]/30 hover:scale-105 transition-all"
            >
              {submitting ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
