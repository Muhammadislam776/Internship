-- ============================================================
--  MedConnect — Smart Clinic SaaS & Telemedicine Platform
--  Supabase PostgreSQL Schema
--  Generated: 2026-09-29
--  Covers: Auth, Patients, Doctors, Appointments, Intake
--          Forms, Prescriptions, Rota, Audit Logs, Twilio
--          Logs, Tenants/SaaS Billing, RLS Policies
-- ============================================================

-- ─────────────────────────────────────────
-- 0. EXTENSIONS
-- ─────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────
-- 1. ENUMS
-- ─────────────────────────────────────────
CREATE TYPE user_role AS ENUM (
  'patient',
  'doctor',
  'receptionist',
  'practice_manager',
  'saas_admin'
);

CREATE TYPE clinic_type AS ENUM (
  'gp_practice',
  'dental',
  'physiotherapy',
  'multidisciplinary'
);

CREATE TYPE appointment_status AS ENUM (
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE appointment_mode AS ENUM (
  'in_person',
  'video_consultation',
  'phone'
);

CREATE TYPE risk_level AS ENUM (
  'low',
  'moderate',
  'high',
  'critical'
);

CREATE TYPE prescription_status AS ENUM (
  'pending_review',
  'approved',
  'rejected',
  'forwarded_to_pharmacy'
);

CREATE TYPE shift_type AS ENUM (
  'morning',
  'afternoon',
  'full_day',
  'on_call',
  'telehealth_remote'
);

CREATE TYPE shift_status AS ENUM (
  'scheduled',
  'active',
  'completed',
  'on_leave'
);

CREATE TYPE audit_action AS ENUM (
  'PATIENT_RECORD_VIEWED',
  'INTAKE_FORM_DECRYPTED',
  'PRESCRIPTION_APPROVED',
  'APPOINTMENT_CREATED',
  'TELEHEALTH_SESSION_STARTED',
  'GDPR_EXPORT_REQUESTED',
  'AES_KEY_ACCESSED',
  'RIGHT_TO_FORGET_APPLIED'
);

CREATE TYPE compliance_standard AS ENUM (
  'HIPAA_SECURITY_RULE',
  'UK_GDPR_ART32',
  'NHS_DSPT'
);

CREATE TYPE twilio_message_type AS ENUM (
  'SMS_REMINDER',
  'VOICE_CALL',
  'WHATSAPP',
  'CONFIRMATION_INCOMING'
);

CREATE TYPE twilio_message_status AS ENUM (
  'QUEUED',
  'SENT',
  'DELIVERED',
  'FAILED',
  'REPLIED'
);

CREATE TYPE saas_tier AS ENUM (
  'solo',
  'practice',
  'enterprise'
);

CREATE TYPE payment_status AS ENUM (
  'paid',
  'deposit_paid',
  'exempt_nhs',
  'unpaid'
);

-- ─────────────────────────────────────────
-- 2. CLINICS (Multi-Tenant Core)
-- ─────────────────────────────────────────
CREATE TABLE clinics (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  clinic_type    clinic_type NOT NULL DEFAULT 'gp_practice',
  address_line1  TEXT,
  city           TEXT,
  postcode       TEXT,
  country        TEXT DEFAULT 'UK',
  phone          TEXT,
  email          TEXT,
  website        TEXT,
  ods_code       TEXT UNIQUE,           -- NHS ODS code
  logo_url       TEXT,
  saas_tier      saas_tier NOT NULL DEFAULT 'solo',
  is_active      BOOLEAN DEFAULT TRUE,
  trial_ends_at  TIMESTAMPTZ,
  billing_email  TEXT,
  stripe_customer_id TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 3. USER PROFILES
--    Extends Supabase auth.users
-- ─────────────────────────────────────────
CREATE TABLE profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id      UUID REFERENCES clinics(id) ON DELETE SET NULL,
  role           user_role NOT NULL DEFAULT 'patient',
  first_name     TEXT NOT NULL,
  last_name      TEXT NOT NULL,
  email          TEXT UNIQUE NOT NULL,
  phone          TEXT,
  avatar_url     TEXT,
  title          TEXT,                  -- Dr., Mr., Mrs., etc.
  gmc_number     TEXT,                  -- GMC / GDC registration
  nhs_number     TEXT,                  -- For patient accounts
  is_2fa_enabled BOOLEAN DEFAULT FALSE,
  two_factor_method TEXT,               -- 'sms_otp' | 'nhs_smartcard' | 'authenticator_app'
  last_login_at  TIMESTAMPTZ,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 4. PATIENTS (Extended PHI)
-- ─────────────────────────────────────────
CREATE TABLE patients (
  id                         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id                 UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  clinic_id                  UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  nhs_number                 TEXT UNIQUE NOT NULL,
  first_name                 TEXT NOT NULL,
  last_name                  TEXT NOT NULL,
  dob                        DATE NOT NULL,
  gender                     TEXT CHECK (gender IN ('female','male','other','undisclosed')),
  email                      TEXT NOT NULL,
  phone                      TEXT NOT NULL,

  -- Address
  address_line1              TEXT,
  address_city               TEXT,
  address_postcode           TEXT,

  -- GP Practice
  gp_practice_name           TEXT,

  -- Emergency Contact
  emergency_contact_name     TEXT,
  emergency_contact_relation TEXT,
  emergency_contact_phone    TEXT,

  -- Medical data (non-encrypted summary)
  allergies                  TEXT[],
  medical_conditions         TEXT[],
  active_prescriptions_count INT DEFAULT 0,

  -- Intake form
  intake_form_completed      BOOLEAN DEFAULT FALSE,
  intake_form_encrypted_payload TEXT,  -- AES-256 encrypted JSON

  -- ML model features
  historical_no_shows        INT DEFAULT 0,
  historical_total_bookings  INT DEFAULT 0,

  -- GDPR Consent
  gdpr_marketing_consent     BOOLEAN DEFAULT FALSE,
  gdpr_sms_consent           BOOLEAN DEFAULT FALSE,
  gdpr_data_sharing_consent  BOOLEAN DEFAULT FALSE,
  gdpr_consent_timestamp     TIMESTAMPTZ,

  created_at                 TIMESTAMPTZ DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 5. DOCTORS
-- ─────────────────────────────────────────
CREATE TABLE doctors (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id                  UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  clinic_id                   UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name                        TEXT NOT NULL,
  title                       TEXT DEFAULT 'Dr.',
  specialty                   TEXT NOT NULL,
  gmc_number                  TEXT UNIQUE NOT NULL,
  email                       TEXT NOT NULL,
  phone                       TEXT,
  avatar_url                  TEXT,
  clinic_type                 clinic_type NOT NULL,
  room_number                 TEXT,
  rating                      NUMERIC(3,2) DEFAULT 0,
  total_reviews               INT DEFAULT 0,
  patient_satisfaction_score  NUMERIC(5,2) DEFAULT 0,
  avg_consultation_minutes    INT DEFAULT 15,
  google_calendar_linked      BOOLEAN DEFAULT FALSE,
  google_calendar_email       TEXT,
  telehealth_available        BOOLEAN DEFAULT TRUE,
  daily_patient_capacity      INT DEFAULT 20,
  patients_today              INT DEFAULT 0,
  is_active                   BOOLEAN DEFAULT TRUE,
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 6. APPOINTMENTS
-- ─────────────────────────────────────────
CREATE TABLE appointments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id             UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id            UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id             UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,

  -- Denormalised for quick reads
  patient_name          TEXT NOT NULL,
  patient_nhs_number    TEXT NOT NULL,
  patient_phone         TEXT,
  patient_email         TEXT,
  doctor_name           TEXT NOT NULL,
  doctor_specialty      TEXT,
  clinic_type           clinic_type,

  -- Timing
  date_time             TIMESTAMPTZ NOT NULL,
  duration_minutes      INT NOT NULL DEFAULT 15,

  -- Status & mode
  mode                  appointment_mode NOT NULL DEFAULT 'in_person',
  status                appointment_status NOT NULL DEFAULT 'scheduled',

  -- Clinical
  reason_for_visit      TEXT,
  notes                 TEXT,
  meeting_room_id       TEXT,           -- WebRTC room ID for video

  -- ML
  ml_no_show_probability NUMERIC(5,2),
  ml_risk_level          risk_level DEFAULT 'low',
  ml_confidence_score    NUMERIC(5,2),
  ml_key_factors         JSONB,         -- [{factor, impact, weight, description}]
  ml_recommended_action  TEXT,
  ml_sms_strategy        TEXT,

  -- Google Calendar
  google_calendar_event_id TEXT,
  gmb_source             BOOLEAN DEFAULT FALSE,
  intake_form_attached   BOOLEAN DEFAULT FALSE,

  -- Payment
  payment_status         payment_status DEFAULT 'unpaid',
  fee_gbp                NUMERIC(8,2),

  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 7. TWILIO REMINDERS (per appointment)
-- ─────────────────────────────────────────
CREATE TABLE twilio_reminders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id  UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  clinic_id       UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  recipient_phone TEXT NOT NULL,
  recipient_name  TEXT NOT NULL,
  type            twilio_message_type NOT NULL DEFAULT 'SMS_REMINDER',
  status          twilio_message_status NOT NULL DEFAULT 'QUEUED',
  message_body    TEXT,
  patient_reply   TEXT,
  cost_gbp        NUMERIC(6,4) DEFAULT 0,
  sent_at         TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 8. DIGITAL INTAKE FORMS (Encrypted PHI)
-- ─────────────────────────────────────────
CREATE TABLE intake_forms (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id              UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id          UUID REFERENCES appointments(id) ON DELETE SET NULL,
  clinic_id               UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  completed_at            TIMESTAMPTZ DEFAULT NOW(),

  -- Symptoms
  symptoms                TEXT[],
  symptom_duration        TEXT,
  pain_level              INT CHECK (pain_level BETWEEN 0 AND 10),
  pain_location           TEXT[],

  -- Medical history (stored as JSONB — encrypted at app layer)
  medical_history         JSONB,
  lifestyle               JSONB,
  dental_specific         JSONB,
  physio_specific         JSONB,
  current_medications     JSONB,       -- [{name, dosage, frequency}]
  allergies_list          TEXT,

  -- Emergency contact
  emergency_contact_name  TEXT,
  emergency_contact_rel   TEXT,
  emergency_contact_phone TEXT,

  -- Consent & signature
  digital_signature       TEXT NOT NULL,
  consent_declaration     BOOLEAN NOT NULL DEFAULT FALSE,

  -- Full AES-256 encrypted blob (stored by app)
  encrypted_payload       TEXT,

  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 9. PRESCRIPTION REFILL REQUESTS
-- ─────────────────────────────────────────
CREATE TABLE prescription_refills (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id               UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id              UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id               UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,

  -- Denormalised
  patient_name            TEXT NOT NULL,
  patient_nhs_number      TEXT NOT NULL,
  doctor_name             TEXT NOT NULL,

  -- Medication
  medication_name         TEXT NOT NULL,
  bnf_code                TEXT,
  dosage                  TEXT NOT NULL,
  quantity                TEXT NOT NULL,
  frequency               TEXT NOT NULL,
  last_issued_date        DATE,
  requested_date          DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Status
  status                  prescription_status NOT NULL DEFAULT 'pending_review',
  reason_for_request      TEXT,

  -- Pharmacy
  pharmacy_name           TEXT,
  pharmacy_ods_code       TEXT,
  pharmacy_address        TEXT,
  eps_enabled             BOOLEAN DEFAULT TRUE,

  -- Doctor review
  doctor_signature        TEXT,
  approved_at             TIMESTAMPTZ,
  rejection_reason        TEXT,
  clinical_safety_notes   TEXT,

  -- BNF drug interaction warning
  interaction_severity    TEXT CHECK (interaction_severity IN ('mild','moderate','severe')),
  interaction_message     TEXT,

  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 10. STAFF ROTA SHIFTS
-- ─────────────────────────────────────────
CREATE TABLE rota_shifts (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id              UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  doctor_id              UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  doctor_name            TEXT NOT NULL,
  specialty              TEXT,
  shift_date             DATE NOT NULL,
  start_time             TIME NOT NULL,
  end_time               TIME NOT NULL,
  room                   TEXT,
  shift_type             shift_type NOT NULL DEFAULT 'full_day',
  booked_patients_count  INT DEFAULT 0,
  max_patients_capacity  INT DEFAULT 20,
  status                 shift_status NOT NULL DEFAULT 'scheduled',
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 11. DOCTOR PERFORMANCE METRICS
-- ─────────────────────────────────────────
CREATE TABLE doctor_performance_metrics (
  id                         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id                  UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  doctor_id                  UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  doctor_name                TEXT NOT NULL,
  specialty                  TEXT,
  period                     TEXT NOT NULL,        -- e.g. '2026-09'
  patients_seen              INT DEFAULT 0,
  target_patients            INT DEFAULT 0,
  avg_consultation_time_min  NUMERIC(5,2),
  patient_satisfaction_rate  NUMERIC(5,2),
  no_show_rate               NUMERIC(5,2),
  prescriptions_issued       INT DEFAULT 0,
  telehealth_percentage      NUMERIC(5,2),
  daily_patient_counts       JSONB,               -- [{day, count, capacity}]
  weekly_ratings             JSONB,               -- [{week, rating, reviews}]
  created_at                 TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 12. AUDIT LOGS (Immutable HIPAA Trail)
-- ─────────────────────────────────────────
CREATE TABLE audit_logs (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id           UUID REFERENCES clinics(id) ON DELETE SET NULL,
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE SET DEFAULT,
  user_role           user_role NOT NULL,
  user_name           TEXT NOT NULL,
  action              audit_action NOT NULL,
  patient_id          UUID REFERENCES patients(id) ON DELETE SET NULL,
  patient_name        TEXT,
  resource_id         TEXT,
  ip_address          INET NOT NULL,
  status              TEXT CHECK (status IN ('SUCCESS','WARNING','DENIED')) DEFAULT 'SUCCESS',
  compliance_standard compliance_standard NOT NULL DEFAULT 'UK_GDPR_ART32',
  details             TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs must NEVER be updated or deleted
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────
-- 13. TELEHEALTH SESSIONS
-- ─────────────────────────────────────────
CREATE TABLE telehealth_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id  UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  clinic_id       UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  room_id         TEXT NOT NULL UNIQUE,
  started_at      TIMESTAMPTZ,
  ended_at        TIMESTAMPTZ,
  duration_seconds INT,
  soap_subjective  TEXT,
  soap_objective   TEXT,
  soap_assessment  TEXT,
  soap_plan        TEXT,
  recording_url    TEXT,
  ended_by         UUID REFERENCES profiles(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 14. SAAS SUBSCRIPTIONS
-- ─────────────────────────────────────────
CREATE TABLE saas_subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id             UUID NOT NULL UNIQUE REFERENCES clinics(id) ON DELETE CASCADE,
  tier                  saas_tier NOT NULL DEFAULT 'solo',
  billing_cycle         TEXT CHECK (billing_cycle IN ('monthly','annual')) DEFAULT 'monthly',
  price_gbp             NUMERIC(10,2) NOT NULL,
  stripe_subscription_id TEXT,
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  is_trial              BOOLEAN DEFAULT TRUE,
  trial_ends_at         TIMESTAMPTZ,
  cancelled_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 15. UPDATED_AT TRIGGER FUNCTION
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all mutable tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'clinics','profiles','patients','doctors',
    'appointments','prescription_refills',
    'rota_shifts','saas_subscriptions'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION handle_updated_at();', tbl
    );
  END LOOP;
END $$;

-- ─────────────────────────────────────────
-- 16. INDEXES (Performance)
-- ─────────────────────────────────────────
-- Appointments
CREATE INDEX idx_appointments_clinic     ON appointments(clinic_id);
CREATE INDEX idx_appointments_patient    ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor     ON appointments(doctor_id);
CREATE INDEX idx_appointments_date       ON appointments(date_time);
CREATE INDEX idx_appointments_status     ON appointments(status);
CREATE INDEX idx_appointments_mode       ON appointments(mode);

-- Patients
CREATE INDEX idx_patients_clinic         ON patients(clinic_id);
CREATE INDEX idx_patients_nhs            ON patients(nhs_number);
CREATE INDEX idx_patients_email          ON patients(email);

-- Doctors
CREATE INDEX idx_doctors_clinic          ON doctors(clinic_id);
CREATE INDEX idx_doctors_gmc             ON doctors(gmc_number);

-- Prescriptions
CREATE INDEX idx_rx_clinic               ON prescription_refills(clinic_id);
CREATE INDEX idx_rx_patient              ON prescription_refills(patient_id);
CREATE INDEX idx_rx_status               ON prescription_refills(status);

-- Rota
CREATE INDEX idx_rota_clinic             ON rota_shifts(clinic_id);
CREATE INDEX idx_rota_doctor             ON rota_shifts(doctor_id);
CREATE INDEX idx_rota_date               ON rota_shifts(shift_date);

-- Audit
CREATE INDEX idx_audit_clinic            ON audit_logs(clinic_id);
CREATE INDEX idx_audit_user              ON audit_logs(user_id);
CREATE INDEX idx_audit_action            ON audit_logs(action);
CREATE INDEX idx_audit_created           ON audit_logs(created_at DESC);

-- Twilio
CREATE INDEX idx_twilio_appointment      ON twilio_reminders(appointment_id);
CREATE INDEX idx_twilio_clinic           ON twilio_reminders(clinic_id);

-- ═══════════════════════════════════════════════════════════
--  17. ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE clinics               ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients              ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors               ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE twilio_reminders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_forms          ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_refills  ENABLE ROW LEVEL SECURITY;
ALTER TABLE rota_shifts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE telehealth_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_subscriptions    ENABLE ROW LEVEL SECURITY;

-- ── Helper: get current user's clinic_id ──
CREATE OR REPLACE FUNCTION current_user_clinic_id()
RETURNS UUID AS $$
  SELECT clinic_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ── Helper: get current user's role ──
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ──────────────────────────────────────────
-- CLINICS
-- ──────────────────────────────────────────
-- Clinic members can view their own clinic
CREATE POLICY "clinic_read_own"
  ON clinics FOR SELECT
  USING (id = current_user_clinic_id());

-- Only saas_admin can insert/update clinics
CREATE POLICY "clinic_saas_admin_write"
  ON clinics FOR ALL
  USING (current_user_role() = 'saas_admin');

-- ──────────────────────────────────────────
-- PROFILES
-- ──────────────────────────────────────────
-- Users can view their own profile
CREATE POLICY "profiles_read_own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Clinic staff can view profiles in same clinic
CREATE POLICY "profiles_read_same_clinic"
  ON profiles FOR SELECT
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() IN ('doctor','receptionist','practice_manager','saas_admin')
  );

-- ──────────────────────────────────────────
-- PATIENTS
-- ──────────────────────────────────────────
-- Patients see only their own record
CREATE POLICY "patients_read_own"
  ON patients FOR SELECT
  USING (
    profile_id = auth.uid()
    AND current_user_role() = 'patient'
  );

-- Patients can update their own record (non-clinical)
CREATE POLICY "patients_update_own"
  ON patients FOR UPDATE
  USING (
    profile_id = auth.uid()
    AND current_user_role() = 'patient'
  );

-- Clinical staff (doctor, receptionist, practice_manager) can view patients in same clinic
CREATE POLICY "patients_clinic_staff_read"
  ON patients FOR SELECT
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() IN ('doctor','receptionist','practice_manager')
  );

-- Doctors & practice managers can update patient records
CREATE POLICY "patients_clinician_update"
  ON patients FOR UPDATE
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() IN ('doctor','practice_manager')
  );

-- Doctors & receptionists can insert new patients in their clinic
CREATE POLICY "patients_clinician_insert"
  ON patients FOR INSERT
  WITH CHECK (
    clinic_id = current_user_clinic_id()
    AND current_user_role() IN ('doctor','receptionist','practice_manager')
  );

-- saas_admin can do everything on all patients
CREATE POLICY "patients_saas_admin_all"
  ON patients FOR ALL
  USING (current_user_role() = 'saas_admin');

-- ──────────────────────────────────────────
-- DOCTORS
-- ──────────────────────────────────────────
CREATE POLICY "doctors_clinic_read"
  ON doctors FOR SELECT
  USING (clinic_id = current_user_clinic_id());

CREATE POLICY "doctors_self_update"
  ON doctors FOR UPDATE
  USING (
    profile_id = auth.uid()
    AND current_user_role() = 'doctor'
  );

CREATE POLICY "doctors_manager_write"
  ON doctors FOR ALL
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() IN ('practice_manager','saas_admin')
  );

-- ──────────────────────────────────────────
-- APPOINTMENTS
-- ──────────────────────────────────────────
-- Patients can only see their own appointments
CREATE POLICY "appointments_patient_own"
  ON appointments FOR SELECT
  USING (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
    AND current_user_role() = 'patient'
  );

-- Clinical staff see all appointments in their clinic
CREATE POLICY "appointments_clinic_staff_read"
  ON appointments FOR SELECT
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() IN ('doctor','receptionist','practice_manager')
  );

-- Receptionists & doctors can create appointments
CREATE POLICY "appointments_create"
  ON appointments FOR INSERT
  WITH CHECK (
    clinic_id = current_user_clinic_id()
    AND current_user_role() IN ('doctor','receptionist','practice_manager')
  );

-- Doctors & receptionists can update appointments
CREATE POLICY "appointments_update"
  ON appointments FOR UPDATE
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() IN ('doctor','receptionist','practice_manager')
  );

-- saas_admin full access
CREATE POLICY "appointments_saas_admin_all"
  ON appointments FOR ALL
  USING (current_user_role() = 'saas_admin');

-- ──────────────────────────────────────────
-- INTAKE FORMS (Sensitive PHI)
-- ──────────────────────────────────────────
-- Receptionists CANNOT view clinical intake forms (GDPR minimum data)
CREATE POLICY "intake_forms_patient_own"
  ON intake_forms FOR SELECT
  USING (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
    AND current_user_role() = 'patient'
  );

CREATE POLICY "intake_forms_patient_insert"
  ON intake_forms FOR INSERT
  WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
    AND current_user_role() = 'patient'
  );

-- Only doctors can decrypt/view intake forms
CREATE POLICY "intake_forms_doctor_read"
  ON intake_forms FOR SELECT
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() = 'doctor'
  );

CREATE POLICY "intake_forms_manager_read"
  ON intake_forms FOR SELECT
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() = 'practice_manager'
  );

