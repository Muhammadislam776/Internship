import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Users, Search, ShieldCheck, ShieldAlert, Award, Mail, ExternalLink } from 'lucide-react';

export const ManageRecipients = () => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const res = await api.getAllUsers('recipient');
      if (res.success) setRecipients(res.users);
    } catch (err) {
      console.error('[Fetch Recipients Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    if (!window.confirm(`Are you sure you want to set ${user.name} to ${newStatus}?`)) return;
    try {
      const res = await api.updateUserStatus(user._id, newStatus);
      if (res.success) {
        alert(`User status updated to ${newStatus}`);
        fetchRecipients();
      }
    } catch (err) {
      alert(`Error updating user status: ${err.message}`);
    }
  };

  if (loading) return <LoadingSpinner label="Loading recipient records..." />;

  const filteredRecipients = recipients.filter((r) => {
    const matchesSearch = r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recipients & Student Users</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage recipient accounts, certificate recipient profiles, and account active/suspended statuses.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or email..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Recipient Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Student Recipients ({filteredRecipients.length})
          </h3>
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            Registered Students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Recipient Name</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredRecipients.length > 0 ? (
                filteredRecipients.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {user.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {user._id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-medium">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        Recipient
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          user.status === 'suspended'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {user.status === 'suspended' ? 'Suspended' : 'Active'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          user.status === 'suspended'
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                        }`}
                      >
                        {user.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                    No matching recipient accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
