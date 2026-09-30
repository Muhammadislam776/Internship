import React, { useState } from 'react';
import { Patient } from '../../types';
import {
  ClipboardList,
  Calendar,
  Pill,
  FileText,
  Download,
  ShieldCheck,
  ChevronRight,
  Filter,
  CheckCircle2,
  Lock,
  Stethoscope
} from 'lucide-react';

interface MyMedicalRecordsProps {
  patient: Patient;
}

export const MyMedicalRecords: React.FC<MyMedicalRecordsProps> = ({ patient }) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'consultations' | 'prescriptions' | 'documents'>('all');

  const timelineRecords = [
    {
      id: 'rec_1',
      date: '30 Sep 2026',
      title: 'GP Video Consultation',
      clinician: 'Dr. Sarah Jenkins, Senior GP Partner',
      category: 'consultations',
      summary: 'Review of seasonal asthma symptoms, chest clear on auscultation, stepped inhaler instructions provided.',
      badge: 'Consultation Note'
    },
    {
      id: 'rec_2',
      date: '15 Sep 2026',
      title: 'Repeat Prescription Issued (NHS EPS R2)',
      clinician: 'Dr. Sarah Jenkins',
      category: 'prescriptions',
      summary: 'Salbutamol 100mcg CFC-Free Inhaler (1 unit, 30 days supply). Dispensed to Boots Pharmacy Piccadilly.',
      badge: 'Prescription'
    },
    {
      id: 'rec_3',
      date: '12 Aug 2026',
      title: 'NHS Clinical Blood Panel & Glucose Test',
      clinician: 'St. James Pathology Laboratory',
      category: 'documents',
      summary: 'HbA1c: 38 mmol/mol (Normal). Full blood count and kidney function within normal reference ranges.',
      badge: 'Diagnostic Report'
    },
    {
      id: 'rec_4',
      date: '10 Jun 2026',
      title: 'Annual Cardiovascular & Wellness Review',
      clinician: 'Dr. James Thorne',
      category: 'consultations',
      summary: 'Routine preventative check. Blood pressure: 118/78 mmHg. Pulse: 68 bpm. QRISK3 10-year score: 2.1% (Low risk).',
      badge: 'Annual Health Check'
    }
  ];

  const filtered = filterCategory === 'all'
    ? timelineRecords
    : timelineRecords.filter((r) => r.category === filterCategory);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Medical Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified timeline of consultations, prescriptions, and NHS documents
          </p>
        </div>

        <button
          onClick={() => alert('Downloading official NHS Patient Health Summary record (PDF)...')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" /> Download Health Summary (PDF)
        </button>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Protected Clinical Data</p>
            <p className="text-[11px] text-slate-500">
              Only you and your registered GP care team have access to these clinical notes.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-600 font-semibold bg-white border border-slate-200 px-3 py-1 rounded-lg">
          NHS: {patient.nhsNumber}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        {[
          { id: 'all', label: 'All Records' },
          { id: 'consultations', label: 'Consultations' },
          { id: 'prescriptions', label: 'Prescriptions' },
          { id: 'documents', label: 'Lab & Diagnostic Reports' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCategory(c.id as any)}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              filterCategory === c.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {filtered.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline bullet dot */}
            <div className="absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-600 shadow-xs" />

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-blue-200 transition-all space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-blue-600">{item.date}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {item.badge}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-[11px] text-slate-500">{item.clinician}</p>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed pt-1 border-t border-slate-100">
                {item.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
