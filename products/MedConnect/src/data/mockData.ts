import { Doctor, Patient, Appointment, PrescriptionRefillRequest, RotaShift, DoctorPerformanceMetric, AuditLogEntry, TwilioLog, SaaSTier } from '../types';
import { encryptPHI } from '../lib/crypto';
import { predictNoShowRisk } from '../lib/mlPredictor';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc_1',
    name: 'Dr. Sarah Jenkins',
    title: 'Dr. Sarah Jenkins, MBChB MRCGP DCH',
    specialty: 'Senior GP Partner & Chronic Disease Lead',
    gmcNumber: 'GMC 7489201',
    email: 'sarah.jenkins@stjamesgp.nhs.uk',
    phone: '+44 20 7946 0192',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    clinicType: 'gp_practice',
    roomNumber: 'Consultation Room 3 (Ground Floor)',
    rating: 4.9,
    totalReviews: 312,
    patientSatisfactionScore: 98,
    averageConsultationMinutes: 12.5,
    googleCalendarLinked: true,
    googleCalendarEmail: 'dr.sarah.jenkins.gp@gmail.com',
    telehealthAvailable: true,
    dailyPatientCapacity: 28,
    patientsToday: 18
  },
  {
    id: 'doc_2',
    name: 'Dr. Marcus Vance',
    title: 'Dr. Marcus Vance, BDS MSc (Orthodontics)',
    specialty: 'Clinical Lead & Specialist Orthodontist',
    gmcNumber: 'GDC 194820',
    email: 'marcus.vance@mayfairsmiles.co.uk',
    phone: '+44 20 7946 0841',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    clinicType: 'dental',
    roomNumber: 'Dental Surgery Suite A',
    rating: 4.95,
    totalReviews: 248,
    patientSatisfactionScore: 99,
    averageConsultationMinutes: 24.0,
    googleCalendarLinked: true,
    googleCalendarEmail: 'marcus.vance.dentist@gmail.com',
    telehealthAvailable: true,
    dailyPatientCapacity: 16,
    patientsToday: 12
  },
  {
    id: 'doc_3',
    name: 'Aisha Patel, MCSP',
    title: 'Aisha Patel, BSc (Hons) MCSP HCPC Reg',
    specialty: 'Lead MSK Physiotherapist & Sports Rehab',
    gmcNumber: 'HCPC PH88291',
    email: 'aisha.patel@kensingtonphysio.co.uk',
    phone: '+44 20 7946 0337',
    avatar: 'https://images.unsplash.com/photo-1594824813628-48225575529f?auto=format&fit=crop&q=80&w=300',
    clinicType: 'physiotherapy',
    roomNumber: 'Physio Rehab Studio 2',
    rating: 4.88,
    totalReviews: 194,
    patientSatisfactionScore: 97,
    averageConsultationMinutes: 30.0,
    googleCalendarLinked: true,
    googleCalendarEmail: 'aisha.physio.london@gmail.com',
    telehealthAvailable: true,
    dailyPatientCapacity: 14,
    patientsToday: 10
  },
  {
    id: 'doc_4',
    name: 'Dr. James Thorne',
    title: 'Dr. James Thorne, MBBS FRCGP DRCOG',
    specialty: 'General Practitioner & Urgent Minor Surgery',
    gmcNumber: 'GMC 6198442',
    email: 'james.thorne@stjamesgp.nhs.uk',
    phone: '+44 20 7946 0914',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    clinicType: 'gp_practice',
    roomNumber: 'Consultation Room 5',
    rating: 4.82,
    totalReviews: 185,
    patientSatisfactionScore: 95,
    averageConsultationMinutes: 14.0,
    googleCalendarLinked: true,
    googleCalendarEmail: 'dr.james.thorne@gmail.com',
    telehealthAvailable: true,
    dailyPatientCapacity: 26,
    patientsToday: 16
  }
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat_1',
    nhsNumber: '485 772 9012',
    firstName: 'Oliver',
    lastName: 'Bennett',
    dob: '1989-04-12',
    gender: 'male',
    email: 'oliver.bennett@example.co.uk',
    phone: '+44 7700 900123',
    address: {
      line1: '42 Belgrave Square',
      city: 'London',
      postcode: 'SW1X 8PG'
    },
    gpPracticeName: 'St. James Health Centre',
    emergencyContact: {
      name: 'Clara Bennett',
      relationship: 'Spouse',
      phone: '+44 7700 900124'
    },
    allergies: ['Penicillin V', 'Latex'],
    medicalConditions: ['Mild Asthma', 'Allergic Rhinitis'],
    activePrescriptionsCount: 2,
    intakeFormCompleted: true,
    historicalNoShows: 0,
    historicalTotalBookings: 6,
    gdprConsent: {
      marketingConsent: false,
      smsNotificationConsent: true,
      dataSharingConsent: true,
      consentTimestamp: '2026-01-10T10:00:00Z'
    },
    createdAt: '2025-06-14T09:30:00Z'
  },
  {
    id: 'pat_2',
    nhsNumber: '918 234 5091',
    firstName: 'Sophie',
    lastName: 'Taylor',
    dob: '1995-11-23',
    gender: 'female',
    email: 'sophie.taylor@example.co.uk',
    phone: '+44 7700 900456',
    address: {
      line1: '18 Deansgate Crescent',
      city: 'Manchester',
      postcode: 'M3 2BW'
    },
    gpPracticeName: 'St. James Health Centre',
    emergencyContact: {
      name: 'Mark Taylor',
      relationship: 'Brother',
      phone: '+44 7700 900457'
    },
    allergies: ['None known'],
    medicalConditions: ['Hypertension', 'Migraine with Aura'],
    activePrescriptionsCount: 3,
    intakeFormCompleted: true,
    historicalNoShows: 2,
    historicalTotalBookings: 4,
    gdprConsent: {
      marketingConsent: true,
      smsNotificationConsent: true,
      dataSharingConsent: true,
      consentTimestamp: '2026-02-01T14:15:00Z'
    },
    createdAt: '2025-09-20T11:00:00Z'
  },
  {
    id: 'pat_3',
    nhsNumber: '672 109 8831',
    firstName: 'Arthur',
    lastName: 'Pendelton',
    dob: '1954-08-19',
    gender: 'male',
    email: 'arthur.pendelton@example.co.uk',
    phone: '+44 7700 900789',
    address: {
      line1: '7 Church Row, Hampstead',
      city: 'London',
      postcode: 'NW3 6UP'
    },
    gpPracticeName: 'St. James Health Centre',
    emergencyContact: {
      name: 'Eleanor Pendelton',
      relationship: 'Daughter',
      phone: '+44 7700 900790'
    },
    allergies: ['Sulphonamides', 'Aspirin'],
    medicalConditions: ['Type 2 Diabetes Mellitus', 'Atrial Fibrillation', 'Hypercholesterolemia'],
    activePrescriptionsCount: 4,
    intakeFormCompleted: true,
    historicalNoShows: 0,
    historicalTotalBookings: 18,
    gdprConsent: {
      marketingConsent: false,
      smsNotificationConsent: true,
      dataSharingConsent: true,
      consentTimestamp: '2024-11-04T08:45:00Z'
    },
    createdAt: '2024-11-04T08:45:00Z'
  },
  {
    id: 'pat_4',
    nhsNumber: '334 892 0182',
    firstName: 'Maya',
    lastName: 'Al-Mansoor',
    dob: '2001-03-05',
    gender: 'female',
    email: 'maya.almansoor@example.co.uk',
    phone: '+44 7700 900891',
    address: {
      line1: '88 Kensington High Street',
      city: 'London',
      postcode: 'W8 4SG'
    },
    emergencyContact: {
      name: 'Tariq Al-Mansoor',
      relationship: 'Father',
      phone: '+44 7700 900892'
    },
    allergies: ['NSAIDs (Ibuprofen)'],
    medicalConditions: ['Anterior Cruciate Ligament (ACL) Post-Op Rehabilitation'],
    activePrescriptionsCount: 1,
    intakeFormCompleted: false,
    historicalNoShows: 1,
    historicalTotalBookings: 2,
    gdprConsent: {
      marketingConsent: false,
      smsNotificationConsent: true,
      dataSharingConsent: true,
      consentTimestamp: '2026-03-12T16:20:00Z'
    },
    createdAt: '2026-03-12T16:20:00Z'
  }
];

