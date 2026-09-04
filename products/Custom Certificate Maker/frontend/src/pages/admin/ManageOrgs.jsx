import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Building2, Search, CheckCircle, ShieldAlert, Trash2, Edit, Plus, Mail, ExternalLink } from 'lucide-react';

export const ManageOrgs = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    try {
      const res = await api.getAllOrganizations();
      if (res.success) setOrganizations(res.organizations);
    } catch (err) {
      console.error('[Fetch Orgs Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (org) => {
    const newStatus = org.owner?.status === 'suspended' ? 'active' : 'suspended';
    if (!window.confirm(`Are you sure you want to ${newStatus} ${org.name}?`)) return;
    try {
      const res = await api.updateUserStatus(org.owner._id, newStatus);
      if (res.success) {
        alert(`Organization is now ${newStatus}`);
        fetchOrgs();
      }
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  if (loading) return <LoadingSpinner label="Loading organization records..." />;

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch = org.name?.toLowerCase().includes(search.toLowerCase()) ||
      org.contactEmail?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (org.owner?.status || 'active').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Organizations</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor registered certificate issuing institutions, access permissions, and account status.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search organizations..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Status Filter */}
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

      {/* Organization Table Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Registered Institutions ({filteredOrgs.length})
          </h3>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Verified Issuers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Organization</th>
                <th className="py-3.5 px-4">Contact Email</th>
                <th className="py-3.5 px-4">Issuer Name</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredOrgs.length > 0 ? (
                filteredOrgs.map((org) => (
                  <tr key={org._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                          <img src={org.logo} alt={org.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{org.name}</p>
                          <a href={org.website} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline flex items-center space-x-1">
                            <span>{org.website}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600">{org.contactEmail}</td>
                    <td className="py-4 px-4 font-semibold text-slate-800">{org.issuerName || 'Dr. Robert Vance'}</td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          org.owner?.status === 'suspended'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {org.owner?.status === 'suspended' ? 'Suspended' : 'Active'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrg(org);
                          setShowModal(true);
                        }}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleToggleStatus(org)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          org.owner?.status === 'suspended'
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                        }`}
                      >
                        {org.owner?.status === 'suspended' ? 'Activate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                    No matching organizations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organization Details Modal */}
      {showModal && selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <img src={selectedOrg.logo} alt="" className="w-10 h-10 object-contain rounded-xl border border-slate-200 p-1" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedOrg.name}</h3>
                  <p className="text-xs text-slate-500">ID: {selectedOrg._id}</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Contact Email</p>
                  <p className="font-semibold text-slate-900">{selectedOrg.contactEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Issuer Name</p>
                  <p className="font-semibold text-slate-900">{selectedOrg.issuerName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Designation</p>
                  <p className="font-semibold text-slate-900">{selectedOrg.issuerDesignation}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Website</p>
                  <p className="font-semibold text-blue-600">{selectedOrg.website}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Official Address</p>
                <p className="font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedOrg.address || '100 Innovation Boulevard, Silicon Valley, CA'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
