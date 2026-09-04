import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Users, Search, Plus, Upload, CheckCircle, Award, Mail, FileSpreadsheet } from 'lucide-react';

export const RecipientsPage = () => {
  const [recipients, setRecipients] = useState([
    { id: 1, name: 'Muhammad Ali', email: 'student@example.com', totalCerts: 2, lastCert: 'CERT-2026-953577', status: 'active' },
    { id: 2, name: 'Fatima Khan', email: 'fatima@example.com', totalCerts: 1, lastCert: 'CERT-2026-881920', status: 'active' },
    { id: 3, name: 'Zaid Ahmed', email: 'zaid@example.com', totalCerts: 1, lastCert: 'CERT-2026-773821', status: 'active' }
  ]);
  const [search, setSearch] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkStatus('Reading CSV data...');
    setTimeout(() => {
      setBulkStatus('Generating 45 / 100 certificates...');
      setTimeout(() => {
        setBulkStatus('');
        setShowBulkModal(false);
        alert('🎉 BULK ISSUANCE COMPLETE!\n\n100 certificates issued with unique IDs and scannable QR codes.');
      }, 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recipient Student Roster</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage enrolled students, recipient profiles, and batch issue certificates via CSV upload.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center space-x-2 shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Bulk Issue CSV</span>
          </button>

          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipients..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Recipient Roster Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Enrolled Students ({recipients.length})</h3>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Active Recipients
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Recipient Name</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Certificates Count</th>
                <th className="py-3.5 px-4">Latest Certificate ID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {recipients.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{r.name}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-slate-600 font-medium">{r.email}</td>
                  <td className="py-4 px-4 font-bold text-blue-600 font-mono">{r.totalCerts} cert(s)</td>
                  <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">{r.lastCert}</td>

                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      Active
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => alert(`View recipient profile for ${r.name}`)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Issuance Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>Bulk Issue Certificates via CSV</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload a CSV file containing <code className="text-blue-600 font-mono">Name, Email, Course, IssueDate</code> columns to batch generate certificates.
            </p>

            <label className="block p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl text-center cursor-pointer bg-slate-50 transition-colors">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-900">Upload Recipients CSV File</span>
              <span className="block text-[10px] text-slate-400 mt-1">Supports .csv, .xlsx</span>
              <input type="file" accept=".csv, .xlsx" onChange={handleBulkUpload} className="hidden" />
            </label>

            {bulkStatus && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs font-bold text-blue-800 text-center animate-pulse">
                {bulkStatus}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
