export type ClinicType = 'gp_practice' | 'dental' | 'physiotherapy' | 'multidisciplinary';

export type UserRole = 'patient' | 'doctor' | 'receptionist' | 'practice_manager' | 'saas_admin';

export type Permission =
  | 'view_own_phi'
  | 'view_all_patient_phi'
  | 'decrypt_clinical_intake'
  | 'sign_prescriptions'
  | 'request_prescriptions'
  | 'manage_appointments'
  | 'manage_rota'
  | 'view_performance_analytics'
  | 'manage_saas_billing'
  | 'view_audit_logs'
  | 'execute_gdpr_erasure';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  gmcNumber?: string; // GMC or GDC registration
  nhsNumber?: string;
  clinicName: string;
  is2FAEnabled: boolean;
  twoFactorMethod?: 'sms_otp' | 'nhs_smartcard' | 'authenticator_app';
  permissions: Permission[];
  lastLoginAt: string;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type AppointmentMode = 'in_person' | 'video_consultation' | 'phone';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface MLPrediction {
  noShowProbability: number; // 0 to 100
  riskLevel: RiskLevel;
  confidenceScore: number;
  keyFactors: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
    description: string;
  }[];
  recommendedAction: string;
  suggestedBufferSlot?: boolean;
  smsStrategy: 'standard_24h' | 'aggressive_multi_channel' | 'interactive_confirmation' | 'deposit_required';
}

export interface Patient {
  id: string;
  nhsNumber: string; // e.g. 485 772 9012
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'female' | 'male' | 'other' | 'undisclosed';
  email: string;
  phone: string;
  address: {
    line1: string;
    city: string;
    postcode: string;
  };
  gpPracticeName?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  medicalConditions: string[];
  activePrescriptionsCount: number;
  intakeFormCompleted: boolean;
  intakeFormEncryptedPayload?: string;
  historicalNoShows: number;
  historicalTotalBookings: number;
  gdprConsent: {
    marketingConsent: boolean;
    smsNotificationConsent: boolean;
    dataSharingConsent: boolean;
    consentTimestamp: string;
  };
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  gmcNumber: string;
  email: string;
  phone: string;
  avatar: string;
  clinicType: ClinicType;
  roomNumber: string;
  rating: number;
  totalReviews: number;
  patientSatisfactionScore: number;
  averageConsultationMinutes: number;
  googleCalendarLinked: boolean;
  googleCalendarEmail?: string;
  telehealthAvailable: boolean;
  dailyPatientCapacity: number;
  patientsToday: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientNhsNumber: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  clinicType: ClinicType;
  dateTime: string;
  durationMinutes: number;
  mode: AppointmentMode;
  status: AppointmentStatus;
  reasonForVisit: string;
  notes?: string;
  meetingRoomId?: string;
  mlPrediction: MLPrediction;
  twilioRemindersSent: {
    timestamp: string;
    type: 'sms' | 'voice_call' | 'whatsapp';
    status: 'delivered' | 'sent' | 'failed' | 'responded_confirmed' | 'responded_cancel';
    messageBody: string;
  }[];
  googleCalendarEventId?: string;
  gmbSource?: boolean;
  intakeFormAttached?: boolean;
  paymentStatus: 'paid' | 'deposit_paid' | 'exempt_nhs' | 'unpaid';
  feeGbp?: number;
}

export interface IntakeFormData {
  patientId: string;
  appointmentId?: string;
  completedAt: string;
  symptoms: string[];
  symptomDuration: string;
  painLevel?: number;
  painLocation?: string[];
  medicalHistory: {
    hasHighBloodPressure: boolean;
    hasDiabetes: boolean;
    hasAsthmaOrCopd: boolean;
    hasHeartDisease: boolean;
    hasBleedingDisorders: boolean;
    isPregnantOrNursing?: boolean;
    otherConditions: string;
  };
  lifestyle: {
    smokingStatus: 'never' | 'former' | 'current_light' | 'current_heavy';
    alcoholUnitsPerWeek: number;
    activityLevel: 'sedentary' | 'moderate' | 'active';
  };
  dentalSpecific?: {
    lastDentalVisitMonthsAgo: number;
    bleedingGums: boolean;
    toothSensitivity: boolean;
    grindingClenching: boolean;
    denturesOrImplants: boolean;
  };
  physioSpecific?: {
    injuryMechanism: string;
    aggravatingMovements: string;
    relievingFactors: string;
    previousTreatments: string;
  };
  currentMedications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  allergiesList: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  digitalSignature: string;
  consentDeclaration: boolean;
}

export interface PrescriptionRefillRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientNhsNumber: string;
  doctorId: string;
  doctorName: string;
  medicationName: string;
  bnfCode?: string;
  dosage: string;
  quantity: string;
  frequency: string;
  lastIssuedDate: string;
  requestedDate: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'forwarded_to_pharmacy';
  reasonForRequest: string;
  preferredPharmacy: {
    name: string;
    odsCode: string;
    address: string;
    electronicPrescriptionService: boolean;
  };
  doctorSignature?: string;
  approvedAt?: string;
  rejectionReason?: string;
  clinicalSafetyNotes?: string;
  interactionWarning?: {
    severity: 'mild' | 'moderate' | 'severe';
    message: string;
  };
}

export interface RotaShift {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  shiftType: 'morning' | 'afternoon' | 'full_day' | 'on_call' | 'telehealth_remote';
  bookedPatientsCount: number;
  maxPatientsCapacity: number;
  status: 'scheduled' | 'active' | 'completed' | 'on_leave';
}

export interface DoctorPerformanceMetric {
  doctorId: string;
  doctorName: string;
  specialty: string;
  period: string;
  patientsSeen: number;
  targetPatients: number;
  averageConsultationTimeMin: number;
  patientSatisfactionRate: number;
  noShowRate: number;
  prescriptionsIssued: number;
  telehealthPercentage: number;
  dailyPatientCounts: { day: string; count: number; capacity: number }[];
  weeklyRatings: { week: string; rating: number; reviews: number }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userRole: UserRole;
  userName: string;
  action: 'PATIENT_RECORD_VIEWED' | 'INTAKE_FORM_DECRYPTED' | 'PRESCRIPTION_APPROVED' | 'APPOINTMENT_CREATED' | 'TELEHEALTH_SESSION_STARTED' | 'GDPR_EXPORT_REQUESTED' | 'AES_KEY_ACCESSED' | 'RIGHT_TO_FORGET_APPLIED';
  patientId?: string;
  patientName?: string;
  resourceId?: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
  complianceStandard: 'HIPAA_SECURITY_RULE' | 'UK_GDPR_ART32' | 'NHS_DSPT';
  details: string;
}

export interface TwilioLog {
  id: string;
  timestamp: string;
  recipientPhone: string;
  recipientName: string;
  appointmentId: string;
  type: 'SMS_REMINDER' | 'VOICE_CALL' | 'WHATSAPP' | 'CONFIRMATION_INCOMING';
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED' | 'REPLIED';
  message: string;
  costGbp: number;
  patientReply?: string;
}

export interface SaaSTier {
  id: 'solo' | 'practice' | 'enterprise';
  name: string;
  priceMonthlyGbp: number;
  annualPriceGbp: number;
  description: string;
  maxClinicians: number;
  maxAppointmentsPerMonth: number;
  features: string[];
  gmbIncluded: boolean;
  mlNoShowIncluded: boolean;
  telehealthIncluded: boolean;
  hipaaGdprDpaIncluded: boolean;
  nhsEpsIncluded: boolean;
  popular?: boolean;
}