// Initialize encrypted intake form payloads for sample patients
export const MOCK_INTAKE_PAYLOADS: Record<string, string> = {
  pat_1: encryptPHI({
    patientId: 'pat_1',
    completedAt: '2026-09-26T14:30:00Z',
    symptoms: ['Persistent wheezing at night', 'Occasional morning chest tightness'],
    symptomDuration: '3 weeks',
    painLevel: 2,
    painLocation: ['Chest'],
    medicalHistory: {
      hasHighBloodPressure: false,
      hasDiabetes: false,
      hasAsthmaOrCopd: true,
      hasHeartDisease: false,
      hasBleedingDisorders: false,
      otherConditions: 'Eczema in childhood'
    },
    lifestyle: {
      smokingStatus: 'never',
      alcoholUnitsPerWeek: 4,
      activityLevel: 'moderate'
    },
    currentMedications: [
      { name: 'Salbutamol 100mcg Inhaler (Ventolin)', dosage: '2 puffs', frequency: 'as needed for breathlessness' },
      { name: 'Beclometasone 100mcg Clenil Modulite', dosage: '1 puff', frequency: 'twice daily' }
    ],
    allergiesList: 'Severe anaphylaxis to Penicillin V, mild urticaria from Latex',
    emergencyContact: { name: 'Clara Bennett', relationship: 'Spouse', phone: '+44 7700 900124' },
    digitalSignature: 'Oliver Bennett (Signed Digitally with 2FA OTP verification)',
    consentDeclaration: true
  }).ciphertext,

  pat_3: encryptPHI({
    patientId: 'pat_3',
    completedAt: '2026-09-25T09:15:00Z',
    symptoms: ['Routine diabetic HbA1c review', 'Mild peripheral tingling in left toe'],
    symptomDuration: '2 months',
    painLevel: 1,
    painLocation: ['Lower Extremities'],
    medicalHistory: {
      hasHighBloodPressure: true,
      hasDiabetes: true,
      hasAsthmaOrCopd: false,
      hasHeartDisease: true,
      hasBleedingDisorders: false,
      otherConditions: 'Mild osteoarthritis in right knee'
    },
    lifestyle: {
      smokingStatus: 'former',
      alcoholUnitsPerWeek: 2,
      activityLevel: 'sedentary'
    },
    currentMedications: [
      { name: 'Metformin Hydrochloride 500mg', dosage: '500mg', frequency: 'twice daily with meals' },
      { name: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'once daily at night' },
      { name: 'Ramipril 5mg', dosage: '5mg', frequency: 'once daily morning' }
    ],
    allergiesList: 'Sulphonamides (skin rash), Aspirin (gastric irritation)',
    emergencyContact: { name: 'Eleanor Pendelton', relationship: 'Daughter', phone: '+44 7700 900790' },
    digitalSignature: 'Arthur Pendelton (Verified via NHS App ID)',
    consentDeclaration: true
  }).ciphertext
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_101',
    patientId: 'pat_1',
    patientName: 'Oliver Bennett',
    patientNhsNumber: '485 772 9012',
    patientPhone: '+44 7700 900123',
    patientEmail: 'oliver.bennett@example.co.uk',
    doctorId: 'doc_1',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpecialty: 'GP Practice',
    clinicType: 'gp_practice',
    dateTime: '2026-09-28T09:30:00.000Z',
    durationMinutes: 15,
    mode: 'video_consultation',
    status: 'confirmed',
    reasonForVisit: 'Asthma Inhaler Stepped Review & Cough',
    meetingRoomId: 'telehealth-apt-101-sarah-oliver',
    mlPrediction: predictNoShowRisk({
      leadTimeDays: 2,
      patientAge: 37,
      historicalNoShows: 0,
      historicalTotalBookings: 6,
      dayOfWeek: 1,
      hourOfDay: 9,
      appointmentMode: 'video_consultation',
      clinicType: 'gp_practice',
      smsConfirmed: true,
      depositPaid: false
    }),
    twilioRemindersSent: [
      {
        timestamp: '2026-09-27T10:00:00Z',
        type: 'sms',
        status: 'responded_confirmed',
        messageBody: 'Hi Oliver, your Telehealth video consultation with Dr. Sarah Jenkins is confirmed for Mon 28 Sep 09:30. Link: https://medconnect.uk/telehealth/apt_101'
      }
    ],
    googleCalendarEventId: 'gcal_8830192',
    gmbSource: true,
    intakeFormAttached: true,
    paymentStatus: 'exempt_nhs'
  },
  {
    id: 'apt_102',
    patientId: 'pat_2',
    patientName: 'Sophie Taylor',
    patientNhsNumber: '918 234 5091',
    patientPhone: '+44 7700 900456',
    patientEmail: 'sophie.taylor@example.co.uk',
    doctorId: 'doc_1',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpecialty: 'GP Practice',
    clinicType: 'gp_practice',
    dateTime: '2026-09-28T11:00:00.000Z',
    durationMinutes: 15,
    mode: 'in_person',
    status: 'scheduled',
    reasonForVisit: 'Blood Pressure Monitoring & Migraine Medication Review',
    mlPrediction: predictNoShowRisk({
      leadTimeDays: 16,
      patientAge: 30,
      historicalNoShows: 2,
      historicalTotalBookings: 4,
      dayOfWeek: 1,
      hourOfDay: 11,
      appointmentMode: 'in_person',
      clinicType: 'gp_practice',
      smsConfirmed: false,
      depositPaid: false
    }),
    twilioRemindersSent: [
      {
        timestamp: '2026-09-27T08:00:00Z',
        type: 'sms',
        status: 'delivered',
        messageBody: 'Hi Sophie, appointment with Dr. Sarah Jenkins tomorrow 11:00 at St. James GP. Reply YES to confirm or CANCEL.'
      }
    ],
    googleCalendarEventId: 'gcal_4491022',
    gmbSource: false,
    intakeFormAttached: true,
    paymentStatus: 'exempt_nhs'
  },
  {
    id: 'apt_103',
    patientId: 'pat_4',
    patientName: 'Maya Al-Mansoor',
    patientNhsNumber: '334 892 0182',
    patientPhone: '+44 7700 900891',
    patientEmail: 'maya.almansoor@example.co.uk',
    doctorId: 'doc_3',
    doctorName: 'Aisha Patel, MCSP',
    doctorSpecialty: 'MSK Physiotherapy',
    clinicType: 'physiotherapy',
    dateTime: '2026-09-28T14:30:00.000Z',
    durationMinutes: 45,
    mode: 'in_person',
    status: 'confirmed',
    reasonForVisit: 'ACL Reconstruction Week 6 Rehabilitation & Gait Analysis',
    mlPrediction: predictNoShowRisk({
      leadTimeDays: 4,
      patientAge: 25,
      historicalNoShows: 1,
      historicalTotalBookings: 2,
      dayOfWeek: 1,
      hourOfDay: 14,
      appointmentMode: 'in_person',
      clinicType: 'physiotherapy',
      smsConfirmed: true,
      depositPaid: true
    }),
    twilioRemindersSent: [
      {
        timestamp: '2026-09-27T12:30:00Z',
        type: 'sms',
        status: 'responded_confirmed',
        messageBody: 'Hi Maya, your Physio Rehab session with Aisha Patel is booked for Mon 14:30 at Kensington Physio Studio 2. £25 deposit received.'
      }
    ],
    googleCalendarEventId: 'gcal_6672911',
    gmbSource: true,
    intakeFormAttached: false,
    paymentStatus: 'deposit_paid',
    feeGbp: 85
  },
  {
    id: 'apt_104',
    patientId: 'pat_3',
    patientName: 'Arthur Pendelton',
    patientNhsNumber: '672 109 8831',
    patientPhone: '+44 7700 900789',
    patientEmail: 'arthur.pendelton@example.co.uk',
    doctorId: 'doc_2',
    doctorName: 'Dr. Marcus Vance',
    doctorSpecialty: 'Dental & Orthodontics',
    clinicType: 'dental',
    dateTime: '2026-09-29T10:00:00.000Z',
    durationMinutes: 30,
    mode: 'in_person',
    status: 'confirmed',
    reasonForVisit: 'Dental Crown Preparation & Periodontal Pocket Check',
    mlPrediction: predictNoShowRisk({
      leadTimeDays: 3,
      patientAge: 72,
      historicalNoShows: 0,
      historicalTotalBookings: 18,
      dayOfWeek: 2,
      hourOfDay: 10,
      appointmentMode: 'in_person',
      clinicType: 'dental',
      smsConfirmed: true,
      depositPaid: true
    }),
    twilioRemindersSent: [
      {
        timestamp: '2026-09-27T09:00:00Z',
        type: 'sms',
        status: 'responded_confirmed',
        messageBody: 'Hi Arthur, dental surgery consultation confirmed with Dr. Marcus Vance for Tue 29 Sep 10:00.'
      }
    ],
    googleCalendarEventId: 'gcal_9901823',
    gmbSource: true,
    intakeFormAttached: true,
    paymentStatus: 'deposit_paid',
    feeGbp: 140
  }
];

