import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClinicType, AppointmentMode } from '../../types';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Stethoscope,
  Activity,
  HeartPulse,
  Brain,
  ArrowRight,
  ShieldCheck,
  Send,
  Building2,
  Clock
} from 'lucide-react';

interface TriageResult {
  category: 'emergency_999' | 'urgent_sameday' | 'routine_gp' | 'dental_specialist' | 'physio_msk' | 'self_care';
  urgencyLabel: string;
  recommendedSpecialty: ClinicType;
  recommendedDoctorName: string;
  recommendedDoctorId: string;
  recommendedMode: AppointmentMode;
  suggestedDuration: number;
  clinicalReasoning: string;
  redFlagsDetected: string[];
}

export const AiTriageAssistant: React.FC = () => {
  const { doctors, patients, createAppointment, setActiveTab, showToast } = useApp();

  const [inputSymptom, setInputSymptom] = useState('');
  const [patientAge, setPatientAge] = useState<number>(37);
  const [hasSeverePain, setHasSeverePain] = useState<boolean>(false);
  const [hasDifficultyBreathing, setHasDifficultyBreathing] = useState<boolean>(false);
  const [symptomDuration, setSymptomDuration] = useState<string>('3 days');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  const sampleQueries = [
    { label: 'Chest Tightness & Asthma Wheezing', text: 'Persistent wheezing at night, waking up coughing, blue inhaler not relieving.' },
    { label: 'Severe Toothache & Facial Swelling', text: 'Throbbing wisdom tooth pain radiating to jaw with mild fever and gum swelling.' },
    { label: 'Knee Twist & Joint Locking', text: 'Popping sensation in right knee during football match, cannot bear full weight.' },
    { label: 'Crushing Chest Pain & Left Arm Numbness', text: 'Sudden severe central crushing chest pressure spreading to jaw and left arm.' }
  ];

  const handleRunTriage = async (symptomText?: string) => {
    const text = (symptomText || inputSymptom).toLowerCase();
    if (!text.trim()) return;

    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 600));

    let result: TriageResult;

    // 1. Emergency Red Flag Detection
    if (text.includes('chest') && (text.includes('crushing') || text.includes('arm') || text.includes('sweat') || text.includes('collapse'))) {
      result = {
        category: 'emergency_999',
        urgencyLabel: 'CRITICAL EMERGENCY (CATEGORY 1)',
        recommendedSpecialty: 'gp_practice',
        recommendedDoctorName: 'Dr. Sarah Jenkins / A&E Emergency',
        recommendedDoctorId: 'doc_1',
        recommendedMode: 'in_person',
        suggestedDuration: 15,
        clinicalReasoning: 'Suspected Acute Coronary Syndrome / Myocardial Infarction. Immediate 999 emergency transfer required.',
        redFlagsDetected: ['Crushing chest pressure', 'Radiation to left arm/jaw', 'High cardiac risk']
      };
    }
    // 2. Dental triage
    else if (text.includes('tooth') || text.includes('dental') || text.includes('gum') || text.includes('jaw') || text.includes('cavity') || text.includes('swelling')) {
      result = {
        category: 'dental_specialist',
        urgencyLabel: 'URGENT DENTAL TRIAGE (SAME-DAY)',
        recommendedSpecialty: 'dental',
        recommendedDoctorName: 'Dr. Marcus Vance (Specialist Orthodontist & Dentist)',
        recommendedDoctorId: 'doc_2',
        recommendedMode: 'in_person',
        suggestedDuration: 30,
        clinicalReasoning: 'Localized odontogenic infection / periodontal inflammation. Prompt clinical evaluation recommended.',
        redFlagsDetected: text.includes('fever') ? ['Systemic fever indicator', 'Spreading facial cellulitis risk'] : []
      };
    }
    // 3. Physio MSK
    else if (text.includes('knee') || text.includes('shoulder') || text.includes('back') || text.includes('joint') || text.includes('acl') || text.includes('muscle') || text.includes('sprain') || text.includes('football')) {
      result = {
        category: 'physio_msk',
        urgencyLabel: 'MSK PHYSIOTHERAPY ASSESSMENT',
        recommendedSpecialty: 'physiotherapy',
        recommendedDoctorName: 'Aisha Patel, MCSP (Lead MSK Physiotherapist)',
        recommendedDoctorId: 'doc_3',
        recommendedMode: 'in_person',
        suggestedDuration: 45,
        clinicalReasoning: 'Suspected soft-tissue ligamentous strain / meniscal lesion. Requires manual orthopedic testing and rehab plan.',
        redFlagsDetected: text.includes('cannot bear weight') ? ['Inability to bear weight (>4 steps)', 'Potential ligamentous tear'] : []
      };
    }
    // 4. Routine GP / Telehealth
    else {
      result = {
        category: 'routine_gp',
        urgencyLabel: 'PRIMARY CARE GP CONSULTATION',
        recommendedSpecialty: 'gp_practice',
        recommendedDoctorName: 'Dr. Sarah Jenkins (Senior GP Partner)',
        recommendedDoctorId: 'doc_1',
        recommendedMode: 'video_consultation',
        suggestedDuration: 15,
        clinicalReasoning: 'Sub-acute respiratory or general practice presentation. Ideal for primary care evaluation via HD Telehealth Video Room.',
        redFlagsDetected: []
      };
    }

    setTriageResult(result);
    setIsAnalyzing(false);
  };

  const handleInstantBook = async () => {
    if (!triageResult) return;
    const patient = patients[0];
    const doctor = doctors.find((d) => d.id === triageResult.recommendedDoctorId) || doctors[0];

    const todayAt10 = new Date();
    todayAt10.setHours(10, 30, 0, 0);

    await createAppointment({
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientNhsNumber: patient.nhsNumber,
      patientPhone: patient.phone,
      patientEmail: patient.email,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      clinicType: triageResult.recommendedSpecialty,
      dateTime: todayAt10.toISOString(),
      durationMinutes: triageResult.suggestedDuration,
      mode: triageResult.recommendedMode,
      status: 'scheduled',
      reasonForVisit: `AI Triage: ${inputSymptom || 'Clinical review'}`,
      paymentStatus: 'exempt_nhs'
    });

    setActiveTab('scheduler');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">NHS 111 AI Clinical Triage Assistant</h2>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                Evidence-Based Protocol
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluates red flag clinical symptoms, suggests specialty routing, and sets optimal consultation duration.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Symptom Input & Assessment Panel */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Describe Patient Symptoms or Primary Complaint
            </label>
            <textarea
              rows={3}
              value={inputSymptom}
              onChange={(e) => setInputSymptom(e.target.value)}
              placeholder="e.g. Sharp pain in lower right jaw for 3 days with mild swelling..."
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Preset Clinical Scenarios */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Test Clinical Scenarios:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputSymptom(q.text);
                    handleRunTriage(q.text);
                  }}
                  className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 font-medium transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleRunTriage()}
            disabled={isAnalyzing || !inputSymptom.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAnalyzing ? 'Analyzing Clinical Indicators...' : 'Run NHS 111 Triage Assessment'}</span>
          </button>
        </div>

        {/* Right Column: Triage Result Card */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          {triageResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">{triageResult.urgencyLabel}</h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    triageResult.category === 'emergency_999'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {triageResult.category.replace('_', ' ')}
                </span>
              </div>

              {/* Red flags */}
              {triageResult.redFlagsDetected.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Red Flag Warning Symptoms Detected</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {triageResult.redFlagsDetected.map((rf, i) => (
                      <li key={i}>{rf}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Clinical Reasoning</span>
                <p className="text-slate-800 font-medium leading-relaxed">{triageResult.clinicalReasoning}</p>

                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Recommended Clinician</span>
                    <span className="font-semibold">{triageResult.recommendedDoctorName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Optimal Mode & Duration</span>
                    <span className="font-semibold">{triageResult.recommendedMode.replace('_', ' ')} ({triageResult.suggestedDuration}m)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleInstantBook}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>1-Click Instant Schedule with Recommended Clinician</span>
              </button>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 my-auto">
              <Brain className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-slate-700">Awaiting Clinical Symptoms</h4>
              <p className="text-xs text-slate-500 mt-1">Enter patient symptoms on the left to run triage analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
