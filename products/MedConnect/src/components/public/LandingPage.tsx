import React, { useState } from 'react';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import {
  Calendar,
  Video,
  FileText,
  Pill,
  Users,
  MessageSquare,
  ShieldCheck,
  Zap,
  Check,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Activity,
  Lock,
  CheckCircle2,
  TrendingDown,
  Smile,
  Star,
  Database,
  Heart,
  Award,
  BarChart3
} from 'lucide-react';


interface LandingPageProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Public Header */}
      <PublicHeader
        onOpenAuth={onOpenAuth}
      />


      {/* ═══════════════════════════════════════ */}
      {/* 1. HERO SECTION                         */}
      {/* ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-14 pb-24 lg:pt-20 lg:pb-32">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-100 to-amber-50 opacity-60 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-100 to-sky-50 opacity-50 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-orange-50/40 via-white to-blue-50/40 blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">

            {/* ── Left Content ── */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-orange-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Smart Healthcare SaaS for UK Clinics</span>
                <span className="ml-1 px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-extrabold">NEW</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Smart Clinic Operations &{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                    Telemedicine
                  </span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange-100 rounded-full -z-0" />
                </span>{' '}
                in One Unified Platform
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Streamline patient scheduling with ML no-show risk prediction, conduct encrypted HD video consultations, automate Twilio SMS reminders, and manage NHS EPS repeat prescriptions — all in one place.
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 py-2">
                {[
                  { value: '68%', label: 'Fewer No-Shows', color: 'text-orange-600' },
                  { value: '4.9★', label: 'Average Rating', color: 'text-amber-600' },
                  { value: '500+', label: 'UK Clinics', color: 'text-blue-600' },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center lg:items-start">
                    <span className={`text-2xl font-extrabold ${s.color}`}>{s.value}</span>
                    <span className="text-xs text-slate-500 font-medium">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-xl shadow-orange-300/50 hover:shadow-orange-400/50 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onOpenAuth('login')}
                  className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border-2 border-slate-200 hover:border-orange-300 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In to Your Clinic</span>
                </button>
              </div>


            </div>

            {/* ── Right: Clinic Dashboard Card ── */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Floating tag — top left */}
                <div className="absolute -top-4 -left-4 z-20 bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-orange-300/40">
                  🔴 Live Dashboard
                </div>

                {/* Main card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
                  {/* Subtle card gradient */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-orange-50/60 to-transparent rounded-3xl pointer-events-none" />

                  {/* Card header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-200">
                        <Activity className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">St. James Health Centre</h4>
                        <p className="text-[11px] text-slate-400">London W1 • Live Telemetry</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>

                  {/* Metric cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/50 border border-orange-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-orange-700">No-Show Rate</span>
                        <TrendingDown className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      <div className="text-2xl font-black text-orange-600">4.2%</div>
                      <div className="text-[10px] text-orange-500 font-medium mt-0.5">↓ 68% vs. last quarter</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-emerald-700">Patient CSAT</span>
                        <Smile className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div className="text-2xl font-black text-emerald-600">98.4%</div>
                      <div className="text-[10px] text-emerald-500 font-medium mt-0.5">4.9/5.0 reviews</div>
                    </div>
                  </div>

                  {/* Live queue item */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">Current in Queue</span>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-orange-100 text-orange-700">09:30 AM</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        OB
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">Oliver Bennett</div>
                        <div className="text-[10px] text-slate-500">Video Call • Dr. Jenkins</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 shrink-0">
                        Low Risk
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70 text-[10px]">
                      <span className="text-slate-500">✓ Twilio SMS Delivered</span>
                      <span className="text-orange-600 font-bold cursor-pointer hover:underline">1-Click Join →</span>
                    </div>
                  </div>

                  {/* Security badges */}
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-orange-400" />
                      AES-256 Encrypted
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Database className="w-3 h-3 text-orange-400" />
                      GDPR RLS Active
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-orange-400" />
                      NHS EPS R2
                    </span>
                  </div>
                </div>

                {/* Floating mini badge — bottom */}
                <div className="absolute -bottom-3 right-6 z-20 bg-white rounded-xl border border-orange-100 shadow-lg px-3.5 py-2 flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {['bg-blue-400', 'bg-emerald-400', 'bg-orange-400', 'bg-purple-400'].map((c, i) => (
                      <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-white`} />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">500+ active clinics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 2. TRUST BAR                            */}
      {/* ═══════════════════════════════════════ */}
      <section className="py-10 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: <ShieldCheck className="w-6 h-6" />, title: 'UK GDPR Art 32', sub: 'End-to-end PHI encryption' },
              { icon: <Pill className="w-6 h-6" />, title: 'NHS EPS Release 2', sub: 'Electronic repeat prescriptions' },
              { icon: <Lock className="w-6 h-6" />, title: 'AES-256 Vault', sub: 'Encrypted clinical notes' },
              { icon: <Database className="w-6 h-6" />, title: 'Multi-Tenant RLS', sub: 'Strict clinic isolation' },
            ].map((b) => (
              <div key={b.title} className="space-y-1.5">
                <div className="flex justify-center text-white/90">{b.icon}</div>
                <h4 className="text-sm font-bold">{b.title}</h4>
                <p className="text-xs text-orange-100">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 3. CORE FEATURES GRID                   */}
      {/* ═══════════════════════════════════════ */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
              <Zap className="w-3.5 h-3.5" />
              Enterprise Feature Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Everything Your Practice Needs —{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">One Platform</span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Eliminate disjointed tools. ClinicFlow brings appointments, telemedicine, prescriptions, rota management, and patient communication into one intuitive system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Calendar className="w-5 h-5" />, title: 'Intelligent Scheduling', desc: 'Multi-clinician booking with Google Calendar 2-way sync and custom slot durations.', color: 'bg-blue-50 text-blue-600', border: 'hover:border-blue-300' },
              { icon: <Zap className="w-5 h-5" />, title: 'ML No-Show Predictor', desc: 'Supervised risk engine scores attendance probability (Low/Medium/High) to prevent revenue loss.', color: 'bg-orange-50 text-orange-600', border: 'hover:border-orange-300' },
              { icon: <Video className="w-5 h-5" />, title: 'HD WebRTC Telehealth', desc: 'Encrypted virtual consultation rooms with live SOAP note documentation and instant prescription dispatch.', color: 'bg-indigo-50 text-indigo-600', border: 'hover:border-indigo-300' },
              { icon: <FileText className="w-5 h-5" />, title: 'Digital Intake Forms', desc: 'Self-service patient onboarding forms encrypted AES-256 before storing to Supabase.', color: 'bg-emerald-50 text-emerald-600', border: 'hover:border-emerald-300' },
              { icon: <Pill className="w-5 h-5" />, title: 'EPS Repeat Refills', desc: '1-click doctor sign-off with BNF drug verification and NHS EPS pharmacy routing.', color: 'bg-rose-50 text-rose-600', border: 'hover:border-rose-300' },
              { icon: <Users className="w-5 h-5" />, title: 'Staff Rota & Utilization', desc: 'Real-time clinician shifts, room assignments, capacity trackers, and CSAT performance.', color: 'bg-teal-50 text-teal-600', border: 'hover:border-teal-300' },
              { icon: <MessageSquare className="w-5 h-5" />, title: 'Twilio SMS Reminders', desc: 'Automated 24h & 2h confirmations with two-way patient replies to confirm or cancel.', color: 'bg-cyan-50 text-cyan-600', border: 'hover:border-cyan-300' },
              { icon: <ShieldCheck className="w-5 h-5" />, title: 'Multi-Clinic Tenancy', desc: 'SuperAdmin tenant management, full audit logging, DPO erasure tools, and custom branding.', color: 'bg-purple-50 text-purple-600', border: 'hover:border-purple-300' },
            ].map((f) => (
              <div
                key={f.title}
                className={`bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md ${f.border} transition-all group space-y-3`}
              >
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center`}>
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-800">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 4. TELEMEDICINE SPOTLIGHT               */}
      {/* ═══════════════════════════════════════ */}
      <section id="telemedicine" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">

            {/* Left */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                <Video className="w-3.5 h-3.5" />
                Encrypted Virtual Consultations
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                WebRTC Video Consultations with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Built-In Clinical SOAP Notes</span>
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Deliver seamless telehealth without third-party apps. Patients receive a secure one-click link via SMS and join directly in their mobile browser — no downloads needed.
              </p>

              <div className="space-y-3.5 text-sm text-slate-700">
                {[
                  'Interactive Subjective, Objective, Assessment, Plan (SOAP) clinical note taking',
                  'Real-time consultation timer and end-to-end session encryption badge',
                  'Direct 1-click prescription creation during active consultation',
                  'AI-assisted triage summary generated before the session begins',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onOpenAuth('register')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-lg shadow-orange-200 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Start Free Trial Today</span>
              </button>
            </div>

            {/* Right — video mock */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4 border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>Telehealth: #apt_001 — Dr. Jenkins</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    09:42 min
                  </span>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"
                    alt="Doctor Telehealth Preview"
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-white border border-slate-700">
                    Dr. Sarah Jenkins (GP Lead)
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-orange-500/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    ENCRYPTED
                  </div>
                  <div className="absolute bottom-3 right-3 w-28 h-20 rounded-xl overflow-hidden border-2 border-orange-400 shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300"
                      alt="Patient Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5">
                  <div className="font-semibold text-orange-400">Active Patient: Oliver Bennett (NHS 485 772 9012)</div>
                  <p className="text-slate-400 text-[11px]">Primary Complaint: Recurring hypertension & asthma review. SOAP notes auto-saved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 5. SPECIALTY SOLUTIONS                  */}
      {/* ═══════════════════════════════════════ */}
      <section id="solutions" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
              <Heart className="w-3.5 h-3.5" />
              Tailored for Every Specialty
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Customized Clinical Workflows</h2>
            <p className="text-slate-600 text-base">
              Whether you run an NHS GP surgery, dental practice, or physiotherapy clinic, ClinicFlow adapts to your forms and scheduling logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Stethoscope className="w-6 h-6" />,
                color: 'bg-gradient-to-br from-blue-50 to-sky-100 text-blue-600',
                border: 'border-blue-100 hover:border-blue-300',
                title: 'GP Practices & Surgeries',
                desc: 'Full NHS Spine EPS R2 integration, BNF medication safety warnings, chronic disease management, and emergency registers.',
                items: ['NHS number validation', 'SOAP clinical note taking', 'Repeat prescription sign-off'],
                checkColor: 'text-blue-600',
              },
              {
                icon: <Activity className="w-6 h-6" />,
                color: 'bg-gradient-to-br from-orange-50 to-amber-100 text-orange-600',
                border: 'border-orange-100 hover:border-orange-300',
                title: 'Dental & Orthodontics',
                desc: 'Specialized dental intake including tooth sensitivity, bleeding gums, bruxism, and comprehensive dental history tracking.',
                items: ['Dental hygiene checklist', 'Emergency slot reservations', 'Deposit & cancellation policies'],
                checkColor: 'text-orange-600',
              },
              {
                icon: <Users className="w-6 h-6" />,
                color: 'bg-gradient-to-br from-purple-50 to-violet-100 text-purple-600',
                border: 'border-purple-100 hover:border-purple-300',
                title: 'MSK Physiotherapy',
                desc: 'Comprehensive musculoskeletal injury mechanisms, pain location tags, aggravating factors, and personalised rehab plans.',
                items: ['Interactive pain level scaling (1–10)', 'Rehabilitation progress tracking', 'Remote video posture evaluations'],
                checkColor: 'text-purple-600',
              },
            ].map((s) => (
              <div key={s.title} className={`bg-white p-7 rounded-2xl border ${s.border} shadow-sm hover:shadow-lg transition-all space-y-4`}>
                <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center`}>
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className={`w-4 h-4 ${s.checkColor}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 6. PRICING                              */}
      {/* ═══════════════════════════════════════ */}
      <section id="pricing" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
              <BarChart3 className="w-3.5 h-3.5" />
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Simple Plans for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Every Clinic Size</span>
            </h2>
            <p className="text-slate-600 text-base">
              No hidden booking commissions. All plans include automated Twilio SMS and GDPR-ready encryption.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 mt-2">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'monthly' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                Annual
                <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-extrabold">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Solo */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col">
              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Solo Practitioner</h3>
                <p className="text-xs text-slate-500">Ideal for independent doctors, therapists, and solo private consultants.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">£{billingCycle === 'annual' ? '39' : '49'}</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
                  {['1 Clinician Account', 'Up to 300 Appointments/mo', 'HD WebRTC Telemedicine', 'Automated Twilio SMS Reminders', 'AES-256 Intake Encryption'].map((f) => (
                    <li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />{f}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full py-3 rounded-xl border-2 border-orange-400 text-orange-600 hover:bg-orange-50 font-bold text-xs transition-all"
                >
                  Start 14-Day Trial
                </button>
              </div>
            </div>

            {/* Practice — Most Popular */}
            <div className="bg-white p-7 rounded-2xl border-2 border-orange-500 shadow-xl relative flex flex-col">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-orange-200 whitespace-nowrap">
                ⭐ Most Popular for UK Practices
              </div>

              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Growing Practice</h3>
                <p className="text-xs text-slate-500">Perfect for multi-doctor surgeries, dental practices, and MSK clinics.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">£{billingCycle === 'annual' ? '119' : '149'}</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-orange-100">
                  {[
                    'Up to 10 Clinicians + Unlimited Staff',
                    'Unlimited Patient Appointments',
                    'ML No-Show Prediction Engine',
                    'NHS EPS R2 Repeat Prescriptions',
                    'Staff Rota & Capacity Manager',
                    'Google Calendar 2-Way Sync',
                  ].map((f, i) => (
                    <li key={f} className={`flex items-center gap-2 ${i === 0 ? 'font-semibold text-slate-900' : ''}`}>
                      <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-200 transition-all"
                >
                  Start 14-Day Free Trial
                </button>
              </div>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col">
              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Multi-Clinic Enterprise</h3>
                <p className="text-xs text-slate-500">For healthcare trusts, polyclinics, and multi-site healthcare groups.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">£{billingCycle === 'annual' ? '319' : '399'}</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
                  {[
                    'Unlimited Clinicians & Multi-Tenancy',
                    'Dedicated Supabase Schema & KMS Vault',
                    'Custom Domain & Whitelabel Branding',
                    'Enterprise DPA & GDPR DPO Support',
                    '99.99% Uptime SLA & 24/7 Support',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />{f}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-800 hover:bg-slate-50 font-bold text-xs transition-all"
                >
                  Contact Enterprise Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 7. SOCIAL PROOF / TESTIMONIALS          */}
      {/* ═══════════════════════════════════════ */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
              ))}
            </div>
            <p className="text-sm font-semibold text-slate-500">Trusted by 500+ UK Healthcare Professionals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "ClinicFlow cut our no-show rate from 22% to under 5% in three months. The Twilio SMS automation is a game-changer for our surgery.",
                name: 'Dr. Emily Hartley',
                title: 'GP Partner, Northfield Medical Centre, Birmingham',
                avatar: 'EH',
                color: 'bg-blue-500',
              },
              {
                quote: "We run 4 dental sites and the multi-tenant dashboard gives us a live view of every clinic. Absolutely recommend for any growing practice.",
                name: 'James O\'Connor',
                title: 'Practice Director, SmileFirst Dental Group, Manchester',
                avatar: 'JO',
                color: 'bg-orange-500',
              },
              {
                quote: "The video consultation room is brilliant. Our physio patients love being able to join from their phone without downloading anything.",
                name: 'Sarah Okafor, MSc',
                title: 'Lead Physiotherapist, ActiveLife MSK Clinic, London',
                avatar: 'SO',
                color: 'bg-emerald-500',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <div className={`w-9 h-9 rounded-full ${t.color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{t.name}</div>
                    <div className="text-[10px] text-slate-500">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 8. BOTTOM CTA BANNER                    */}
      {/* ═══════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Award className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Transform Your Clinic?
          </h2>
          <p className="text-orange-100 text-base max-w-2xl mx-auto leading-relaxed">
            Join 500+ UK medical professionals who use ClinicFlow to eliminate no-shows, save admin hours, and deliver world-class telehealth — starting from just £49/month.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-8 py-4 bg-white text-orange-600 hover:bg-orange-50 font-bold text-sm rounded-xl shadow-xl transition-all flex items-center gap-2 group"
            >
              <span>Start Free 14-Day Trial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            </div>
          <p className="text-xs text-orange-200">No credit card required • Cancel anytime • UK GDPR compliant</p>
        </div>
      </section>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
};