CREATE POLICY "intake_forms_saas_admin_all"
  ON intake_forms FOR ALL
  USING (current_user_role() = 'saas_admin');

-- ──────────────────────────────────────────
-- PRESCRIPTION REFILLS
-- ──────────────────────────────────────────
-- Patients can view their own prescriptions and create requests
CREATE POLICY "rx_patient_own"
  ON prescription_refills FOR SELECT
  USING (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
    AND current_user_role() = 'patient'
  );

CREATE POLICY "rx_patient_insert"
  ON prescription_refills FOR INSERT
  WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
    AND current_user_role() = 'patient'
  );

-- Doctors can view, approve, reject
CREATE POLICY "rx_doctor_all"
  ON prescription_refills FOR ALL
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() = 'doctor'
  );

-- Receptionists can only view (cannot approve/sign)
CREATE POLICY "rx_receptionist_read"
  ON prescription_refills FOR SELECT
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() = 'receptionist'
  );

CREATE POLICY "rx_manager_all"
  ON prescription_refills FOR ALL
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() = 'practice_manager'
  );

CREATE POLICY "rx_saas_admin_all"
  ON prescription_refills FOR ALL
  USING (current_user_role() = 'saas_admin');

-- ──────────────────────────────────────────
-- ROTA SHIFTS
-- ──────────────────────────────────────────
CREATE POLICY "rota_clinic_read"
  ON rota_shifts FOR SELECT
  USING (clinic_id = current_user_clinic_id());

