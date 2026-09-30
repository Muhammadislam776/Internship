import React, { useState, useEffect } from 'react';
import { Patient } from '../../types';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Save,
  ShieldCheck,
  User,
  Heart,
  Pill,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

interface MyHealthFormsProps {
  patient: Patient;
  onSaveProgressToast?: (message: string) => void;
  onSubmitSuccess?: () => void;
}

export const MyHealthForms: React.FC<MyHealthFormsProps> = ({
  patient,
  onSaveProgressToast,
  onSubmitSuccess
}) => {
  const [activeFormMode, setActiveFormMode] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  // Form State (pre-filled with authenticated patient info)
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: `${patient.firstName} ${patient.lastName}`.trim(),
    dob: patient.dob || '1992-06-15',
    nhsNumber: patient.nhsNumber || '485 772 9012',
    phone: patient.phone || '+44 7700 900555',
    email: patient.email || '',
    address: patient.address ? `${patient.address.line1}, ${patient.address.city}, ${patient.address.postcode}` : '12 St. James Square, London, SW1Y 4LE',
    // Step 2: Medical History
    hasHighBP: false,
    hasDiabetes: false,
    hasAsthma: true,
    hasHeartDisease: false,
    pastSurgeries: 'Appendectomy (2018)',
    // Step 3: Medications
    medications: 'Salbutamol 100mcg Inhaler (as needed)',
    // Step 4: Allergies
    allergies: 'Penicillin V (Mild skin rash)',
    // Step 5: Symptoms
    primaryConcern: 'Routine consultation and seasonal wheezing review',
    symptomDuration: '2 weeks',
    painScale: 2,
    // Step 6: Consent
    consentAccepted: true
  });

  const [savedDraftNotice, setSavedDraftNotice] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Load draft from localStorage if available
  useEffect(() => {
    const draftKey = `medconnect_intake_draft_${patient.id}`;
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, [patient.id]);

  const handleSaveDraft = () => {
    const draftKey = `medconnect_intake_draft_${patient.id}`;
    localStorage.setItem(draftKey, JSON.stringify(formData));
    setSavedDraftNotice(true);
    if (onSaveProgressToast) {
      onSaveProgressToast('Health questionnaire draft saved. You can continue later.');
    }
    setTimeout(() => setSavedDraftNotice(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveDraft();
    setIsSubmitted(true);
    setActiveFormMode(false);
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  const formsList = [
    {
      id: 'f_1',
      title: 'Pre-Arrival Medical Intake Form',
      description: 'Comprehensive personal medical history, current symptoms & medications',
      status: isSubmitted ? 'completed' : 'incomplete',
      dueDate: 'Due before next consultation',
      lastUpdated: isSubmitted ? 'Today' : 'Draft in progress',
      actionLabel: isSubmitted ? 'Review Answers' : 'Complete Form'
    },
    {
      id: 'f_2',
      title: 'Asthma & Respiratory Questionnaire',
      description: 'Standard NHS ACT (Asthma Control Test) assessment',
      status: 'completed',
      dueDate: 'Completed for Dr. Sarah Jenkins',
      lastUpdated: '15 Sep 2026',
      actionLabel: 'View Record'
    },
    {
      id: 'f_3',
      title: 'Annual General Health Questionnaire',
      description: 'Lifestyle, cardiovascular assessment & general wellness check',
      status: 'not_started',
      dueDate: 'Due in 3 months',
      lastUpdated: 'Not started',
      actionLabel: 'Start Form'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Health Forms
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Digital questionnaires to help your GP provide the best clinical care
          </p>
        </div>

        {savedDraftNotice && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Progress Saved
          </span>
        )}
      </div>

      {!activeFormMode ? (
        /* Forms Overview List */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formsList.map((form) => {
              const isComp = form.status === 'completed';
              const isIncomp = form.status === 'incomplete';

              return (
                <div
                  key={form.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isComp
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isIncomp
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {isComp ? 'Completed ✓' : isIncomp ? 'Action Required' : 'Not Started'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{form.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {form.description}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      <span>{form.dueDate}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setActiveFormMode(true);
                    }}
                    className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      isIncomp
                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {form.actionLabel}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Interactive 6-Step Digital Intake Form */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Form Header with Step Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Step {currentStep} of {totalSteps}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {currentStep === 1 && 'Step 1 — Personal & Demographic Information'}
                {currentStep === 2 && 'Step 2 — Past Medical History & Conditions'}
                {currentStep === 3 && 'Step 3 — Current Medications & Supplements'}
                {currentStep === 4 && 'Step 4 — Known Allergies & Sensitivities'}
                {currentStep === 5 && 'Step 5 — Symptoms & Reason for Visit'}
                {currentStep === 6 && 'Step 6 — Review & Digital Consent'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                <Save className="w-3.5 h-3.5" /> Save Progress
              </button>
              <button
                type="button"
                onClick={() => setActiveFormMode(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Form Step Bodies */}
          <div className="space-y-4">
            {/* Step 1: Personal */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">NHS Number</label>
                  <input
                    type="text"
                    value={formData.nhsNumber}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600 font-mono font-medium cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Home Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Medical History */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">Select any medical conditions that apply to you:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'hasAsthma', label: 'Asthma or COPD' },
                    { key: 'hasHighBP', label: 'High Blood Pressure (Hypertension)' },
                    { key: 'hasDiabetes', label: 'Diabetes (Type 1 or Type 2)' },
                    { key: 'hasHeartDisease', label: 'Heart Disease or Angina' }
                  ].map((cond) => (
                    <label
                      key={cond.key}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        (formData as any)[cond.key]
                          ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={(formData as any)[cond.key]}
                        onChange={(e) => setFormData({ ...formData, [cond.key]: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-400"
                      />
                      <span className="text-xs">{cond.label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Past Surgeries or Hospital Admissions
                  </label>
                  <input
                    type="text"
                    value={formData.pastSurgeries}
                    onChange={(e) => setFormData({ ...formData, pastSurgeries: e.target.value })}
                    placeholder="e.g. Appendectomy in 2018, Knee arthroscopy..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Current Medications */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">
                  List any prescription, over-the-counter medications, or inhalers you currently take:
                </label>
                <textarea
                  rows={4}
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  placeholder="e.g. Salbutamol 100mcg inhaler (1 puff when needed), Multivitamins..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400">
                  Include herbal supplements and pain relievers taken within the last 30 days.
                </p>
              </div>
            )}

            {/* Step 4: Allergies */}
            {currentStep === 4 && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">
                  Known Drug, Food, or Environmental Allergies:
                </label>
                <textarea
                  rows={4}
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="e.g. Penicillin (skin rash), Latex, Peanuts..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Your allergy details are shared directly with your GP to prevent prescribing conflicts.</span>
                </div>
              </div>
            )}

            {/* Step 5: Symptoms */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    What is the primary reason for your consultation?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.primaryConcern}
                    onChange={(e) => setFormData({ ...formData, primaryConcern: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      How long have you had these symptoms?
                    </label>
                    <select
                      value={formData.symptomDuration}
                      onChange={(e) => setFormData({ ...formData, symptomDuration: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Less than 48 hours">Less than 48 hours</option>
                      <option value="1 week">1 week</option>
                      <option value="2 weeks">2 weeks</option>
                      <option value="1 month or more">1 month or more</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Current Pain / Discomfort Scale (1-10): <span className="font-bold text-blue-600">{formData.painScale}</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={formData.painScale}
                      onChange={(e) => setFormData({ ...formData, painScale: parseInt(e.target.value) })}
                      className="w-full accent-blue-600 mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review & Submit */}
            {currentStep === 6 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-900">Summary Review</h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                    <div>Patient: <strong className="text-slate-900">{formData.fullName}</strong></div>
                    <div>NHS: <strong className="text-slate-900 font-mono">{formData.nhsNumber}</strong></div>
                    <div>Primary Concern: <strong className="text-slate-900">{formData.primaryConcern}</strong></div>
                    <div>Allergies: <strong className="text-slate-900">{formData.allergies || 'None'}</strong></div>
                  </div>
                </div>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={formData.consentAccepted}
                    onChange={(e) => setFormData({ ...formData, consentAccepted: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-400"
                  />
                  <span className="text-[11px] text-slate-600 leading-relaxed">
                    I confirm that the information provided is accurate to the best of my knowledge and can be used by my clinical care team for my healthcare consultation.
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Form Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Save & Continue Later
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" /> Submit Health Form
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
