import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Video,
  Pill,
  Calendar,
  Lock,
  ChevronDown,
  ChevronUp,
  Send,
  ExternalLink,
  Sparkles,
  LifeBuoy,
  FileText,
  Mail,
  Clock,
  ArrowRight,
  Headphones,
  Check,
  Info
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'clinical' | 'prescriptions' | 'scheduling' | 'security' | 'general';
  question: string;
  answer: string;
  badge?: string;
}

export const HelpSupportView: React.FC = () => {
  const { showToast, setActiveTab } = useApp();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Support Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'clinical' | 'technical' | 'prescriptions' | 'compliance'>('clinical');
  const [ticketUrgency, setTicketUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [submittedTickets, setSubmittedTickets] = useState<Array<{ id: string; subject: string; status: string; date: string; urgency: string }>>([
    {
      id: 'TICK-9042',
      subject: 'Nominated EPS Boots pharmacy token query',
      status: 'Resolved',
      date: 'Yesterday, 14:22',
      urgency: 'medium'
    },
    {
      id: 'TICK-9018',
      subject: 'Google Calendar 2-way sync webhook confirmation',
      status: 'Resolved',
      date: '24 Sep 2026',
      urgency: 'low'
    }
  ]);

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'prescriptions',
      badge: 'NHS EPS R2',
      question: 'How do I digitally authorize an NHS EPS Release 2 prescription?',
      answer: 'Navigate to "Prescription Requests" under the Clinical sidebar. Review the requested medication dosage and BNF formulary code. Click "Authorize & Sign EPS". The system will append your GMC credentials, generate an encrypted Electronic Prescription Service (EPS) Release 2 token, and transmit the order directly to the patient\'s nominated pharmacy (e.g. Boots, Well Pharmacy) with an automated Twilio SMS alert.'
    },
    {
      id: 'faq-2',
      category: 'clinical',
      badge: 'Telemedicine',
      question: 'What should I do if a patient\'s camera or microphone is not working in Video Consultations?',
      answer: 'ClinicFlow Telehealth uses WebRTC with automated fallback. Verify that your browser has granted permission for camera and microphone access. If the patient has hardware limitations, the consultation room provides an interactive SOAP notes clinical documentation panel, an in-call chat, and a synchronized anatomical whiteboard so you can continue the consultation smoothly.'
    },
    {
      id: 'faq-3',
      category: 'scheduling',
      badge: 'Google Sync',
      question: 'How does 2-Way Google Calendar synchronization work?',
      answer: 'When an appointment is scheduled or rescheduled in ClinicFlow, our Google Calendar API integration immediately creates or updates the event in your primary Google Calendar with video room links, patient reference IDs, and ML risk summaries. Changes made in the clinic calendar reflect within milliseconds.'
    },
    {
      id: 'faq-4',
      category: 'security',
      badge: 'UK GDPR Art 32',
      question: 'How is patient medical history and intake data encrypted?',
      answer: 'All pre-arrival digital intake questionnaires are encrypted client-side using AES-256-CBC with PKCS7 padding and HMAC-SHA256 integrity checksums before transmission to the database. Only clinicians with active GMC/NMC smartcard authorization keys can decrypt and inspect full Clinical Notes and Personal Health Information (PHI).'
    },
    {
      id: 'faq-5',
      category: 'scheduling',
      badge: 'ML AI Engine',
      question: 'How is the No-Show Risk probability calculated for appointments?',
      answer: 'The ML No-Show Risk engine evaluates 8 clinical parameters: appointment lead time, patient age, past attendance history, day of the week, consultation mode (in-person vs telehealth), clinic specialty, whether Twilio SMS confirmation was completed, and deposit payment status. High-risk patients automatically receive priority 2-way SMS check-ins.'
    },
    {
      id: 'faq-6',
      category: 'security',
      badge: 'Audit & Compliance',
      question: 'Where can I find compliance audit logs for CQC or ICO inspections?',
      answer: 'Go to "Audit & Compliance" under Insights in the sidebar. This ledger records every PHI decryption, appointment creation, prescription signing, and GDPR Article 17 Right to Erasure event with timestamps, actor IDs, IP addresses, and compliance standards (UK GDPR Art 32, HIPAA Security Rule, NHS DSPT).'
    },
    {
      id: 'faq-7',
      category: 'general',
      badge: 'Support',
      question: 'How quickly does the ClinicFlow IT & Clinical Operations team respond?',
      answer: 'For GMC/GDC registered clinicians, critical clinical blockers have a guaranteed sub-15 minute response time via our 24/7 Clinical Hotline (+44 20 7946 0912). Standard help tickets submitted through this portal are typically answered within 2 to 4 hours.'
    }
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCat = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (faq.badge || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showToast('error', 'Missing Information', 'Please provide a subject and details for your ticket.');
      return;
    }

    setIsSubmittingTicket(true);
    setTimeout(() => {
      const newTicketId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedTickets((prev) => [
        {
          id: newTicketId,
          subject: ticketSubject.trim(),
          status: 'Under Review',
          date: 'Just now',
          urgency: ticketUrgency
        },
        ...prev
      ]);

      showToast(
        'success',
        'Support Ticket Created',
        `Reference #${newTicketId} logged. Clinical Operations will respond shortly.`
      );

      setTicketSubject('');
      setTicketMessage('');
      setIsSubmittingTicket(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* ── Top Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold mb-3">
            <LifeBuoy className="w-3.5 h-3.5 text-blue-200" />
            <span>ClinicFlow Knowledge Base & 24/7 Clinician Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How can we assist your practice today?
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Search clinical operation guides, NHS EPS Release 2 workflows, WebRTC telehealth troubleshooting, and compliance documentation.
          </p>

          {/* Search Bar */}
          <div className="relative mt-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, e.g. 'Prescription EPS', 'WebRTC camera', 'GDPR encryption'..."
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Quick System Status Bar ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-900">All Core Systems Operational</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>NHS Spine Gateway: <strong className="text-slate-900 font-mono">Online</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>EPS Release 2: <strong className="text-slate-900 font-mono">99.98%</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Twilio 2-Way SMS: <strong className="text-slate-900 font-mono">Delivering</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Average Ticket Response: <strong className="text-slate-900">~8 mins</strong></span>
          </div>
        </div>
      </div>

      {/* ── Quick Topic Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => { setSelectedCategory('clinical'); setSearchQuery(''); }}
          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md p-4 rounded-2xl text-left transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit mb-3 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            Telehealth & Video
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Camera and audio permissions, SOAP clinical note syncing, and whiteboard guides.
          </p>
        </button>

        <button
          onClick={() => { setSelectedCategory('prescriptions'); setSearchQuery(''); }}
          className="bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md p-4 rounded-2xl text-left transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 w-fit mb-3 group-hover:scale-105 transition-transform">
            <Pill className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
            EPS Prescriptions
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            GMC digital smartcard authorization, BNF formulary checks, and pharmacy routing.
          </p>
        </button>

        <button
          onClick={() => { setSelectedCategory('scheduling'); setSearchQuery(''); }}
          className="bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md p-4 rounded-2xl text-left transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 w-fit mb-3 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            Diary & Google Sync
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Calendar view, slot booking, ML no-show risk mitigation, and automated SMS.
          </p>
        </button>

        <button
          onClick={() => { setSelectedCategory('security'); setSearchQuery(''); }}
          className="bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md p-4 rounded-2xl text-left transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 w-fit mb-3 group-hover:scale-105 transition-transform">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
            Security & UK GDPR
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            AES-256 vault encryption, audit log exports, and Article 17 Right to Erasure.
          </p>
        </button>
      </div>

      {/* ── Main Layout: FAQs on Left, Support Ticket & Direct Lines on Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Knowledge Base (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Frequently Asked Clinical Questions
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'All' },
                { id: 'clinical', label: 'Clinical' },
                { id: 'prescriptions', label: 'EPS' },
                { id: 'scheduling', label: 'Diary' },
                { id: 'security', label: 'GDPR' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === c.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No matching guides found</p>
                <p className="text-xs text-slate-500 mt-1">Try another search keyword or contact support below.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`bg-white border rounded-2xl transition-all overflow-hidden ${
                      isOpen ? 'border-blue-300 shadow-sm ring-1 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full p-4 text-left flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        {faq.badge && (
                          <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                            {faq.badge}
                          </span>
                        )}
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {faq.question}
                        </h4>
                      </div>
                      <div className={`p-1 rounded-lg shrink-0 mt-0.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs text-slate-600 leading-relaxed bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick PDF Docs Callout */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-cyan-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">UK GP Clinician Handbook (PDF)</h4>
                <p className="text-[11px] text-slate-300">Complete standard operating procedures and NHS EPS R2 workflow guide.</p>
              </div>
            </div>
            <button
              onClick={() => showToast('info', 'Handbook Downloaded', 'UK Clinician Practice Handbook v4.2 downloaded.')}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shrink-0 shadow-xs"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Right Column: Submit Ticket & Direct Contact (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Submit Support Request Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Create Clinical Support Ticket</h3>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                Active Desk
              </span>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Question regarding EPS repeat sign-off..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="clinical">Clinical / Telehealth</option>
                    <option value="prescriptions">EPS Prescriptions</option>
                    <option value="technical">Technical / Sync</option>
                    <option value="compliance">Security & GDPR</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={ticketUrgency}
                    onChange={(e) => setTicketUrgency(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low (General Query)</option>
                    <option value="medium">Medium (Routine Support)</option>
                    <option value="high">High (Time Sensitive)</option>
                    <option value="critical">Critical (Clinic Blocker)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Clinical Details & Steps *
                </label>
                <textarea
                  rows={3}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe what occurred, patient NHS number if relevant, or error message..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingTicket ? 'Transmitting Ticket...' : 'Submit Support Ticket'}</span>
              </button>
            </form>
          </div>

          {/* Recent Tickets History */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Your Recent Support Inquiries</span>
              <span className="text-[10px] text-slate-400 font-normal">Last 30 days</span>
            </h4>

            <div className="divide-y divide-slate-100">
              {submittedTickets.map((t) => (
                <div key={t.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-blue-700">{t.id}</span>
                      <span className="text-xs font-semibold text-slate-800 truncate block">{t.subject}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t.date}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Emergency Clinician Contact Channels */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-blue-600" />
              <span>Direct Clinician Assistance</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold text-slate-700">24/7 GP Priority Hotline</span>
                </div>
                <a href="tel:+442079460912" className="font-mono font-bold text-blue-600 hover:underline">
                  020 7946 0912
                </a>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-semibold text-slate-700">Clinical Desk Email</span>
                </div>
                <a href="mailto:support@clinicflow.co.uk" className="font-mono text-slate-700 hover:text-blue-600 text-[11px]">
                  support@clinicflow.co.uk
                </a>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed">
              For emergency patient care or life-threatening situations, always dial <strong>999</strong> or utilize the direct NHS 111 Clinician Interoperability gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