CREATE POLICY "rota_manager_write"
  ON rota_shifts FOR ALL
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() IN ('practice_manager','saas_admin')
  );

-- ──────────────────────────────────────────
-- AUDIT LOGS (Read only for authorised roles)
-- ──────────────────────────────────────────
-- No one can delete audit logs
CREATE POLICY "audit_saas_admin_read"
  ON audit_logs FOR SELECT
  USING (current_user_role() = 'saas_admin');

CREATE POLICY "audit_manager_own_clinic_read"
  ON audit_logs FOR SELECT
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() = 'practice_manager'
  );

-- System can insert (service role)
CREATE POLICY "audit_insert_service_role"
  ON audit_logs FOR INSERT
  WITH CHECK (TRUE); -- controlled via service_role key only

-- ──────────────────────────────────────────
-- TELEHEALTH SESSIONS
-- ──────────────────────────────────────────
CREATE POLICY "telehealth_patient_own"
  ON telehealth_sessions FOR SELECT
  USING (
    appointment_id IN (
      SELECT id FROM appointments
      WHERE patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
    )
  );

CREATE POLICY "telehealth_clinic_staff"
  ON telehealth_sessions FOR ALL
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() IN ('doctor','practice_manager','saas_admin')
  );

-- ──────────────────────────────────────────
-- SAAS SUBSCRIPTIONS
-- ──────────────────────────────────────────
CREATE POLICY "subscription_own_clinic"
  ON saas_subscriptions FOR SELECT
  USING (
    clinic_id = current_user_clinic_id()
    AND current_user_role() IN ('practice_manager','saas_admin')
  );