export const MOCK_REFILL_REQUESTS: PrescriptionRefillRequest[] = [
  {
    id: 'refill_201',
    patientId: 'pat_1',
    patientName: 'Oliver Bennett',
    patientNhsNumber: '485 772 9012',
    doctorId: 'doc_1',
    doctorName: 'Dr. Sarah Jenkins',
    medicationName: 'Salbutamol 100mcg Inhaler (Ventolin Evohaler)',
    bnfCode: '0301011R0',
    dosage: '100 micrograms/dose',
    quantity: '2 x 200 dose inhalers',
    frequency: 'Inhale 1-2 puffs as required for relief of wheeze / breathlessness',
    lastIssuedDate: '2026-07-15',
    requestedDate: '2026-09-27',
    status: 'pending_review',
    reasonForRequest: 'Current canister is running low prior to autumn marathon training.',
    preferredPharmacy: {
      name: 'Boots Pharmacy (Mayfair)',
      odsCode: 'FA391',
      address: '32 Curzon Street, London, W1J 7TR',
      electronicPrescriptionService: true
    },
    clinicalSafetyNotes: 'Patient last completed asthma review in March 2026. No overuse flags detected.'
  },
  {
    id: 'refill_202',
    patientId: 'pat_3',
    patientName: 'Arthur Pendelton',
    patientNhsNumber: '672 109 8831',
    doctorId: 'doc_1',
    doctorName: 'Dr. Sarah Jenkins',
    medicationName: 'Atorvastatin 20mg Film-Coated Tablets',
    bnfCode: '0212000B0',
    dosage: '20mg',
    quantity: '84 tablets (3 months supply)',
    frequency: 'Take one tablet at bedtime',
    lastIssuedDate: '2026-06-28',
    requestedDate: '2026-09-26',
    status: 'approved',
    approvedAt: '2026-09-27T08:15:00Z',
    doctorSignature: 'Dr. Sarah Jenkins MRCGP (Digitally signed via GMC Electronic Prescribing Token #GMC-7489201)',
    reasonForRequest: 'Routine 3-monthly lipid management repeat refill.',
    preferredPharmacy: {
      name: 'Hampstead Community Chemist',
      odsCode: 'FF802',
      address: '14 Heath Street, Hampstead, NW3 6TE',
      electronicPrescriptionService: true
    },
    clinicalSafetyNotes: 'LFTs and lipid profile checked in May 2026 (normal). Safe to authorize 84 days.'
  },
  {
    id: 'refill_203',
    patientId: 'pat_2',
    patientName: 'Sophie Taylor',
    patientNhsNumber: '918 234 5091',
    doctorId: 'doc_1',
    doctorName: 'Dr. Sarah Jenkins',
    medicationName: 'Sumatriptan 50mg Tablets',
    bnfCode: '0407040W0',
    dosage: '50mg',
    quantity: '6 tablets',
    frequency: 'Take 1 tablet at the onset of migraine headache; repeat after 2h if necessary (Max 300mg/24h)',
    lastIssuedDate: '2026-08-01',
    requestedDate: '2026-09-27',
    status: 'pending_review',
    reasonForRequest: 'Travel planned next week; requesting emergency rescue supply.',
    preferredPharmacy: {
      name: 'Well Pharmacy Manchester Central',
      odsCode: 'FA119',
      address: '55 King Street, Manchester, M2 4LQ',
      electronicPrescriptionService: true
    },
    interactionWarning: {
      severity: 'moderate',
      message: 'Concurrent SSRI/triptan safety alert: Check patient has no serotonin syndrome symptoms.'
    },
    clinicalSafetyNotes: 'Patient advised not to exceed 2 doses per migraine attack.'
  }
];

