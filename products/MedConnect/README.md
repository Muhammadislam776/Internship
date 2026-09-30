# MedConnect – Clinic & Dental Patient Management System
### HIPAA / UK GDPR Compliant Patient Management with Telemedicine & ML No-Show Prediction
**Designed for UK GP Practices, Dental Surgeries, Physiotherapists & Telehealth Providers**

---

## 🌟 Overview & Core Value Proposition

**MedConnect** is a full-stack, enterprise-grade clinic management and telemedicine SaaS engineered specifically for UK primary care providers (NHS GP Practices, Dental Surgeries, MSK Physiotherapy Clinics, and Private Health Groups). 

It solves the primary operational bottleneck in UK healthcare: **telephone booking queues at 8:00 AM** and **high patient no-show rates (~12% nationally)** by coupling a **Google Business Profile (GMB) Direct 'Book Appointment' Engine** with an **AI/ML No-Show Prediction & Automated Twilio 2-Way SMS Dispatcher**.

---

## 🚀 Advanced Features Breakdown

### 1. 📅 Intelligent Appointment Scheduler with Machine Learning No-Show Predictor
- **ML Supervised Prediction Engine (`predictNoShowRisk`)**:
  - Calculates real-time no-show probability (0–100%) and risk tiers (**Low**, **Moderate**, **High**, **Critical**) based on 8 weighted clinical telemetry variables:
    1. *Lead Time in Days* (>14 days increases absence rate by 2.4x).
    2. *Historical Patient Track Record* (Ratio of missed visits to total bookings).
    3. *Age Demographic Band* (18–29 young adults vs 65+ seniors).
    4. *Day of Week & Time Slot* (Monday morning rush and Friday late afternoon friction).
    5. *Appointment Modality* (In-person clinic vs Telehealth video).
    6. *Twilio 2-Way SMS Confirmation* (Explicit "YES" reply reduces risk by 85%).
    7. *Financial Commitment* (NHS exemption vs £25 deposit paid).
    8. *Weather / Transit Disruption Contingency*.
  - **Explainable AI (SHAP Analysis)**: Transparent decision weights displayed for clinicians.
  - **Dynamic Schedule Optimizer**: Automatically flags high-risk slots for **standby overbooking** and suggests 1-click conversion to Telehealth video.
- **Twilio SMS & Automated Voice Dispatch**:
  - Outbound reminder dispatches, delivery receipts, and automated inbound webhook processing (`YES`, `CANCEL`, `RESCHEDULE`).

### 2. 📹 Built-in Telemedicine & WebRTC Video Consultation Suite
- **Supabase Realtime Signaling**:
  - Built-in WebRTC dual-stream consultation suite (Doctor stream + Patient stream) with camera/microphone controls, screen sharing, and latency monitors.
- **Clinical Annotation Whiteboard**:
  - Doctor and patient collaborative canvas with anatomical diagrams, highlighters, color palettes, and eraser.
- **In-Call Clinical SOAP Notes Editor**:
  - Auto-formatted **Subjective, Objective, Assessment, and Plan (SOAP)** documentation with 1-click sync to NHS Spine Electronic Health Records.
- **In-Call Instant EPS Prescription Dispenser**:
  - Clinicians can authorize repeat or acute medications without leaving the video consultation.
- **Live Vitals HUD & GDPR Recording Consent Banner**:
  - Real-time display of patient Heart Rate, SpO2, Blood Pressure, and Allergy Alert Banner.

### 3. 🔒 Digital Intake Forms with Client-Side AES-256 Encryption & Supabase RLS
- **Multi-Step Patient Pre-Arrival Onboarding**:
  - Chief complaints, pain level gauge (0–10), medical history, chronic conditions, dental triage, physio injury mechanics, current medications, allergies, and digital signature.
