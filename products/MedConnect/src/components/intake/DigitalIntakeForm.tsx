import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IntakeFormData } from '../../types';
import {
  FileCheck2,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User,
  Heart,
  Pill,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  PenTool,
  Building2,
  Key
} from 'lucide-react';

export const DigitalIntakeForm: React.FC<{ patientId?: string; onComplete?: () => void }> = ({
  patientId,
  onComplete
}) => {
  const { patients, submitIntakeForm, currentPatientId, showToast } = useApp();
  const activePatId = patientId || currentPatientId || 'pat_1';
  const patient = patients.find((p) => p.id === activePatId) || patients[0];

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [encryptedPayloadResult, setEncryptedPayloadResult] = useState<string | null>(null);

  // Form State
  const [symptoms, setSymptoms] = useState<string>('Shortness of breath and wheezing at night');
  const [symptomDuration, setSymptomDuration] = useState<string>('2-3 weeks');
  const [painLevel, setPainLevel] = useState<number>(3);
  const [painLocation, setPainLocation] = useState<string>('Chest / Respiratory');

  const [medicalHistory, setMedicalHistory] = useState({
    hasHighBloodPressure: false,
    hasDiabetes: false,
    hasAsthmaOrCopd: true,
    hasHeartDisease: false,
    hasBleedingDisorders: false,
    otherConditions: 'Childhood eczema'
  });

  const [lifestyle, setLifestyle] = useState({
    smokingStatus: 'never' as const,
    alcoholUnitsPerWeek: 4,
    activityLevel: 'moderate' as const
  });

  const [medications, setMedications] = useState([
    { name: 'Salbutamol 100mcg Inhaler', dosage: '2 puffs', frequency: 'As needed' }
  ]);
  const [allergiesList, setAllergiesList] = useState('Severe anaphylaxis to Penicillin V, Latex sensitivity');

  const [emergencyContact, setEmergencyContact] = useState({
    name: 'Clara Bennett',
    relationship: 'Spouse',
    phone: '+44 7700 900124'
  });

  const [digitalSignature, setDigitalSignature] = useState(`${patient.firstName} ${patient.lastName}`);
  const [consentDeclaration, setConsentDeclaration] = useState(true);

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
  };

  const handleMedChange = (index: number, field: string, value: string) => {
    const updated = [...medications];
    (updated[index] as any)[field] = value;
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentDeclaration) {
      showToast('error', 'Consent Required', 'Please confirm the GDPR declaration.');
      return;
    }

    setIsSubmitting(true);
    const payload: IntakeFormData = {
      patientId: patient.id,
      completedAt: new Date().toISOString(),
      symptoms: [symptoms],
      symptomDuration,
      painLevel,
      painLocation: [painLocation],
      medicalHistory,
      lifestyle,
      currentMedications: medications.filter((m) => m.name.trim() !== ''),
      allergiesList,
      emergencyContact,
      digitalSignature,
      consentDeclaration
    };

    try {
      const ciphertext = await submitIntakeForm(patient.id, payload);
      setEncryptedPayloadResult(ciphertext);
      if (onComplete) onComplete();
    } catch (err) {
      showToast('error', 'Submission Failed', 'Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden max-w-4xl mx-auto">
      {/* Top Banner with AES-256 Vault Status */}
      <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Pre-Arrival Digital Medical Intake</h3>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                AES-256-CBC Encrypted
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Patient: <strong className="text-slate-800">{patient.firstName} {patient.lastName}</strong> (NHS: {patient.nhsNumber})
            </p>
          </div>
        </div>

        {/* Multi-Step Indicator */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-blue-600'
                  : s < step
                  ? 'w-4 bg-emerald-500'
                  : 'w-4 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8">
        {encryptedPayloadResult ? (
          <div className="p-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Intake Form Encrypted & Stored in Supabase Vault</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your Personal Health Information (PHI) has been encrypted client-side using AES-256 before transit. Only your authorized clinician can decrypt this record under Supabase RLS.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1 text-blue-700 font-semibold">
                  <Key className="w-3.5 h-3.5" /> Raw AES-256 Ciphertext:
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">HMAC Verified</span>
              </div>
              <p className="text-[11px] font-mono text-slate-600 break-all bg-white p-2.5 rounded-xl border border-slate-200">
                {encryptedPayloadResult}
              </p>
            </div>

            <button
              onClick={() => setEncryptedPayloadResult(null)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Submit Another Update
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Chief Complaints & Pain */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                  <span>Step 1: Current Symptoms & Chief Complaint</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    What is the main reason for your visit today?
                  </label>
                  <textarea
                    rows={3}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    placeholder="Describe your symptoms in detail..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      How long have you had these symptoms?
                    </label>
                    <input
                      type="text"
                      value={symptomDuration}
                      onChange={(e) => setSymptomDuration(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                      placeholder="e.g. 2 weeks"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Pain Score: <strong className="text-blue-600 font-bold">{painLevel} / 10</strong>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={painLevel}
                      onChange={(e) => setPainLevel(parseInt(e.target.value))}
                      className="w-full accent-blue-600 mt-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Area of Discomfort / Location
                  </label>
                  <input
                    type="text"
                    value={painLocation}
                    onChange={(e) => setPainLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    placeholder="e.g. Lower back, right shoulder, chest"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Past Medical History & Lifestyle */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                  <span>Step 2: Medical History & Lifestyle</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Have you ever been diagnosed with any of the following? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { key: 'hasAsthmaOrCopd', label: 'Asthma / COPD / Respiratory' },
                      { key: 'hasHighBloodPressure', label: 'High Blood Pressure (Hypertension)' },
                      { key: 'hasDiabetes', label: 'Diabetes (Type 1 or Type 2)' },
                      { key: 'hasHeartDisease', label: 'Heart Disease / Angina / Arrhythmia' },
                      { key: 'hasBleedingDisorders', label: 'Bleeding Disorders / Blood Thinners' },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          (medicalHistory as any)[item.key]
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={(medicalHistory as any)[item.key]}
                          onChange={(e) =>
                            setMedicalHistory({ ...medicalHistory, [item.key]: e.target.checked })
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xs">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Other Medical Conditions / Past Surgeries
                  </label>
                  <input
                    type="text"
                    value={medicalHistory.otherConditions}
                    onChange={(e) => setMedicalHistory({ ...medicalHistory, otherConditions: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    placeholder="List any other relevant medical history..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Current Medications & Allergies */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                  <span>Step 3: Current Medications & Known Allergies</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Known Drug Allergies & Adverse Reactions
                  </label>
                  <input
                    type="text"
                    value={allergiesList}
                    onChange={(e) => setAllergiesList(e.target.value)}
                    className="w-full bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-xs text-rose-900 font-medium focus:outline-none"
                    placeholder="e.g. Penicillin, Aspirin, Latex (or None)"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700">Current Medications</label>
                    <button
                      type="button"
                      onClick={handleAddMedication}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                    >
                      + Add Medication
                    </button>
                  </div>

                  <div className="space-y-2">
                    {medications.map((med, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Medication Name"
                          value={med.name}
                          onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                          className="bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-900 focus:bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g. 50mg)"
                          value={med.dosage}
                          onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                          className="bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-900 focus:bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Frequency (e.g. Once daily)"
                          value={med.frequency}
                          onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                          className="bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-900 focus:bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Emergency Contact & GDPR Consent */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                  <span>Step 4: Emergency Contact & Digital Consent</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={emergencyContact.name}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={emergencyContact.relationship}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, relationship: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={emergencyContact.phone}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Digital Signature</label>
                  <input
                    type="text"
                    value={digitalSignature}
                    onChange={(e) => setDigitalSignature(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-serif italic"
                    required
                  />
                </div>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentDeclaration}
                    onChange={(e) => setConsentDeclaration(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                    required
                  />
                  <span>
                    I confirm that the clinical information provided is accurate to the best of my knowledge. I consent to having this data encrypted using AES-256 and shared with my attending healthcare practitioner under UK GDPR & NHS Caldicott principles.
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Encrypting & Saving...' : 'Encrypt & Submit to Vault'}</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