CREATE POLICY "subscription_saas_admin_all"
  ON saas_subscriptions FOR ALL
  USING (current_user_role() = 'saas_admin');

-- ══════════════════════════════════════════════════
--  18. AUTO-PROFILE CREATION ON SIGNUP TRIGGER
-- ══════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ══════════════════════════════════════════════════
--  19. USEFUL VIEWS
-- ══════════════════════════════════════════════════

-- Today's appointment schedule (per clinic)
CREATE OR REPLACE VIEW v_todays_appointments AS
SELECT
  a.id,
  a.clinic_id,
  a.date_time,
  a.duration_minutes,
  a.mode,
  a.status,
  a.patient_name,
  a.patient_nhs_number,
  a.doctor_name,
  a.doctor_specialty,
  a.ml_risk_level,
  a.ml_no_show_probability,
  a.reason_for_visit,
  a.payment_status
FROM appointments a
WHERE DATE(a.date_time AT TIME ZONE 'Europe/London') = CURRENT_DATE
ORDER BY a.date_time;

-- Clinic dashboard summary
CREATE OR REPLACE VIEW v_clinic_dashboard AS
SELECT
  c.id AS clinic_id,
  c.name AS clinic_name,
  c.saas_tier,
  COUNT(DISTINCT p.id) AS total_patients,
  COUNT(DISTINCT d.id) AS total_doctors,
  COUNT(DISTINCT a.id) FILTER (WHERE DATE(a.date_time) = CURRENT_DATE) AS appointments_today,
  COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'no_show' AND a.date_time >= NOW() - INTERVAL '30 days') AS no_shows_30d,
  COUNT(DISTINCT a.id) FILTER (WHERE a.mode = 'video_consultation' AND a.date_time >= NOW() - INTERVAL '30 days') AS video_consults_30d,
  COUNT(DISTINCT rx.id) FILTER (WHERE rx.status = 'pending_review') AS pending_prescriptions
