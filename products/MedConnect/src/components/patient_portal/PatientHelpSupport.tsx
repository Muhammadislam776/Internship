import React, { useState } from 'react';
import {
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  Clock,
  Building2,
  Calendar,
  Video,
  Pill,
  FileText
} from 'lucide-react';

export const PatientHelpSupport: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: 'How do I book an appointment?',
      a: 'Go to "Appointments" in your sidebar or click "Book Appointment" on your dashboard. Choose whether you need a Video or In-person visit, select your doctor, and choose an available time slot. You will receive an instant SMS and email confirmation.'
    },
    {
      q: 'How do I join a video consultation?',
      a: 'When your appointment is due, click "Join Video Consultation" on your dashboard. You will enter a pre-call check to test your camera and microphone, then proceed to the secure waiting room where Dr. Sarah Jenkins will admit you.'
    },
    {
      q: 'How do I request a repeat prescription refill?',
      a: 'Navigate to "Prescriptions" and click "Request Repeat Refill". Select your medication, review your dispensing pharmacy, add an optional note for your GP, and submit. Your GP will digitally authorize it within 24-48 hours via NHS EPS.'
    },
    {
      q: 'How do I complete my digital health questionnaires?',
      a: 'Select "Health Forms" to view your pre-consultation questionnaires. You can fill out your medical history and current symptoms step-by-step and use "Save Progress" at any point to continue later.'
    },
    {
      q: 'What should I do in an emergency?',
      a: 'This portal is for routine and pre-arranged appointments. If you require emergency medical assistance, please call 999 immediately or call NHS 111 for urgent advice.'
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Help & Support
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Frequently asked questions and clinic contact information
        </p>
      </div>

      {/* Search Help */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search help articles, appointment guides, video instructions..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 shadow-xs"
        />
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 mb-2">Frequently Asked Questions</h2>

        {filteredFaqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className="border border-slate-100 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-slate-900 hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-50 bg-slate-50/30 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Clinic Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">St. James Health Centre</h3>
              <p className="text-[11px] text-slate-500">Your Registered GP Practice</p>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2 pt-2">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Reception: <strong>+44 20 7946 0192</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>12 St. James Square, London SW1Y 4LE</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Surgery Hours: Mon–Fri 08:00 – 18:30</span>
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Portal Technical Support</h3>
              <p className="text-[11px] text-slate-500">Video, login & questionnaire help</p>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2 pt-2">
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>support@medconnect.co.uk</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Helpline: +44 800 014 8920 (Toll-Free)</span>
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Response time: Under 15 minutes during operating hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