export const MOCK_ROTA_SHIFTS: RotaShift[] = [
  {
    id: 'rota_1',
    doctorId: 'doc_1',
    doctorName: 'Dr. Sarah Jenkins',
    specialty: 'GP Practice',
    date: '2026-09-28',
    startTime: '08:30',
    endTime: '17:00',
    room: 'Consultation Room 3',
    shiftType: 'full_day',
    bookedPatientsCount: 18,
    maxPatientsCapacity: 28,
    status: 'scheduled'
  },
  {
    id: 'rota_2',
    doctorId: 'doc_2',
    doctorName: 'Dr. Marcus Vance',
    specialty: 'Dental Surgery',
    date: '2026-09-28',
    startTime: '09:00',
    endTime: '17:30',
    room: 'Dental Suite A',
    shiftType: 'full_day',
    bookedPatientsCount: 12,
    maxPatientsCapacity: 16,
    status: 'scheduled'
  },
  {
    id: 'rota_3',
    doctorId: 'doc_3',
    doctorName: 'Aisha Patel, MCSP',
    specialty: 'MSK Physiotherapy',
    date: '2026-09-28',
    startTime: '10:00',
    endTime: '18:00',
    room: 'Physio Studio 2',
    shiftType: 'full_day',
    bookedPatientsCount: 10,
    maxPatientsCapacity: 14,
    status: 'scheduled'
  },
  {
    id: 'rota_4',
    doctorId: 'doc_4',
    doctorName: 'Dr. James Thorne',
    specialty: 'Urgent Care & Minor Surgery',
    date: '2026-09-28',
    startTime: '12:00',
    endTime: '20:00',
    room: 'Urgent Triage Room 1',
    shiftType: 'afternoon',
    bookedPatientsCount: 16,
    maxPatientsCapacity: 26,
    status: 'scheduled'
  }
];

