import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PrescriptionRefillRequest } from '../../types';
import {
  Pill,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  User,
  Clock,
  QrCode,
  ShieldCheck,
  Search,
  Printer,
  Plus,
  Filter,
  FileText,
  X,
  Send
} from 'lucide-react';

export const PrescriptionRefills: React.FC = () => {
  const {
    refillRequests,
    approvePrescription,
    rejectPrescription,
    createRefillRequest,
    patients,
    doctors,
    currentDoctorId,
    showToast
  } = useApp();
  const { currentUser } = useAuth();

  const currentDoctor = doctors.find((d) => d.id === currentDoctorId) || doctors[0];

  // Distinct filter state to avoid shadowing AppContext's activeTab
  const [refillFilter, setRefillFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTokenForModal, setSelectedTokenForModal] = useState<PrescriptionRefillRequest | null>(null);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [declineRefillId, setDeclineRefillId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('Requires in-person clinical review before repeat issuance.');

  // Form State for New Refill
  const [formPatientId, setFormPatientId] = useState(patients[0]?.id || 'pat_1');
  const [formMedName, setFormMedName] = useState('Salbutamol 100mcg Inhaler (Ventolin)');
  const [formDosage, setFormDosage] = useState('100mcg/puff');
  const [formQuantity, setFormQuantity] = useState('2 x 200 dose inhalers');
  const [formFrequency, setFormFrequency] = useState('1-2 puffs as required for wheezing');
  const [formReason, setFormReason] = useState('Routine 3-month repeat medication order');
  const [formPharmacy, setFormPharmacy] = useState('Boots Pharmacy (Mayfair, London)');
  const [formOds, setFormOds] = useState('FA391');

  // Filtered and searched prescriptions
  const filteredRefills = useMemo(() => {
    return refillRequests.filter((r) => {
      // Status filter
      if (refillFilter === 'pending' && r.status !== 'pending_review') return false;
      if (refillFilter === 'approved' && r.status !== 'approved') return false;
      if (refillFilter === 'rejected' && r.status !== 'rejected') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchMed = r.medicationName.toLowerCase().includes(q);
        const matchPatient = r.patientName.toLowerCase().includes(q);
        const matchNhs = r.patientNhsNumber.toLowerCase().includes(q);
        const matchBnf = (r.bnfCode || '').toLowerCase().includes(q);
        return matchMed || matchPatient || matchNhs || matchBnf;
      }
      return true;
    });
  }, [refillRequests, refillFilter, searchQuery]);

  // Counts
  const pendingCount = refillRequests.filter((r) => r.status === 'pending_review').length;
  const approvedCount = refillRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = refillRequests.filter((r) => r.status === 'rejected').length;

  const handleCreateNewRefill = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === formPatientId) || patients[0];
    const doctor = currentDoctor;

    createRefillRequest({
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientNhsNumber: patient.nhsNumber,
      doctorId: doctor.id,
      doctorName: doctor.name,
      medicationName: formMedName,
      bnfCode: '0301011R0',
      dosage: formDosage,
      quantity: formQuantity,
      frequency: formFrequency,
      lastIssuedDate: new Date().toISOString().split('T')[0],
      reasonForRequest: formReason,
      preferredPharmacy: {
        name: formPharmacy,
        odsCode: formOds,
        address: 'Central Healthcare Quarter, London',
        electronicPrescriptionService: true
      },
      clinicalSafetyNotes: 'Routine repeat request candidate.'
    });

    setIsNewRequestModalOpen(false);
  };

  const handleConfirmDecline = () => {
    if (declineRefillId) {
      rejectPrescription(declineRefillId, declineReason);
      setDeclineRefillId(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Top Header Banner ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                Repeat Prescriptions & NHS EPS
              </h1>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                EPS Release 2 Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review repeat refill requests, check BNF formulary safety alerts, and digitally authorize with GMC token.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewRequestModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Repeat Request</span>
        </button>
      </div>

      {/* ── Search Bar & Filter Tabs ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'pending', label: 'Pending Review', count: pendingCount, color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { id: 'approved', label: 'Approved & Sent to EPS', count: approvedCount, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            { id: 'rejected', label: 'Declined', count: rejectedCount, color: 'text-rose-700 bg-rose-50 border-rose-200' },
            { id: 'all', label: 'All Requests', count: refillRequests.length, color: 'text-slate-700 bg-slate-100 border-slate-200' },
          ].map((tab) => {
            const isActive = refillFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setRefillFilter(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white text-blue-700' : tab.color
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search med, patient, NHS..."
            className="bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none w-full text-xs"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Prescription Cards Grid ── */}
      {filteredRefills.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <Pill className="w-12 h-12 text-slate-200 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No prescription requests in this view</h3>
          <p className="text-xs text-slate-400">
            {refillFilter === 'pending'
              ? 'All patient repeat medication queues are completely up to date.'
              : 'Try changing the filter or search query.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRefills.map((refill) => (
            <div
              key={refill.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition-all space-y-3.5 flex flex-col justify-between"
            >
              {/* Header: Medication + Status */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {refill.medicationName}
                      </h3>
                      {refill.bnfCode && (
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          BNF: {refill.bnfCode}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                      <span>Patient: <strong className="text-slate-800">{refill.patientName}</strong></span>
                      <span>·</span>
                      <span className="font-mono text-blue-700 font-semibold">NHS {refill.patientNhsNumber}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                      refill.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : refill.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {refill.status === 'pending_review' ? 'Pending Review' : refill.status}
                  </span>
                </div>

                {/* Dosage & Frequency Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 mt-3">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Dosage & Quantity</span>
                    <span className="font-semibold text-slate-900">{refill.dosage} — {refill.quantity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Frequency</span>
                    <span className="font-semibold text-slate-900">{refill.frequency}</span>
                  </div>
                </div>

                {/* Safety / Drug Interaction Warning */}
                {refill.interactionWarning && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 mt-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="leading-relaxed">{refill.interactionWarning.message}</span>
                  </div>
                )}

                {/* Nominated Pharmacy */}
                <div className="text-xs text-slate-600 flex items-center justify-between pt-2">
                  <span className="flex items-center gap-1.5 font-medium truncate max-w-[280px]">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{refill.preferredPharmacy.name}</span>
                    <span className="font-mono text-slate-400 text-[10px]">(ODS: {refill.preferredPharmacy.odsCode})</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    EPS Release 2 Ready
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {refill.status === 'pending_review' ? (
                  <>
                    <button
                      onClick={() => setDeclineRefillId(refill.id)}
                      className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
                    >
                      Decline Refill
                    </button>

                    <button
                      onClick={() => approvePrescription(refill.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>1-Click EPS Sign & Dispatch</span>
                    </button>
                  </>
                ) : refill.status === 'approved' ? (
                  <div className="w-full flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-[11px] text-emerald-700 flex items-center gap-1 font-semibold truncate max-w-[280px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Signed: {refill.doctorSignature || 'Dr. Sarah Jenkins (GMC 7489201)'}</span>
                    </span>
                    <button
                      onClick={() => setSelectedTokenForModal(refill)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold text-xs shrink-0"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View EPS Token</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-between text-xs text-rose-600">
                    <span className="flex items-center gap-1 font-semibold truncate">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Declined: {refill.rejectionReason || 'Requires consultation'}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Decline Refill Modal ── */}
      {declineRefillId && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setDeclineRefillId(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Decline Prescription Request</h3>
              </div>
              <button onClick={() => setDeclineRefillId(null)} className="text-slate-400 hover:text-slate-700 p-1">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Please specify the clinical rationale for declining this repeat prescription request. This reason will be logged in the NHS audit trail and communicated to the patient.
              </p>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Reason</label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleConfirmDecline}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Confirm Decline
              </button>
              <button
                onClick={() => setDeclineRefillId(null)}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View EPS Electronic Token Modal ── */}
      {selectedTokenForModal && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedTokenForModal(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">NHS EPS Electronic Token</h3>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">EPS Release 2 Certified</span>
                </div>
              </div>
              <button onClick={() => setSelectedTokenForModal(null)} className="text-slate-400 hover:text-slate-700 p-1">
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2.5 text-slate-800">
              <div className="font-bold text-sm text-slate-900">{selectedTokenForModal.medicationName}</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block font-bold">Patient</span>
                  <span className="font-semibold text-slate-900">{selectedTokenForModal.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">NHS Number</span>
                  <span className="font-mono text-blue-700 font-bold">{selectedTokenForModal.patientNhsNumber}</span>
                </div>
              </div>
              <div className="text-[11px]">
                <span className="text-slate-400 block font-bold">Nominated Pharmacy</span>
                <span className="text-slate-800">{selectedTokenForModal.preferredPharmacy.name} (ODS: {selectedTokenForModal.preferredPharmacy.odsCode})</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-[10px] text-emerald-700">
                Token Ref: UK-EPS-R2-{selectedTokenForModal.id}-{Date.now().toString().slice(-4)}
              </div>
            </div>

            <button
              onClick={() => setSelectedTokenForModal(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs"
            >
              Close Token View
            </button>
          </div>
        </div>
      )}

      {/* ── New Refill Request Modal ── */}
      {isNewRequestModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsNewRequestModalOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Request Repeat Prescription Refill</h3>
              <button onClick={() => setIsNewRequestModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewRefill} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Patient</label>
                <select
                  value={formPatientId}
                  onChange={(e) => setFormPatientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} (NHS: {p.nhsNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Medication Name (BNF)</label>
                <input
                  type="text"
                  value={formMedName}
                  onChange={(e) => setFormMedName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dosage</label>
                  <input
                    type="text"
                    value={formDosage}
                    onChange={(e) => setFormDosage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="text"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nominated EPS Community Pharmacy</label>
                <input
                  type="text"
                  value={formPharmacy}
                  onChange={(e) => setFormPharmacy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Refill</label>
                <input
                  type="text"
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Submit Repeat Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
