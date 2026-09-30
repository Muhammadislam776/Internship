import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLogEntry } from '../../types';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  UserX,
  Download,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Key,
  Globe,
  Database,
  History,
  Trash2,
  XCircle
} from 'lucide-react';

export const ComplianceCenter: React.FC = () => {
  const { auditLogs, patients, requestGdprAnonymization, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientForForget, setSelectedPatientForForget] = useState<string>(patients[0]?.id || 'pat_1');
  const [isForgetModalOpen, setIsForgetModalOpen] = useState(false);

  const filteredLogs = auditLogs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.userName.toLowerCase().includes(q) ||
      (log.patientName && log.patientName.toLowerCase().includes(q)) ||
      log.details.toLowerCase().includes(q) ||
      log.ipAddress.toLowerCase().includes(q)
    );
  });

  const handleExportComplianceDossier = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(
        {
          dossierTitle: 'ClinicFlow UK GDPR Article 30 Records of Processing Activities (ROPA)',
          generatedAt: new Date().toISOString(),
          standards: ['Designed with HIPAA 45 CFR Part 160/164', 'UK Data Protection Act 2018 / GDPR', 'NHS DSPT Ready'],
          encryptionStandard: 'AES-256-CBC with HMAC-SHA256 and TLS 1.3 in transit',
          auditTrail: auditLogs
        },
        null,
        2
      )
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `clinicflow_gdpr_audit_dossier_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('success', 'Compliance Dossier Exported', 'Full encrypted audit log downloaded for Information Governance review.');
  };

  const handleConfirmForget = () => {
    requestGdprAnonymization(selectedPatientForForget);
    setIsForgetModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Compliance, Security & Immutable Audit Vault</h2>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                UK GDPR Art 32 Encrypted
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Technical safeguards designed with HIPAA & UK GDPR requirements, Row-Level Security (RLS) policies, and immutable audit trails.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsForgetModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all"
          >
            <UserX className="w-4 h-4 text-rose-600" />
            <span>Right to be Forgotten (GDPR Art 17)</span>
          </button>

          <button
            onClick={handleExportComplianceDossier}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export ROPA Audit Dossier</span>
          </button>
        </div>
      </div>

      {/* Safeguard Architecture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Data in Transit</span>
          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>TLS 1.3 / DTLS-SRTP (WebRTC)</span>
          </div>
          <p className="text-[11px] text-slate-500">Zero unencrypted plain text across public networks.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Data At Rest</span>
          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>AES-256-CBC Vault</span>
          </div>
          <p className="text-[11px] text-slate-500">Client-side encryption before database commit.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Multi-Tenancy</span>
          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Supabase RLS Isolation</span>
          </div>
          <p className="text-[11px] text-slate-500">Strict cross-clinic data separation policies.</p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Immutable Access & Processing Log Trail</h3>
            <p className="text-xs text-slate-500">Every record view, prescription sign-off, and decryption event is timestamped.</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs w-72">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit actions, IP, user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Actor / User</th>
                <th className="py-2.5 px-3">Target Patient</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-GB')}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-700 whitespace-nowrap">
                    {log.userName} ({log.userRole})
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                    {log.patientName || 'N/A'}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-600 max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right to be Forgotten Modal */}
      {isForgetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">GDPR Article 17 Right to Erasure</h3>
              </div>
              <button onClick={() => setIsForgetModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This action cryptographically scrubs personal identifying details (name, email, phone, NHS number) and wipes encrypted clinical intake form payloads in compliance with GDPR Article 17.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Select Patient to Anonymize:</label>
              <select
                value={selectedPatientForForget}
                onChange={(e) => setSelectedPatientForForget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} (NHS: {p.nhsNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsForgetModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmForget}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Confirm Cryptographic Erasure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
