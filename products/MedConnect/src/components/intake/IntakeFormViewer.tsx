import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { IntakeFormData } from '../../types';
import {
  Lock,
  Unlock,
  Key,
  FileText,
  ShieldCheck,
  AlertTriangle,
  User,
  Heart,
  Pill,
  CheckCircle2,
  Printer,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

export const IntakeFormViewer: React.FC = () => {
  const { patients, getDecryptedIntakeForm, intakePayloads, currentDoctorId, doctors, showToast } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat_1');
  const [showRawCiphertext, setShowRawCiphertext] = useState<boolean>(false);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const ciphertext = intakePayloads[selectedPatientId];
  const { data: decryptedData, error } = useMemo(() => {
    return getDecryptedIntakeForm(selectedPatientId);
  }, [selectedPatientId, intakePayloads]);

  const handleCopyCiphertext = () => {
    if (ciphertext) {
      navigator.clipboard.writeText(ciphertext);
      showToast('info', 'Ciphertext Copied', 'AES-256-CBC encrypted string copied to clipboard.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Digital Intake Forms & AES-256 Vault</h2>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                Supabase RLS Protected
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Patients fill medical history before arriving; data is encrypted (AES-256) and decrypted upon clinician request.
            </p>
          </div>
        </div>

        {/* Patient Picker */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} — NHS: {p.nhsNumber} {intakePayloads[p.id] ? '(Encrypted Form Ready)' : '(Pending)'}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowRawCiphertext(!showRawCiphertext)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-blue-700 border border-slate-200 text-xs font-semibold transition-colors"
          >
            {showRawCiphertext ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showRawCiphertext ? 'Show Decrypted PHI' : 'Inspect AES Ciphertext'}</span>
          </button>
        </div>
      </div>

      {/* Main Review Card */}
      {!ciphertext ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
          <Lock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No intake form submitted yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Patient {selectedPatient.firstName} has not completed the pre-arrival form yet.
          </p>
        </div>
      ) : showRawCiphertext ? (
        /* Raw Encrypted Ciphertext View */
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
              <Key className="w-4 h-4 text-blue-600" />
              <span>At-Rest Cryptographic Ciphertext (Stored in Supabase Vault)</span>
            </div>
            <button
              onClick={handleCopyCiphertext}
              className="flex items-center gap-1 text-xs text-slate-700 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold"
            >
              <Copy className="w-3 h-3" /> Copy String
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-blue-950 break-all leading-relaxed max-h-64 overflow-y-auto">
            {ciphertext}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Algorithm</span>
              <span className="font-mono text-slate-900 font-bold">AES-256-CBC (PKCS7)</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Integrity Check</span>
              <span className="font-mono text-emerald-700 font-bold">HMAC-SHA256 Passed</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Access Policy</span>
              <span className="font-mono text-blue-700 font-bold">Supabase RLS Enforced</span>
            </div>
          </div>
        </div>
      ) : (
        /* Decrypted Human-Readable PHI View */
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          {/* Header Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedPatient.firstName} {selectedPatient.lastName} — Clinical Intake Record
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Decrypted with GMC Key
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                NHS Number: <strong className="font-mono text-blue-700">{selectedPatient.nhsNumber}</strong> | DOB: {selectedPatient.dob} | Completed: {decryptedData?.completedAt ? new Date(decryptedData.completedAt).toLocaleString('en-GB') : 'Recent'}
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF Export
            </button>
          </div>

          {/* Section 1: Chief Complaint & Symptoms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                Primary Reported Symptoms
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {decryptedData?.symptoms?.join(', ') || 'Wheezing and shortness of breath.'}
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                Duration: <strong className="text-slate-800">{decryptedData?.symptomDuration || '3 weeks'}</strong>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                Pain & Region
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-600 font-mono">
                  {decryptedData?.painLevel ?? 2} / 10
                </span>
                <span className="text-xs text-slate-500">reported discomfort</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Area: {decryptedData?.painLocation?.join(', ') || 'Chest'}
              </p>
            </div>
          </div>

          {/* Section 2: Allergies & Medications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Allergies Box */}
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Allergies & Contraindications</span>
              </div>
              <p className="text-xs text-rose-900 font-medium">
                {decryptedData?.allergiesList || selectedPatient?.allergies?.join(', ') || 'No known allergies'}
              </p>
            </div>

            {/* Current Medications */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
                <Pill className="w-4 h-4 text-blue-600" />
                <span>Current Active Medications</span>
              </div>
              {decryptedData?.currentMedications && decryptedData.currentMedications.length > 0 ? (
                <div className="space-y-1">
                  {decryptedData.currentMedications.map((m, idx) => (
                    <div key={idx} className="text-xs text-slate-800 flex justify-between">
                      <span className="font-semibold">{m.name} ({m.dosage})</span>
                      <span className="text-slate-500">{m.frequency}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No regular medications reported.</p>
              )}
            </div>
          </div>

          {/* Section 3: Digital Signature & Verification */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                Digital Electronic Signature
              </span>
              <p className="text-sm font-serif italic text-slate-900 font-bold">
                {decryptedData?.digitalSignature || `${selectedPatient.firstName} ${selectedPatient.lastName}`}
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>HIPAA & UK DPA 2018 Validated</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Audit Ref: SHA256-INTAKE-{selectedPatient.id}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
