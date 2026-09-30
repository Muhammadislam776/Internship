import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Patient } from '../../types';
import {
  X,
  UserCheck,
  AlertTriangle,
  Clock,
  User,
  Plus
} from 'lucide-react';

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalkInModal: React.FC<WalkInModalProps> = ({ isOpen, onClose }) => {
  const { doctors, patients, createAppointment, addPatient, showToast } = useApp();
  const { currentUser } = useAuth();

  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('+44 7700 ');
  const [nhsNumber, setNhsNumber] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [reason, setReason] = useState('Acute Minor Ailment');
  const [priority, setPriority] = useState<'routine' | 'urgent'>('routine');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      showToast('error', 'Name Required', 'Please enter patient name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const nameParts = patientName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'Walk-in';
      const assignedNhs = nhsNumber.trim() || `485 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`;

      // Find or create patient
      let existing = patients.find(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase() === patientName.toLowerCase() ||
          (p.phone && p.phone === phone)
      );

      let patientId = existing?.id;

      if (!existing) {
        const newPat: Patient = {
          id: `pat_walkin_${Date.now().toString().slice(-5)}`,
          nhsNumber: assignedNhs,
          firstName,
          lastName,
          dob: '1990-01-01',
          gender: 'undisclosed',
          email: `${firstName.toLowerCase()}@walkin-patient.nhs.uk`,
          phone: phone.trim() || '+44 7700 900000',
          address: { line1: 'Walk-in arrival', city: 'London', postcode: 'SW1' },
          emergencyContact: {
            name: 'Next of Kin',
            relationship: 'Family',
            phone: phone.trim() || '+44 7700 900000'
          },
          allergies: [],
          medicalConditions: [],
          activePrescriptionsCount: 0,
          intakeFormCompleted: false,
          historicalNoShows: 0,
          historicalTotalBookings: 1,
          gdprConsent: {
            marketingConsent: false,
            smsNotificationConsent: true,
            dataSharingConsent: true,
            consentTimestamp: new Date().toISOString()
          },
          createdAt: new Date().toISOString()
        };
        addPatient(newPat);
        patientId = newPat.id;
      }

      const doctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

      await createAppointment({
        patientId: patientId!,
        patientName: patientName.trim(),
        patientNhsNumber: assignedNhs,
        patientPhone: phone.trim(),
        patientEmail: existing?.email || `${firstName.toLowerCase()}@walkin-patient.nhs.uk`,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        clinicType: doctor.clinicType,
        dateTime: new Date().toISOString(),
        durationMinutes: 15,
        mode: 'in_person',
        status: 'in_progress', // immediately placed in waiting room / checked in
        reasonForVisit: `[WALK-IN ${priority.toUpperCase()}] ${reason}`,
        notes: `Walk-in registered by ${currentUser?.name || 'Reception'}. Priority: ${priority.toUpperCase()}`,
        paymentStatus: 'exempt_nhs'
      });

      showToast('success', 'Walk-In Checked In', `${patientName} added to today's queue and waiting room.`);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('error', 'Registration Failed', 'Could not record walk-in patient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Walk-in Patient Check-in</h2>
              <p className="text-[11px] text-slate-500">Rapid intake directly to waiting room queue</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Patient Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. David Clarke"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">NHS Number (if known)</label>
              <input
                type="text"
                value={nhsNumber}
                onChange={(e) => setNhsNumber(e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Clinician</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Triage Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'routine' | 'urgent')}
                className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none ${
                  priority === 'urgent'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="routine">Routine Walk-in</option>
                <option value="urgent">Urgent / Priority Triage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Presenting Issue / Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Acute cough, twisted ankle, repeat prescription"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {priority === 'urgent' && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Flagged as urgent triage. Clinician will receive an immediate desk alert.</span>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              {isSubmitting ? 'Checking in...' : 'Check In to Waiting Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