export const MOCK_PERFORMANCE_METRICS: DoctorPerformanceMetric[] = [
  {
    doctorId: 'doc_1',
    doctorName: 'Dr. Sarah Jenkins',
    specialty: 'GP Practice Lead',
    period: 'September 2026',
    patientsSeen: 412,
    targetPatients: 400,
    averageConsultationTimeMin: 12.5,
    patientSatisfactionRate: 98.4,
    noShowRate: 3.8,
    prescriptionsIssued: 284,
    telehealthPercentage: 42,
    dailyPatientCounts: [
      { day: 'Mon', count: 26, capacity: 28 },
      { day: 'Tue', count: 27, capacity: 28 },
      { day: 'Wed', count: 24, capacity: 28 },
      { day: 'Thu', count: 25, capacity: 28 },
      { day: 'Fri', count: 28, capacity: 28 }
    ],
    weeklyRatings: [
      { week: 'W1', rating: 4.9, reviews: 62 },
      { week: 'W2', rating: 4.88, reviews: 78 },
      { week: 'W3', rating: 4.95, reviews: 84 },
      { week: 'W4', rating: 4.92, reviews: 88 }
    ]
  },
  {
    doctorId: 'doc_2',
    doctorName: 'Dr. Marcus Vance',
    specialty: 'Dental & Orthodontics',
    period: 'September 2026',
    patientsSeen: 236,
    targetPatients: 240,
    averageConsultationTimeMin: 24.2,
    patientSatisfactionRate: 99.1,
    noShowRate: 2.1,
    prescriptionsIssued: 42,
    telehealthPercentage: 18,
    dailyPatientCounts: [
      { day: 'Mon', count: 14, capacity: 16 },
      { day: 'Tue', count: 15, capacity: 16 },
      { day: 'Wed', count: 16, capacity: 16 },
      { day: 'Thu', count: 14, capacity: 16 },
      { day: 'Fri', count: 15, capacity: 16 }
    ],
    weeklyRatings: [
      { week: 'W1', rating: 4.92, reviews: 50 },
      { week: 'W2', rating: 4.96, reviews: 58 },
      { week: 'W3', rating: 4.94, reviews: 64 },
      { week: 'W4', rating: 4.98, reviews: 76 }
    ]
  },
  {
    doctorId: 'doc_3',
    doctorName: 'Aisha Patel, MCSP',
    specialty: 'MSK Physiotherapy',
    period: 'September 2026',
    patientsSeen: 188,
    targetPatients: 190,
    averageConsultationTimeMin: 31.0,
    patientSatisfactionRate: 97.6,
    noShowRate: 4.2,
    prescriptionsIssued: 0,
    telehealthPercentage: 35,
    dailyPatientCounts: [
      { day: 'Mon', count: 11, capacity: 14 },
      { day: 'Tue', count: 12, capacity: 14 },
      { day: 'Wed', count: 13, capacity: 14 },
      { day: 'Thu', count: 12, capacity: 14 },
      { day: 'Fri', count: 10, capacity: 14 }
    ],
    weeklyRatings: [
      { week: 'W1', rating: 4.85, reviews: 42 },
      { week: 'W2', rating: 4.88, reviews: 48 },
      { week: 'W3', rating: 4.89, reviews: 51 },
      { week: 'W4', rating: 4.91, reviews: 53 }
    ]
  }
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_8801',
    timestamp: '2026-09-27T08:15:00Z',
    userId: 'doc_1',
    userRole: 'doctor',
    userName: 'Dr. Sarah Jenkins',
    action: 'PRESCRIPTION_APPROVED',
    patientId: 'pat_3',
    patientName: 'Arthur Pendelton',
    resourceId: 'refill_202',
    ipAddress: '194.74.120.45 (NHS HSCN Gateway)',
    status: 'SUCCESS',
    complianceStandard: 'UK_GDPR_ART32',
    details: 'One-click EPS approval for Atorvastatin 20mg (84 tabs). Validated against GMC token.'
  },
  {
    id: 'aud_8802',
    timestamp: '2026-09-27T08:16:30Z',
    userId: 'doc_1',
    userRole: 'doctor',
    userName: 'Dr. Sarah Jenkins',
    action: 'INTAKE_FORM_DECRYPTED',
    patientId: 'pat_1',
    patientName: 'Oliver Bennett',
    resourceId: 'intake_pat_1',
    ipAddress: '194.74.120.45 (NHS HSCN Gateway)',
    status: 'SUCCESS',
    complianceStandard: 'HIPAA_SECURITY_RULE',
    details: 'AES-256 decrypted pre-arrival clinical history prior to video consultation.'
  },
  {
    id: 'aud_8803',
    timestamp: '2026-09-27T09:12:00Z',
    userId: 'rec_1',
    userRole: 'receptionist',
    userName: 'Hannah Collins',
    action: 'APPOINTMENT_CREATED',
    patientId: 'pat_4',
    patientName: 'Maya Al-Mansoor',
    resourceId: 'apt_103',
    ipAddress: '82.165.197.10 (Practice Frontdesk Terminal)',
    status: 'SUCCESS',
    complianceStandard: 'NHS_DSPT',
    details: 'GMB Widget appointment confirmed. Google Calendar slot synchronized.'
  }
];

