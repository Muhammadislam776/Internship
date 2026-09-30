import React, { useState } from 'react';
import { PrescriptionRefillRequest } from '../../types';
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldCheck,
  FileText,
  ChevronRight,
  X,
  Info,
  Building2,
  AlertTriangle
} from 'lucide-react';

interface MyPrescriptionsProps {
  prescriptions: PrescriptionRefillRequest[];
  onRequestRefill: (data: {
    medicationName: string;
    dosage: string;
    note?: string;
    pharmacy?: string;
  }) => void;
}

export const MyPrescriptions: React.FC<MyPrescriptionsProps> = ({
  prescriptions,
  onRequestRefill
}) => {
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [refillStep, setRefillStep] = useState<number>(1);
  const [selectedMed, setSelectedMed] = useState<string>('Salbutamol 100mcg Inhaler');
  const [customDosage, setCustomDosage] = useState<string>('100mcg');
  const [pharmacy, setPharmacy] = useState<string>('Boots Pharmacy - Piccadilly Branch (NHS EPS)');
  const [patientNote, setPatientNote] = useState<string>('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const activeMeds = [
    {
      id: 'rx_1',
      name: 'Salbutamol 100mcg Inhaler',
      dosage: '100mcg CFC-Free',
      instructions: 'Inhale 1 to 2 puffs when required for wheezing or breathlessness',
      prescriber: 'Dr. Sarah Jenkins (GMC 7489201)',
      dateIssued: '15 September 2026',
      status: 'Active',
      repeatsLeft: 3,
      category: 'Respiratory / Asthma'
    },
    {
      id: 'rx_2',
      name: 'Cetirizine Hydrochloride 10mg Tablets',
      dosage: '10mg',
      instructions: 'Take 1 tablet daily with water',
      prescriber: 'Dr. James Thorne (GMC 6198442)',
      dateIssued: '02 August 2026',
      status: 'Active',
      repeatsLeft: 2,
      category: 'Allergy / Antihistamine'
    }
  ];

  const handleStartRefill = (medName?: string) => {
    if (medName) {
      setSelectedMed(medName);
    }
    setRefillStep(1);
    setSubmittedMessage(false);
    setShowRefillModal(true);
  };

  const handleCompleteSubmit = () => {
    onRequestRefill({
      medicationName: selectedMed,
      dosage: customDosage,
      note: patientNote,
      pharmacy: pharmacy
    });
    setSubmittedMessage(true);
  };

  const getRefillStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'pending_review':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full animate-pulse">
            <Clock className="w-3 h-3" /> Pending Doctor Approval
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Prescriptions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Repeat medications authorized via NHS Electronic Prescription Service (EPS)
          </p>
        </div>

        <button
          onClick={() => handleStartRefill()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Request Repeat Refill
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 space-y-0.5">
          <p className="font-bold">Prescription Safety & Protocol</p>
          <p className="text-blue-700 leading-relaxed">
            Patients can request repeat prescriptions. All requests must be reviewed and digitally authorized by your registered GP before being sent electronically to your chosen pharmacy. Please allow up to 48 hours for review.
          </p>
        </div>
      </div>

      {/* Active Medications List */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
          Active Prescriptions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMeds.map((med) => (
            <div
              key={med.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{med.name}</h3>
                      <p className="text-xs text-slate-500">{med.dosage}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <p className="text-slate-700">
                    <span className="font-bold text-slate-900">Instructions:</span> {med.instructions}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Prescribed by: <strong className="text-slate-700">{med.prescriber}</strong>
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                    <span>Issued: {med.dateIssued}</span>
                    <span>Repeats remaining: <strong className="text-slate-700 font-bold">{med.repeatsLeft}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-2">
                <button
                  onClick={() => handleStartRefill(med.name)}
                  className="flex-1 py-2.5 bg-orange-50 hover:bg-orange-100 active:scale-[0.98] text-orange-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                >
                  Request Refill
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refill Request History */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Recent Refill Requests</h2>
          <p className="text-xs text-slate-500 mt-0.5">Tracking your repeat medication requests</p>
        </div>

        {prescriptions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {prescriptions.map((req) => (
              <div
                key={req.id}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">{req.medicationName}</p>
                      {getRefillStatusBadge(req.status)}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Requested on {new Date(req.requestedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {req.doctorName && ` · Reviewer: ${req.doctorName}`}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 self-end sm:self-auto font-mono text-[11px]">
                  Ref: {req.id}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500">
            No refill requests submitted yet.
          </div>
        )}
      </div>

      {/* ── 4-STEP REFILL REQUEST MODAL ── */}
      {showRefillModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Request Repeat Prescription</h3>
                <p className="text-xs text-slate-500">Step {refillStep} of 4</p>
              </div>
              <button
                onClick={() => setShowRefillModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Steps Content */}
            {!submittedMessage ? (
              <>
                {/* Step 1: Choose Medication */}
                {refillStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 font-medium">
                      Select the repeat medication you need to order:
                    </p>
                    <div className="space-y-2">
                      {activeMeds.map((m) => (
                        <label
                          key={m.id}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            selectedMed === m.name
                              ? 'border-orange-500 bg-orange-50/40 text-orange-950 font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="med"
                              checked={selectedMed === m.name}
                              onChange={() => {
                                setSelectedMed(m.name);
                                setCustomDosage(m.dosage);
                              }}
                              className="text-orange-500 focus:ring-orange-400"
                            />
                            <div>
                              <p className="text-xs">{m.name}</p>
                              <p className="text-[11px] text-slate-500 font-normal">{m.instructions}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal">{m.repeatsLeft} left</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Review Prescription & Pharmacy */}
                {refillStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 font-medium">
                      Confirm your prescription details and chosen dispensing pharmacy:
                    </p>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Medication:</span>
                        <strong className="text-slate-900">{selectedMed}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Dosage:</span>
                        <span className="text-slate-700">{customDosage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Practice:</span>
                        <span className="text-slate-700">St. James Health Centre</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-600" /> Dispensing NHS Pharmacy
                      </label>
                      <select
                        value={pharmacy}
                        onChange={(e) => setPharmacy(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                      >
                        <option value="Boots Pharmacy - Piccadilly Branch (NHS EPS)">Boots Pharmacy - Piccadilly Branch (NHS EPS)</option>
                        <option value="LloydsPharmacy - Kensington High St">LloydsPharmacy - Kensington High St</option>
                        <option value="Superdrug Pharmacy - London Oxford St">Superdrug Pharmacy - London Oxford St</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3: Add Note */}
                {refillStep === 3 && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 font-medium">
                      Add any note or clinical update for your GP (optional):
                    </p>
                    <textarea
                      value={patientNote}
                      onChange={(e) => setPatientNote(e.target.value)}
                      placeholder="e.g. Inhaler running low, taking 1 puff daily as discussed in my last review..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                    />
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>If you are feeling unwell or have urgent symptoms, please contact NHS 111 or book an emergency consultation.</span>
                    </div>
                  </div>
                )}

                {/* Step 4: Submit Confirmation */}
                {refillStep === 4 && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200 space-y-2">
                      <p className="font-bold text-orange-950">Ready to Submit Request</p>
                      <p className="text-orange-900">
                        You are submitting a refill request for <strong>{selectedMed}</strong>.
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Electronic token will be forwarded to <strong>{pharmacy}</strong> upon doctor sign-off.
                      </p>
                    </div>

                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      By clicking "Submit Request", you confirm you are requesting your prescribed repeat medication in accordance with NHS guidance.
                    </p>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  {refillStep > 1 ? (
                    <button
                      onClick={() => setRefillStep((s) => s - 1)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Back
                    </button>
                  ) : <div />}

                  {refillStep < 4 ? (
                    <button
                      onClick={() => setRefillStep((s) => s + 1)}
                      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteSubmit}
                      className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                    >
                      Submit Refill Request
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Success confirmation */
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Refill Request Submitted</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Your request for <strong>{selectedMed}</strong> has been sent to Dr. Sarah Jenkins. Status: <strong className="text-amber-600">Pending Doctor Approval</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setShowRefillModal(false)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
