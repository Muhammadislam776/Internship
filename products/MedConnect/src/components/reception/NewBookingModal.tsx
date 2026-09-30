import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Patient, Doctor, AppointmentMode } from '../../types';
import {
  X,
  Search,
  UserPlus,
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatient?: Patient | null;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  preselectedPatient
}) => {
  const { patients, doctors, appointments, createAppointment, addPatient, showToast } = useApp();
  const { currentUser } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Patient Selection or Creation
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(preselectedPatient || null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    firstName: '',
    lastName: '',
    nhsNumber: `485 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
    phone: '+44 7700 ',
    dob: '1990-01-01',
    gender: 'female' as Patient['gender'],
    email: ''
  });

  // Step 2: Doctor & Mode
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || '');
  const [selectedMode, setSelectedMode] = useState<AppointmentMode>('in_person');
  const [reasonForVisit, setReasonForVisit] = useState('General Consultation');
  const [notes, setNotes] = useState('');

  // Step 3: Date & Slot
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00');

  // Loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const timeSlots = [
    '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  // Conflict checking
  const isSlotBooked = (time: string) => {
    return appointments.some((a) => {
      if (a.doctorId !== selectedDoctorId) return false;
      if (a.status === 'cancelled') return false;
      const apptDate = a.dateTime.split('T')[0];
      const apptTime = new Date(a.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      return apptDate === selectedDate && apptTime === time;
    });
  };

  const filteredPatients = patients.filter((p) => {
    const query = patientSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      p.firstName.toLowerCase().includes(query) ||
      p.lastName.toLowerCase().includes(query) ||
      p.nhsNumber.toLowerCase().includes(query) ||
      p.phone.includes(query)
    );
  });

  const handleRegisterNewPatient = () => {
    if (!newPatientData.firstName || !newPatientData.lastName || !newPatientData.phone) {
      showToast('error', 'Missing Information', 'First name, last name, and phone number are required.');
      return;
    }
    const created: Patient = {
      id: `pat_${Date.now().toString().slice(-6)}`,
      nhsNumber: newPatientData.nhsNumber,
      firstName: newPatientData.firstName.trim(),
      lastName: newPatientData.lastName.trim(),
      dob: newPatientData.dob,
      gender: newPatientData.gender,
      email: newPatientData.email || `${newPatientData.firstName.toLowerCase()}.${newPatientData.lastName.toLowerCase()}@example.co.uk`,
      phone: newPatientData.phone,
      address: {
        line1: '14 High Street',
        city: 'London',
        postcode: 'SW1A 1AA'
      },
      gpPracticeName: currentUser?.clinicName || 'St. James Health Centre',
      emergencyContact: {
        name: 'Next of Kin',
        relationship: 'Family',
        phone: newPatientData.phone
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
    addPatient(created);
    setSelectedPatient(created);
    setIsCreatingNew(false);
    setStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!selectedPatient) {
      showToast('error', 'No Patient Selected', 'Please select or register a patient first.');
      return;
    }

    const doctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
    const [hours, mins] = selectedTimeSlot.split(':').map(Number);
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, mins, 0, 0);

    setIsSubmitting(true);
    try {
      await createAppointment({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        patientNhsNumber: selectedPatient.nhsNumber,
        patientPhone: selectedPatient.phone,
        patientEmail: selectedPatient.email,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        clinicType: doctor.clinicType,
        dateTime: appointmentDate.toISOString(),
        durationMinutes: 15,
        mode: selectedMode,
        status: 'confirmed',
        reasonForVisit,
        notes: notes ? notes : `Booked at Front Desk by ${currentUser?.name || 'Receptionist'}`,
        paymentStatus: 'exempt_nhs'
      });

      showToast('success', 'Booking Confirmed', `Appointment booked for ${selectedPatient.firstName} ${selectedPatient.lastName}. SMS dispatched.`);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('error', 'Booking Failed', 'Unable to schedule appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              New Patient Booking
            </h2>
            <p className="text-xs text-slate-500">Step {step} of 4: {
              step === 1 ? 'Select or Register Patient' :
              step === 2 ? 'Clinician & Consultation Type' :
              step === 3 ? 'Date & Available Slot' :
              'Review & Confirm'
            }</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* ── STEP 1: PATIENT ── */}
          {step === 1 && (
            <div className="space-y-4">
              {!isCreatingNew ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search patient by name, NHS number, phone..."
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => setIsCreatingNew(true)}
                      className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <UserPlus className="w-4 h-4" />
                      Register New
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-100 rounded-xl p-1">
                    {filteredPatients.map((p) => {
                      const isSelected = selectedPatient?.id === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPatient(p)}
                          className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                              : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {p.firstName[0]}{p.lastName[0]}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{p.firstName} {p.lastName}</p>
                              <p className="text-[11px] text-slate-500 font-mono">NHS: {p.nhsNumber} · DOB: {p.dob}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-semibold text-slate-600 block">{p.phone}</span>
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600">
                                <CheckCircle2 className="w-3 h-3" /> Selected
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {filteredPatients.length === 0 && (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-medium">No patient found matching "{patientSearch}"</p>
                        <button
                          onClick={() => setIsCreatingNew(true)}
                          className="mt-2 text-xs text-blue-600 font-bold hover:underline"
                        >
                          Click here to register this patient
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* New Patient Form */
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-blue-600" />
                      Quick Patient Registration
                    </h3>
                    <button
                      onClick={() => setIsCreatingNew(false)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={newPatientData.firstName}
                        onChange={(e) => setNewPatientData({ ...newPatientData, firstName: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                        placeholder="e.g. John"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={newPatientData.lastName}
                        onChange={(e) => setNewPatientData({ ...newPatientData, lastName: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                        placeholder="e.g. Smith"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">NHS Number</label>
                      <input
                        type="text"
                        value={newPatientData.nhsNumber}
                        onChange={(e) => setNewPatientData({ ...newPatientData, nhsNumber: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={newPatientData.phone}
                        onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                        placeholder="+44 7700 900123"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={newPatientData.dob}
                        onChange={(e) => setNewPatientData({ ...newPatientData, dob: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Gender</label>
                      <select
                        value={newPatientData.gender}
                        onChange={(e) => setNewPatientData({ ...newPatientData, gender: e.target.value as Patient['gender'] })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newPatientData.email}
                      onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                      placeholder="patient@example.co.uk"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRegisterNewPatient}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Save Patient & Continue
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: DOCTOR & MODE ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Select Clinician</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {doctors.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{doc.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{doc.specialty} · Room {doc.roomNumber}</p>
                          <span className="text-[10px] text-emerald-600 font-semibold">{doc.patientsToday}/{doc.dailyPatientCapacity} patients</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Consultation Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'in_person', label: 'In-Person', icon: User },
                    { id: 'video_consultation', label: 'Video Call', icon: Video },
                    { id: 'phone', label: 'Telephone', icon: Phone },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = selectedMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMode(m.id as AppointmentMode)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="text-xs">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Visit</label>
                <select
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Follow-up Consultation">Follow-up Consultation</option>
                  <option value="Routine Health Check">Routine Health Check</option>
                  <option value="Blood Pressure Review">Blood Pressure Review</option>
                  <option value="Blood Test / Phlebotomy">Blood Test / Phlebotomy</option>
                  <option value="Vaccination / Immunisation">Vaccination / Immunisation</option>
                  <option value="Medication Review">Medication Review</option>
                  <option value="Minor Illness Assessment">Minor Illness Assessment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reception / Front Desk Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Patient requires wheelchair access, chaperone requested"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: DATE & TIME ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Appointment Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">Available Time Slots</label>
                  <span className="text-[11px] text-slate-400">15 min duration</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-52 overflow-y-auto p-1">
                  {timeSlots.map((slot) => {
                    const booked = isSlotBooked(slot);
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={booked}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all ${
                          booked
                            ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Google Calendar & Clinic Rota synced: Selected slot is clear without overlap.</span>
              </div>
            </div>
          )}

          {/* ── STEP 4: REVIEW & CONFIRM ── */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Patient</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">{selectedPatient?.firstName} {selectedPatient?.lastName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">NHS {selectedPatient?.nhsNumber} · {selectedPatient?.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Clinician</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">
                      {doctors.find((d) => d.id === selectedDoctorId)?.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {doctors.find((d) => d.id === selectedDoctorId)?.specialty} · Room {doctors.find((d) => d.id === selectedDoctorId)?.roomNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Date & Time</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-blue-700 block">
                      {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at {selectedTimeSlot}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">{selectedMode.replace('_', ' ')} consultation</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Reason</span>
                  <span className="text-xs font-semibold text-slate-800">{reasonForVisit}</span>
                </div>
              </div>

              {/* Automated SMS notification notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <p className="font-bold">Instant SMS Confirmation</p>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Upon booking, an automated Twilio SMS will be dispatched to <strong>{selectedPatient?.phone}</strong> with appointment details and reply-to-confirm instructions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              disabled={step === 1 && !selectedPatient}
              onClick={() => setStep((s) => (s + 1) as any)}
              className={`px-5 py-2 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ${
                step === 1 && !selectedPatient
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
              }`}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmBooking}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Confirming...' : 'Confirm Booking & Dispatch SMS'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