export const MOCK_TWILIO_LOGS: TwilioLog[] = [
  {
    id: 'SM991048201',
    timestamp: '2026-09-27T10:00:00Z',
    recipientPhone: '+44 7700 900123',
    recipientName: 'Oliver Bennett',
    appointmentId: 'apt_101',
    type: 'SMS_REMINDER',
    status: 'REPLIED',
    message: '[MedConnect Telehealth] Hi Oliver, Dr. Sarah Jenkins is expecting you Mon 28 Sep 09:30. Reply YES to confirm.',
    costGbp: 0.038,
    patientReply: 'YES I WILL ATTEND'
  },
  {
    id: 'SM991048202',
    timestamp: '2026-09-27T08:00:00Z',
    recipientPhone: '+44 7700 900456',
    recipientName: 'Sophie Taylor',
    appointmentId: 'apt_102',
    type: 'SMS_REMINDER',
    status: 'DELIVERED',
    message: '[MedConnect Reminder] Hi Sophie, appointment with Dr. Sarah Jenkins tomorrow 11:00 at St. James GP. Reply YES to confirm or CANCEL.',
    costGbp: 0.038
  },
  {
    id: 'CA772901822',
    timestamp: '2026-09-26T17:30:00Z',
    recipientPhone: '+44 7700 900789',
    recipientName: 'Arthur Pendelton',
    appointmentId: 'apt_104',
    type: 'VOICE_CALL',
    status: 'DELIVERED',
    message: 'Automated Voice Call: "Hello Arthur, this is an automated confirmation for your Dental Surgery appointment with Dr. Marcus Vance on Tue 10:00."',
    costGbp: 0.065
  }
];

