import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Award, Search, Eye, Download, Share2, RotateCcw, XCircle, ExternalLink, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const IssuedCertsPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.getCertificates();
      if (res.success) setCertificates(res.certificates);
    } catch (err) {
      console.error('[Fetch Certificates Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this certificate?')) return;
    try {
      const res = await api.revokeCertificate(id, 'Revoked by Organization Administrator');
      if (res.success) {
        alert('Certificate revoked successfully.');
        fetchCertificates();
      }
    } catch (err) {
      alert(`Revocation failed: ${err.message}`);
    }
  };

  if (loading) return <LoadingSpinner label="Loading organization certificates..." />;

  const filteredCerts = certificates.filter((c) => {
    const matchesSearch = c.certificateId?.toLowerCase().includes(search.toLowerCase()) ||
      c.recipientName?.toLowerCase().includes(search.toLowerCase()) ||
      c.courseName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Issued Certificates Master List</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage your organization's active, valid, and revoked certificate credentials.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, student, or course..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Issued">Issued / Valid</option>
            <option value="Draft">Draft</option>
            <option value="Revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Certificate Credentials ({filteredCerts.length})</h3>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Authenticated Issuance
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Certificate ID</th>
                <th className="py-3.5 px-4">Recipient Name</th>
                <th className="py-3.5 px-4">Course Program</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredCerts.length > 0 ? (
                filteredCerts.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-blue-600">{cert.certificateId}</td>
                    <td className="py-4 px-4 font-semibold text-slate-900">{cert.recipientName}</td>
                    <td className="py-4 px-4 text-slate-600 truncate max-w-[200px]">{cert.courseName}</td>
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(cert.issueDate || cert.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          cert.status === 'Issued' || cert.status === 'Valid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : cert.status === 'Revoked'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {cert.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        to={`/verify/${cert.certificateId}`}
                        target="_blank"
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs transition-colors"
                      >
                        Verify QR
                      </Link>
                      {cert.status !== 'Revoked' && (
                        <button
                          onClick={() => handleRevoke(cert._id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                    No matching certificates found.
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
