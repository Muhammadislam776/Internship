import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  ClinicType,
  Appointment,
  Patient,
  Doctor,
  PrescriptionRefillRequest,
  RotaShift,
  DoctorPerformanceMetric,
  AuditLogEntry,
  TwilioLog,
  IntakeFormData
} from '../types';
import {
  MOCK_DOCTORS,
  MOCK_PATIENTS,
  MOCK_APPOINTMENTS,
  MOCK_REFILL_REQUESTS,
  MOCK_ROTA_SHIFTS,
  MOCK_PERFORMANCE_METRICS,
  MOCK_AUDIT_LOGS,
  MOCK_TWILIO_LOGS,
  MOCK_INTAKE_PAYLOADS
} from '../data/mockData';
import { encryptPHI, decryptPHI, anonymizePatientRecord } from '../lib/crypto';
import { predictNoShowRisk } from '../lib/mlPredictor';
import { TwilioService } from '../lib/twilioSimulator';
import { GoogleCalendarService } from '../lib/googleCalendar';
import { useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description: string;
  timestamp: string;
}

interface AppContextType {
  // Roles & View Selection
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedClinicType: ClinicType | 'all';
  setSelectedClinicType: (type: ClinicType | 'all') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Data Stores
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  refillRequests: PrescriptionRefillRequest[];
  rotaShifts: RotaShift[];
  performanceMetrics: DoctorPerformanceMetric[];
  auditLogs: AuditLogEntry[];
  twilioLogs: TwilioLog[];
  intakePayloads: Record<string, string>;

  // Selected entities & session
  currentPatientId: string;
  setCurrentPatientId: (id: string) => void;
  currentDoctorId: string;
  setCurrentDoctorId: (id: string) => void;
  activeTelehealthAppointment: Appointment | null;
  setActiveTelehealthAppointment: (apt: Appointment | null) => void;

  // Actions
  createAppointment: (newAppt: Omit<Appointment, 'id' | 'mlPrediction' | 'twilioRemindersSent'>) => Promise<Appointment>;
  updateAppointmentStatus: (appointmentId: string, newStatus: Appointment['status']) => void;
  runMlPredictionForAppointment: (appointmentId: string) => void;
  triggerTwilioReminder: (appointmentId: string, reminderType?: 'standard_reminder' | 'urgent_confirmation' | 'telehealth_link') => Promise<void>;
  simulatePatientSmsReply: (logId: string, replyText: string) => void;
  
  // Patient & Front Desk Management
  addPatient: (patient: Patient) => void;
  rescheduleAppointment: (appointmentId: string, newDateTime: string, reason?: string) => Promise<void>;
  cancelAppointment: (appointmentId: string, reason?: string) => Promise<void>;

  // Intake form
  submitIntakeForm: (patientId: string, formData: IntakeFormData) => Promise<string>;
  getDecryptedIntakeForm: (patientId: string) => { data: IntakeFormData | null; error?: string };
  
  // Prescriptions
  approvePrescription: (refillId: string, doctorSignature?: string) => void;
  rejectPrescription: (refillId: string, reason: string) => void;
  createRefillRequest: (req: Omit<PrescriptionRefillRequest, 'id' | 'status' | 'requestedDate'>) => void;