export const SAAS_PRICING_TIERS: SaaSTier[] = [
  {
    id: 'solo',
    name: 'Solo Practitioner',
    priceMonthlyGbp: 99,
    annualPriceGbp: 950,
    description: 'Perfect for private dentists, solo physiotherapists & independent consultants.',
    maxClinicians: 1,
    maxAppointmentsPerMonth: 350,
    features: [
      '1 Clinician License',
      'Google My Business Direct Booking Widget',
      '2-Way Google Calendar Real-Time Sync',
      'Built-in WebRTC Telehealth Video Room',
      'AES-256 Encrypted Digital Intake Forms',
      'Automated Twilio SMS Reminders (500/mo)',
      'Basic Patient Records & Repeat Refills',
      'HIPAA & UK GDPR Compliance Shield'
    ],
    gmbIncluded: true,
    mlNoShowIncluded: false,
    telehealthIncluded: true,
    hipaaGdprDpaIncluded: true,
    nhsEpsIncluded: false
  },
  {
    id: 'practice',
    name: 'Multi-Doctor Practice',
    priceMonthlyGbp: 249,
    annualPriceGbp: 2390,
    description: 'Designed for GP Practices, Group Dental Surgeries & Multi-Disciplinary Clinics.',
    popular: true,
    maxClinicians: 8,
    maxAppointmentsPerMonth: 3000,
    features: [
      'Up to 8 Clinicians + Unlimited Receptionists',
      'AI/ML Predictive No-Show Engine (Saves ~£4,200/mo)',
      '2-Way Interactive Twilio SMS & Voice Confirmation',
      'Google My Business "Book Appointment" Button Integration',
      'Supabase RLS Multi-Role Access Control',
      'One-Click Electronic Prescription Sign-Off & EPS',
      'Staff Rota & Clinician Performance Analytics (CSAT/NPS)',
      'Clinical Whiteboard & Real-Time In-Call SOAP Notes',
      'NHS DSPT & UK DPA 2018 Audit Trail'
    ],
    gmbIncluded: true,
    mlNoShowIncluded: true,
    telehealthIncluded: true,
    hipaaGdprDpaIncluded: true,
    nhsEpsIncluded: true
  },
  {
    id: 'enterprise',
    name: 'Health Group & NHS Trust',
    priceMonthlyGbp: 599,
    annualPriceGbp: 5750,
    description: 'For multi-location clinic chains, primary care networks (PCNs) and private hospital groups.',
    maxClinicians: 50,
    maxAppointmentsPerMonth: 25000,
    features: [
      'Unlimited Clinicians & Multi-Site Rota Sync',
      'Custom Machine Learning Model Fine-Tuning',
      'Dedicated Twilio Carrier Trunking & Custom Alphanumeric Sender ID',
      'Full Supabase Dedicated Enterprise Instance & HSM Key Vault',
      'Direct EMIS Web & SystmOne NHS Integration APIs',
      'Custom White-Label Mobile & Web Patient Portal',
      '24/7 Dedicated Clinical SLA & DPO Support',
      'Custom Business Associate Agreement (BAA) & Data Processing Addendum'
    ],
    gmbIncluded: true,
    mlNoShowIncluded: true,
    telehealthIncluded: true,
    hipaaGdprDpaIncluded: true,
    nhsEpsIncluded: true
  }
];