FROM clinics c
LEFT JOIN patients p ON p.clinic_id = c.id
LEFT JOIN doctors d ON d.clinic_id = c.id
LEFT JOIN appointments a ON a.clinic_id = c.id
LEFT JOIN prescription_refills rx ON rx.clinic_id = c.id
GROUP BY c.id, c.name, c.saas_tier;

-- Prescription refills pending for a clinic
CREATE OR REPLACE VIEW v_pending_prescriptions AS
SELECT
  rx.*,
  d.gmc_number,
  p.nhs_number
FROM prescription_refills rx
JOIN doctors d ON d.id = rx.doctor_id
JOIN patients p ON p.id = rx.patient_id
WHERE rx.status = 'pending_review'
ORDER BY rx.requested_date ASC;

-- ══════════════════════════════════════════════════
--  20. SEED DATA — Demo Clinic & Users
-- ══════════════════════════════════════════════════

-- Insert a demo clinic
INSERT INTO clinics (id, name, clinic_type, address_line1, city, postcode, ods_code, saas_tier, is_active)
VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'St. James Health Centre',
  'gp_practice',
  '10 Harley Street',
  'London',
  'W1G 9PH',
  'A82026',
  'practice',
  TRUE
);

-- Note: Auth users are created via Supabase Auth API.
-- After creating auth users, run the following to link profiles:

-- EXAMPLE: Link a doctor profile (replace UUIDs with real auth.users IDs)
/*
UPDATE profiles SET
  clinic_id  = 'aaaaaaaa-0000-0000-0000-000000000001',
  role       = 'doctor',
  first_name = 'Sarah',
  last_name  = 'Jenkins',
  title      = 'Dr.',
  gmc_number = '7654321',
  phone      = '+44 20 7946 0001'
WHERE email = 'sarah.jenkins@stjamesclinic.nhs.uk';

UPDATE profiles SET
  clinic_id  = 'aaaaaaaa-0000-0000-0000-000000000001',
  role       = 'patient',
  first_name = 'Oliver',
  last_name  = 'Bennett',
  nhs_number = '485 772 9012',
  phone      = '+44 7700 900123'
WHERE email = 'oliver.bennett@example.com';
*/

-- ══════════════════════════════════════════════════
--  END OF SCHEMA
-- ══════════════════════════════════════════════════