  // GDPR & Compliance
  requestGdprAnonymization: (patientId: string) => void;
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  
  // Rota
  addRotaShift: (shift: Omit<RotaShift, 'id' | 'bookedPatientsCount'>) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, description: string) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('doctor');
  const [selectedClinicType, setSelectedClinicType] = useState<ClinicType | 'all'>('all');
  const [activeTab, setActiveTab] = useState<string>('schedule');

  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [refillRequests, setRefillRequests] = useState<PrescriptionRefillRequest[]>(MOCK_REFILL_REQUESTS);
  const [rotaShifts, setRotaShifts] = useState<RotaShift[]>(MOCK_ROTA_SHIFTS);
  const [performanceMetrics] = useState<DoctorPerformanceMetric[]>(MOCK_PERFORMANCE_METRICS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [twilioLogs, setTwilioLogs] = useState<TwilioLog[]>(MOCK_TWILIO_LOGS);
  const [intakePayloads, setIntakePayloads] = useState<Record<string, string>>(MOCK_INTAKE_PAYLOADS);

  const [currentPatientId, setCurrentPatientId] = useState<string>('pat_1');
  const [currentDoctorId, setCurrentDoctorId] = useState<string>('doc_1');
  const [activeTelehealthAppointment, setActiveTelehealthAppointment] = useState<Appointment | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const { currentUser } = useAuth();

  // Auto-synchronize authenticated patient identity and records
  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === 'patient') {
      const existing = patients.find(
        (p) => p.id === currentUser.id || (currentUser.email && p.email?.toLowerCase() === currentUser.email.toLowerCase())
      );

      if (existing) {
        if (currentPatientId !== existing.id) {
          setCurrentPatientId(existing.id);
        }
      } else {
        const nameParts = (currentUser.name || 'Patient User').trim().split(' ');
        const firstName = nameParts[0] || 'Patient';
        const lastName = nameParts.slice(1).join(' ') || '';

        const newPatient: Patient = {
          id: currentUser.id,
          nhsNumber: currentUser.nhsNumber || '485 772 9012',
          firstName,
          lastName,
          dob: '1992-06-15',
          gender: 'male',
          email: currentUser.email,
          phone: '+44 7700 900555',
          address: {
            line1: '12 St. James Square',
            city: 'London',
            postcode: 'SW1Y 4LE'
          },
          gpPracticeName: currentUser.clinicName || 'St. James Health Centre',
          emergencyContact: {
            name: 'Sarah Jutt',
            relationship: 'Next of Kin',
            phone: '+44 7700 900556'
          },
          allergies: ['Penicillin V'],
          medicalConditions: ['Seasonal Asthma'],
          activePrescriptionsCount: 1,
          intakeFormCompleted: false,
          historicalNoShows: 0,
          historicalTotalBookings: 2,
          gdprConsent: {
            marketingConsent: false,
            smsNotificationConsent: true,
            dataSharingConsent: true,
            consentTimestamp: new Date().toISOString()
          },
          createdAt: new Date().toISOString()
        };

        setPatients((prev) => [newPatient, ...prev]);
        setCurrentPatientId(currentUser.id);

        // Seed appointments for this patient if none exist
        setAppointments((prev) => {
          const hasAppt = prev.some((a) => a.patientId === currentUser.id);
          if (!hasAppt) {
            const nextDate = new Date();
            nextDate.setHours(10, 30, 0, 0);
            if (nextDate.getTime() < Date.now()) {
              nextDate.setDate(nextDate.getDate() + 1);
            }

            const personalAppt: Appointment = {
              id: `apt_pat_${Date.now().toString().slice(-4)}`,
              patientId: currentUser.id,
              patientName: currentUser.name,
              patientNhsNumber: newPatient.nhsNumber,
              patientPhone: newPatient.phone,
              patientEmail: currentUser.email,
              doctorId: 'doc_1',
              doctorName: 'Dr. Sarah Jenkins',
              doctorSpecialty: 'General Practitioner',
              clinicType: 'gp_practice',
              dateTime: nextDate.toISOString(),
              durationMinutes: 15,
              mode: 'video_consultation',
              status: 'confirmed',
              reasonForVisit: 'General Consultation & Health Review',
              paymentStatus: 'exempt_nhs',
              mlPrediction: {
                noShowProbability: 5,
                riskLevel: 'low',
                confidenceScore: 0.95,
                keyFactors: [],
                recommendedAction: 'Standard 24h reminder',
                smsStrategy: 'standard_24h'
              },
              twilioRemindersSent: []
            };

            const followUpDate = new Date();
            followUpDate.setDate(followUpDate.getDate() + 8);
            followUpDate.setHours(14, 0, 0, 0);
            const inPersonAppt: Appointment = {
              id: `apt_pat_${Date.now().toString().slice(-4)}_2`,
              patientId: currentUser.id,
              patientName: currentUser.name,
              patientNhsNumber: newPatient.nhsNumber,
              patientPhone: newPatient.phone,
              patientEmail: currentUser.email,
              doctorId: 'doc_4',
              doctorName: 'Dr. James Thorne',
              doctorSpecialty: 'General Practitioner',
              clinicType: 'gp_practice',
              dateTime: followUpDate.toISOString(),
              durationMinutes: 20,
              mode: 'in_person',
              status: 'confirmed',
              paymentStatus: 'exempt_nhs',
              reasonForVisit: 'Routine Blood Pressure & Health Check',
              mlPrediction: {
                noShowProbability: 8,
                riskLevel: 'low',
                confidenceScore: 0.92,
                keyFactors: [],
                recommendedAction: 'Standard 24h reminder',
                smsStrategy: 'standard_24h'
              },
              twilioRemindersSent: []
            };

            return [personalAppt, inPersonAppt, ...prev];
          }
          return prev;
        });

        // Seed active prescription for this patient
        setRefillRequests((prev) => {
          const hasRefill = prev.some((r) => r.patientId === currentUser.id);
          if (!hasRefill) {
            const rx: PrescriptionRefillRequest = {
              id: `ref_pat_${Date.now().toString().slice(-4)}`,
              patientId: currentUser.id,
              patientName: currentUser.name,
              patientNhsNumber: newPatient.nhsNumber,
              doctorId: 'doc_1',
              doctorName: 'Dr. Sarah Jenkins',
              medicationName: 'Salbutamol 100mcg Inhaler',
              dosage: '100mcg',
              quantity: '1 inhaler (200 doses)',
              frequency: '1-2 puffs as required for wheezing',
              lastIssuedDate: '2026-09-01T10:00:00Z',
              reasonForRequest: 'Repeat maintenance for asthma symptom relief',
              preferredPharmacy: {
                name: 'Boots Pharmacy - Piccadilly Branch',
                odsCode: 'FC102',
                address: 'Piccadilly, London W1J 9LL',
                electronicPrescriptionService: true
              },
              requestedDate: new Date().toISOString(),
              status: 'approved',
              doctorSignature: 'GMC 7489201 - Dr. Sarah Jenkins (NHS EPS R2)'
            };
            return [rx, ...prev];
          }
          return prev;
        });
      }
    }
  }, [currentUser]);

  const showToast = (type: ToastMessage['type'], title: string, description: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, description, timestamp: new Date().toLocaleTimeString() }]);
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const createAppointment = async (newApptData: Omit<Appointment, 'id' | 'mlPrediction' | 'twilioRemindersSent'>): Promise<Appointment> => {
    const patient = patients.find(p => p.id === newApptData.patientId) || patients[0];
    const doctor = doctors.find(d => d.id === newApptData.doctorId) || doctors[0];
    const apptDate = new Date(newApptData.dateTime);
    const now = new Date();
    const leadTimeDays = Math.max(0, Math.round((apptDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate patient age
    const birthYear = parseInt(patient.dob.split('-')[0]) || 1990;
    const patientAge = 2026 - birthYear;

    const mlPrediction = predictNoShowRisk({
      leadTimeDays,
      patientAge,
      historicalNoShows: patient.historicalNoShows,
      historicalTotalBookings: patient.historicalTotalBookings,
      dayOfWeek: apptDate.getDay(),
      hourOfDay: apptDate.getHours(),
      appointmentMode: newApptData.mode,
      clinicType: newApptData.clinicType,
      smsConfirmed: false,
      depositPaid: newApptData.paymentStatus === 'paid' || newApptData.paymentStatus === 'deposit_paid'
    });

    const apptId = `apt_${Date.now().toString().slice(-6)}`;
    const meetingRoomId = newApptData.mode === 'video_consultation' ? `telehealth-${apptId}-${doctor.id}` : undefined;

    // Google Calendar 2-Way Event Creation
    const gcalEvent = await GoogleCalendarService.createCalendarEvent({
      ...newApptData,
      id: apptId,
      mlPrediction,
      twilioRemindersSent: [],
      meetingRoomId
    }, doctor);

    const createdAppointment: Appointment = {
      ...newApptData,
      id: apptId,
      meetingRoomId,
      mlPrediction,
      googleCalendarEventId: gcalEvent.id,
      twilioRemindersSent: []
    };

    setAppointments((prev) => [createdAppointment, ...prev]);

    // Dispatch automated confirmation SMS via Twilio Simulator
    const { log } = await TwilioService.dispatchSms({
      toPhone: patient.phone,
      patientName: patient.firstName,
      appointmentId: apptId,
      appointmentTime: apptDate.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
      doctorName: doctor.name,
      clinicName: doctor.clinicType === 'gp_practice' ? 'St. James GP' : doctor.clinicType === 'dental' ? 'Mayfair Smiles' : 'Kensington Physio',
      type: newApptData.mode === 'video_consultation' ? 'telehealth_link' : 'standard_reminder',
      telehealthUrl: meetingRoomId ? `https://medconnect.uk/telehealth/${apptId}` : undefined
    });

    setTwilioLogs((prev) => [log, ...prev]);
    
    // Update appointment reminder list
    createdAppointment.twilioRemindersSent.push({
      timestamp: log.timestamp,
      type: 'sms',
      status: 'delivered',
      messageBody: log.message
    });

    addAuditLog({
      userId: currentDoctorId || 'system',
      userRole: currentRole,
      userName: currentRole === 'doctor' ? doctor.name : 'MedConnect Reception Engine',
      action: 'APPOINTMENT_CREATED',
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      resourceId: apptId,
      ipAddress: '194.74.120.45 (NHS Spine Gateway)',
      status: 'SUCCESS',
      complianceStandard: 'UK_GDPR_ART32',
      details: `Scheduled ${newApptData.mode} booking. Google Calendar ID ${gcalEvent.id} created. ML No-Show Risk: ${mlPrediction.noShowProbability}% (${mlPrediction.riskLevel}).`
    });

    showToast('success', 'Appointment Scheduled & Google Calendar Synced', `Automated Twilio SMS sent to ${patient.phone}. ML Risk: ${mlPrediction.noShowProbability}%`);
    return createdAppointment;
  };

  const updateAppointmentStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === appointmentId ? { ...app, status: newStatus } : app))
    );
    showToast('info', 'Status Updated', `Appointment ${appointmentId} marked as ${newStatus.toUpperCase()}`);
  };

  const runMlPredictionForAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id !== appointmentId) return app;
        const patient = patients.find(p => p.id === app.patientId) || patients[0];
        const apptDate = new Date(app.dateTime);
        const leadTimeDays = Math.max(0, Math.round((apptDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        const birthYear = parseInt(patient.dob.split('-')[0]) || 1990;

        const updatedPrediction = predictNoShowRisk({
          leadTimeDays,
          patientAge: 2026 - birthYear,
          historicalNoShows: patient.historicalNoShows,
          historicalTotalBookings: patient.historicalTotalBookings,
          dayOfWeek: apptDate.getDay(),
          hourOfDay: apptDate.getHours(),
          appointmentMode: app.mode,
          clinicType: app.clinicType,
          smsConfirmed: app.status === 'confirmed',
          depositPaid: app.paymentStatus === 'paid' || app.paymentStatus === 'deposit_paid'
        });

        return { ...app, mlPrediction: updatedPrediction };
      })
    );
    showToast('info', 'ML Model Re-evaluated', `No-Show risk score updated based on latest patient interaction telemetry.`);
  };

  const triggerTwilioReminder = async (appointmentId: string, reminderType: 'standard_reminder' | 'urgent_confirmation' | 'telehealth_link' = 'standard_reminder') => {
    const appt = appointments.find(a => a.id === appointmentId);
    if (!appt) return;
    const patient = patients.find(p => p.id === appt.patientId) || patients[0];
    const doctor = doctors.find(d => d.id === appt.doctorId) || doctors[0];

    const { log } = await TwilioService.dispatchSms({
      toPhone: patient.phone,
      patientName: patient.firstName,
      appointmentId: appt.id,
      appointmentTime: new Date(appt.dateTime).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
      doctorName: doctor.name,
      clinicName: doctor.clinicType === 'gp_practice' ? 'St. James GP Practice' : 'Clinic Suite',
      type: reminderType,
      telehealthUrl: appt.meetingRoomId ? `https://medconnect.uk/telehealth/${appt.id}` : undefined
    });

    setTwilioLogs((prev) => [log, ...prev]);

    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== appointmentId) return a;
        return {
          ...a,
          twilioRemindersSent: [
            ...a.twilioRemindersSent,
            {
              timestamp: log.timestamp,
              type: 'sms',
              status: 'delivered',
              messageBody: log.message
            }
          ]
        };
      })
    );

    showToast('success', 'Twilio SMS Dispatched', `Delivered to ${patient.phone} (Ref: ${log.id})`);
  };

  const simulatePatientSmsReply = (logId: string, replyText: string) => {
    const log = twilioLogs.find(l => l.id === logId);
    if (!log) return;

    const parsed = TwilioService.handleInboundReply(replyText, log);

    setTwilioLogs((prev) =>
      prev.map((l) => (l.id === logId ? { ...l, patientReply: replyText, status: 'REPLIED' } : l))
    );

    if (parsed.action === 'CONFIRMED') {
      setAppointments((prev) =>
        prev.map((a) => (a.id === log.appointmentId ? { ...a, status: 'confirmed' } : a))
      );
      showToast('success', 'SMS Confirmation Received', `Patient replied "${replyText}". Appointment confirmed & ML risk reduced.`);
    } else if (parsed.action === 'CANCELLED') {
      setAppointments((prev) =>
        prev.map((a) => (a.id === log.appointmentId ? { ...a, status: 'cancelled' } : a))
      );
      showToast('warning', 'Appointment Cancelled via SMS', `Patient replied "${replyText}". Slot automatically freed for triage.`);
    }
  };

  const addPatient = (newPat: Patient) => {
    setPatients((prev) => [newPat, ...prev]);
    showToast('success', 'Patient Registered', `${newPat.firstName} ${newPat.lastName} (NHS: ${newPat.nhsNumber}) registered.`);
  };

  const rescheduleAppointment = async (appointmentId: string, newDateTime: string, reason?: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === appointmentId ? { ...app, dateTime: newDateTime, status: 'confirmed', notes: reason ? `${app.notes ? app.notes + ' | ' : ''}Rescheduled: ${reason}` : app.notes } : app))
    );
    const appt = appointments.find(a => a.id === appointmentId);
    if (appt) {
      try {
        const { log } = await TwilioService.dispatchSms({
          toPhone: appt.patientPhone,
          patientName: appt.patientName.split(' ')[0],
          appointmentId: appt.id,
          appointmentTime: new Date(newDateTime).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
          doctorName: appt.doctorName,
          clinicName: 'St. James Practice',
          type: 'standard_reminder'
        });
        setTwilioLogs((prev) => [log, ...prev]);
      } catch (e) {
        console.error('Twilio dispatch error:', e);
      }
    }
    showToast('success', 'Appointment Rescheduled', `Rescheduled to ${new Date(newDateTime).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}. Confirmation SMS sent.`);
  };

  const cancelAppointment = async (appointmentId: string, reason?: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === appointmentId ? { ...app, status: 'cancelled', notes: reason ? `${app.notes ? app.notes + ' | ' : ''}Cancelled: ${reason}` : app.notes } : app))
    );
    const appt = appointments.find(a => a.id === appointmentId);
    if (appt) {
      try {
        const { log } = await TwilioService.dispatchSms({
          toPhone: appt.patientPhone,
          patientName: appt.patientName.split(' ')[0],
          appointmentId: appt.id,
          appointmentTime: new Date(appt.dateTime).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
          doctorName: appt.doctorName,
          clinicName: 'St. James Practice',
          type: 'standard_reminder'
        });
        setTwilioLogs((prev) => [log, ...prev]);
      } catch (e) {
        console.error('Twilio dispatch error:', e);
      }
    }
    showToast('info', 'Appointment Cancelled', `Appointment marked as cancelled. Notification dispatched to patient.`);
  };

  const submitIntakeForm = async (patientId: string, formData: IntakeFormData): Promise<string> => {
    const encrypted = encryptPHI(formData);
    setIntakePayloads((prev) => ({
      ...prev,
      [patientId]: encrypted.ciphertext
    }));

    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, intakeFormCompleted: true, intakeFormEncryptedPayload: encrypted.ciphertext } : p))
    );

    addAuditLog({
      userId: patientId,
      userRole: 'patient',
      userName: 'Patient Self-Service Onboarding',
      action: 'PATIENT_RECORD_VIEWED',
      patientId,
      resourceId: `intake_${patientId}`,
      ipAddress: '86.134.22.190 (SSL TLS 1.3 Client)',
      status: 'SUCCESS',
      complianceStandard: 'HIPAA_SECURITY_RULE',
      details: `Digital intake form encrypted via AES-256-CBC (Checksum: ${encrypted.checksum}). Stored with Supabase RLS isolation.`
    });

    showToast('success', 'Medical History Encrypted & Saved', 'AES-256 encrypted payload safely deposited into Supabase RLS vault.');
    return encrypted.ciphertext;
  };

  const getDecryptedIntakeForm = (patientId: string): { data: IntakeFormData | null; error?: string } => {
    const ciphertext = intakePayloads[patientId];
    if (!ciphertext) {
      return { data: null, error: 'No encrypted intake record found for this patient.' };
    }

    return decryptPHI<IntakeFormData>(ciphertext);
  };

  const approvePrescription = (refillId: string, doctorSignature?: string) => {
    const doctor = doctors.find(d => d.id === currentDoctorId) || doctors[0];
    const signature = doctorSignature || `${doctor.name} (${doctor.gmcNumber} Electronic EPS Token #UK-EPS-${Date.now().toString().slice(-6)})`;

    setRefillRequests((prev) =>
      prev.map((r) => {
        if (r.id !== refillId) return r;
        return {
          ...r,
          status: 'approved',
          approvedAt: new Date().toISOString(),
          doctorSignature: signature
        };
      })
    );

    const refill = refillRequests.find(r => r.id === refillId);
    if (refill) {
      // Send Twilio confirmation to patient
      const patient = patients.find(p => p.id === refill.patientId);
      if (patient) {
        TwilioService.dispatchSms({
          toPhone: patient.phone,
          patientName: patient.firstName,
          appointmentId: refill.id,
          appointmentTime: 'Immediate EPS',
          doctorName: doctor.name,
          clinicName: 'St. James Practice',
          type: 'refill_ready'
        }).then(({ log }) => {
          setTwilioLogs((prev) => [log, ...prev]);
        });
      }

      addAuditLog({
        userId: doctor.id,
        userRole: 'doctor',
        userName: doctor.name,
        action: 'PRESCRIPTION_APPROVED',
        patientId: refill.patientId,
        patientName: refill.patientName,
        resourceId: refillId,
        ipAddress: '194.74.120.45',
        status: 'SUCCESS',
        complianceStandard: 'UK_GDPR_ART32',
        details: `Prescription approved: ${refill.medicationName} (${refill.dosage}, ${refill.quantity}). Digitally transmitted to ${refill.preferredPharmacy.name} (ODS ${refill.preferredPharmacy.odsCode}).`
      });
    }

    showToast('success', 'Prescription Signed & Transmitted', `EPS token generated. Transmitted to nominated community pharmacy.`);
  };

  const rejectPrescription = (refillId: string, reason: string) => {
    setRefillRequests((prev) =>
      prev.map((r) => (r.id === refillId ? { ...r, status: 'rejected', rejectionReason: reason } : r))
    );
    showToast('warning', 'Refill Request Declined', `Reason recorded: ${reason}`);
  };

  const createRefillRequest = (req: Omit<PrescriptionRefillRequest, 'id' | 'status' | 'requestedDate'>) => {
    const newRefill: PrescriptionRefillRequest = {
      ...req,
      id: `refill_${Date.now().toString().slice(-6)}`,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'pending_review'
    };
    setRefillRequests((prev) => [newRefill, ...prev]);
    showToast('success', 'Repeat Request Submitted', 'Sent to GP practice queue for clinician review.');
  };

  const requestGdprAnonymization = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const anonymized = anonymizePatientRecord(patient);
    setPatients((prev) => prev.map(p => (p.id === patientId ? (anonymized as unknown as Patient) : p)));

    // Clean intake payload
    setIntakePayloads((prev) => {
      const copy = { ...prev };
      delete copy[patientId];
      return copy;
    });

    addAuditLog({
      userId: 'dpo_officer',
      userRole: 'saas_admin',
      userName: 'Data Protection Officer (DPO)',
      action: 'RIGHT_TO_FORGET_APPLIED',
      patientId,
      patientName: `${patient.firstName} ${patient.lastName}`,
      resourceId: patientId,
      ipAddress: '127.0.0.1 (KMS DPO Console)',
      status: 'SUCCESS',
      complianceStandard: 'UK_GDPR_ART32',
      details: `GDPR Article 17 Right to Erasure executed. Direct identifiers cryptographically hashed; clinical logs scrubbed.`
    });

    showToast('info', 'GDPR Erasure Executed', `Patient ${patientId} anonymized across all database tables.`);
  };

  const addRotaShift = (shiftData: Omit<RotaShift, 'id' | 'bookedPatientsCount'>) => {
    const newShift: RotaShift = {
      ...shiftData,
      id: `rota_${Date.now().toString().slice(-6)}`,
      bookedPatientsCount: 0
    };
    setRotaShifts((prev) => [...prev, newShift]);
    showToast('success', 'Rota Shift Created', `Assigned ${shiftData.doctorName} on ${shiftData.date} (${shiftData.startTime}-${shiftData.endTime}).`);
  };

  useEffect(() => {
    // Initial sync
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        selectedClinicType,
        setSelectedClinicType,
        activeTab,
        setActiveTab,
        patients,
        doctors,
        appointments,
        refillRequests,
        rotaShifts,
        performanceMetrics,
        auditLogs,
        twilioLogs,
        intakePayloads,
        currentPatientId,
        setCurrentPatientId,
        currentDoctorId,
        setCurrentDoctorId,
        activeTelehealthAppointment,
        setActiveTelehealthAppointment,
        createAppointment,
        updateAppointmentStatus,
        runMlPredictionForAppointment,
        triggerTwilioReminder,
        simulatePatientSmsReply,
        addPatient,
        rescheduleAppointment,
        cancelAppointment,
        submitIntakeForm,
        getDecryptedIntakeForm,
        approvePrescription,
        rejectPrescription,
        createRefillRequest,
        requestGdprAnonymization,
        addAuditLog,
        addRotaShift,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