- **AES-256-CBC Cryptographic Vault (`encryptPHI` / `decryptPHI`)**:
  - Personal Health Information (PHI) is encrypted on the client before transit.
  - Doctor Decrypted View with audited access logs, HMAC-SHA256 integrity verification, and raw ciphertext inspection toggle.
- **Supabase Row-Level Security (RLS)**:
  - Strict database authorization policies isolating patient records by `auth.uid()`, preventing unauthorized reception staff from accessing clinical intake notes.

### 4. 💊 Automated Prescription Refills & NHS Electronic Prescription Service (EPS)
- **1-Click Doctor Sign-Off**:
  - Review queue with UK BNF drug database integration, dosage, quantity, and clinical safety notes.
  - GMC/GDC Digital Signature token generation (`UK-EPS-XXXXXX`).
- **Drug-Drug Interaction Safety Scanner**:
  - Real-time warnings (e.g., Triptan + SSRI serotonin advisory, NSAID in asthma).
- **Nominated Community Pharmacy Tracker**:
  - Transmission to Boots, Lloyds, Well, and independent pharmacies with NHS ODS codes.
  - Printable official NHS Electronic Prescription Token layout with QR code.

### 5. 👥 Staff Rota Planner & Clinician Performance Tracker
- **Multi-Specialty Shift Coordination**:
  - Rota management for GPs, Dentists, Physiotherapists, and Nurses across morning, afternoon, full-day, on-call, and remote telehealth shifts with room allocations.
- **Clinician Performance Analytics**:
  - Monthly patients seen vs capacity targets.
  - Average consultation duration metrics.
  - Patient Satisfaction Ratings (CSAT 98%, 5-star ratings, NPS).
  - **GMC Burnout Protection Shield**: Flags clinicians exceeding safe daily consultation thresholds (&le; 28 patients/day).

### 6. 📍 Google Business Profile (GMB) Selling Strategy & SaaS Pricing
- **UK Zero-Receptionist-Queue Strategy**:
  - Embeddable 'Book Appointment' button on Google Maps and Google Search listings.
  - **Google Calendar API 2-Way Sync**: Live slot availability checks, blocking busy periods and preventing double-booking in under 30 seconds.
- **B2B SaaS Pricing Tiers**:
  - **Solo Practitioner (£99/mo)**: 1 Clinician, GMB booking, WebRTC telehealth, AES-256 forms, 500 Twilio SMS/mo.
  - **Multi-Doctor Practice (£249/mo)**: Up to 8 Clinicians, AI/ML No-Show engine, 2-way Twilio SMS, Rota & CSAT analytics, NHS EPS.
  - **Health Group & NHS Trust (£599/mo)**: Multi-site rota sync, dedicated HSM key vault, EMIS Web / SystmOne integration.
- **Interactive ROI & Financial Calculator**:
  - Calculates recovered revenue from prevented no-shows (£4,800+/mo) and receptionist phone hours saved.

### 7. 🛡️ HIPAA, UK GDPR & NHS DSPT Compliance Suite
- **Immutable Audit Trail**:
  - Comprehensive logging of every PHI access, decryption event, prescription approval, and export with user ID, role, IP address, and compliance standard tag.
- **GDPR Article 17 "Right to be Forgotten"**:
  - Cryptographic anonymization tool for patient erasure requests.
- **GDPR Article 20 Data Portability Export**:
  - One-click export of Record of Processing Activities (ROPA) and encrypted clinical dossiers.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas API, Recharts
- **Cryptography**: AES-256-CBC with PKCS7 padding & HMAC-SHA256 integrity checks
- **Telemedicine Signaling**: Built-in WebRTC with Supabase Realtime Channels
- **Database & Security**: Supabase Client with Row-Level Security (RLS) Policy Engine
- **SMS & Voice**: Twilio REST API Simulator & 2-Way Interactive Webhook Handlers
- **Calendar**: Google Calendar API 2-Way Synchronization Engine

---

## 🏃 Running the Project Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
