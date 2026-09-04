import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  Palette,
  QrCode,
  Download,
  Users,
  Building2,
  ChevronDown
} from 'lucide-react';
import { TEMPLATE_PRESETS } from '../../editor/templatePresets';

export const LandingPage = () => {
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/verify/${searchId.trim()}`);
    }
  };

  const features = [
    {
      icon: Palette,
      title: 'Canva-Style Designer',
      description: 'Interactive Fabric.js visual canvas editor supporting custom typography, background gradients, ornate frames, logos, signatures, and badges.'
    },
    {
      icon: QrCode,
      title: 'Instant QR Verification',
      description: 'Every certificate auto-generates a dynamic verification QR code linking directly to a public authentication portal.'
    },
    {
      icon: Download,
      title: 'Vector PDF & PNG Export',
      description: 'Download high-resolution A4 printable PDFs and PNG images preserving exact typography, colors, and layout crispness.'
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Control',
      description: 'Dedicated workflows for Super Admins, Educational Organizations, and Student/Recipient dashboards.'
    },
    {
      icon: Building2,
      title: 'Multi-Organization Hub',
      description: 'Manage logos, authorized signatures, custom fields, and issue thousands of certificates effortlessly.'
    },
    {
      icon: Zap,
      title: 'Database Record Integrity',
      description: 'Every certificate record is permanently hashed and stored in MongoDB with full audit trail logging.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Jenkins',
      role: 'Dean of Technology, Apex University',
      text: 'CertifyCraft transformed our graduation ceremony. Issuing 1,200 verified digital certificates took minutes instead of days!'
    },
    {
      name: 'Marcus Sterling',
      role: 'Head of Learning, Nexa Corp',
      text: 'The Canva-style editor is astonishingly good. We created custom corporate awards that look like million-dollar diplomas.'
    }
  ];

  const faqs = [
    {
      q: 'How does QR Code certificate verification work?',
      a: 'Each issued certificate automatically receives a unique ID (e.g. CERT-2026-00001) and a dynamic QR code that points to the public verification endpoint /verify/:id.'
    },
    {
      q: 'Can recipients download PDF and PNG formats?',
      a: 'Yes! Recipients can view their certificates in their private dashboard and download 300 DPI high-resolution PDFs or PNG images.'
    },
    {
      q: 'Can organizations upload custom signatures and logos?',
      a: 'Absolutely. Organizations can configure their official logo, address, website, and up to 3 authorized signatures with custom titles.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-sky-500/20 to-amber-500/10 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-amber-400 mb-6 shadow-xl">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Next-Gen Full-Stack Certificate Creator & Verification Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Create Beautiful Certificates.{' '}
            <span className="bg-gradient-to-r from-amber-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Issue Them Instantly.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Design, customize, issue, manage and verify professional certificates from one powerful Canva-style SaaS platform.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/org/designer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-amber-500 via-indigo-600 to-sky-500 hover:from-amber-400 hover:to-sky-400 shadow-2xl shadow-indigo-500/30 flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              <Palette className="w-5 h-5" />
              <span>Open Certificate Designer</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>

            <Link
              to="/verify"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex items-center justify-center space-x-2 transition-all"
            >
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <span>Verify Certificate ID</span>
            </Link>
          </div>

          {/* Quick Public Verification Search Bar */}
          <div className="mt-12 max-w-xl mx-auto p-2 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl flex items-center space-x-2 backdrop-blur-xl">
            <ShieldCheck className="w-6 h-6 text-sky-400 ml-3" />
            <form onSubmit={handleVerifySubmit} className="flex-1 flex items-center">
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. CERT-2026-DD8294)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none px-2"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors shrink-0"
              >
                Verify Now
              </button>
            </form>
          </div>

          {/* Animated Certificate Mockup */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="p-3 bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-sky-500/20 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-2xl">
              <div className="bg-slate-950 rounded-2xl overflow-hidden p-8 border border-slate-800 text-center relative min-h-[420px] flex flex-col justify-between">
                {/* Certificate Decorative Border */}
                <div className="absolute inset-4 border-2 border-amber-500/30 rounded-xl pointer-events-none"></div>

                <div className="space-y-4 pt-6">
                  <span className="text-[11px] font-bold tracking-[0.25em] text-indigo-400 uppercase">
                    TECH ACADEMY INSTITUTE OF SOFTWARE ENGINEERING
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-wider font-cinzel">
                    CERTIFICATE OF ACHIEVEMENT
                  </h2>
                  <p className="text-xs text-slate-400 tracking-widest uppercase">THIS IS PROUDLY PRESENTED TO</p>

                  <h3 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-serif py-2">
                    Muhammad Ali
                  </h3>

                  <p className="text-sm text-slate-300 max-w-xl mx-auto">
                    For successfully completing the comprehensive professional masterclass in
                  </p>
                  <p className="text-xl font-bold text-sky-400 font-montserrat">
                    Full-Stack Web Engineering & Cloud Architecture
                  </p>
                </div>

                <div className="flex items-end justify-between pt-8 px-8 pb-4">
                  <div className="text-left">
                    <p className="text-xs font-mono text-slate-400">Issued: Aug 15, 2026</p>
                    <p className="text-xs font-mono text-amber-400 font-bold">ID: CERT-2026-DD8294</p>
                  </div>
                  <div className="w-14 h-14 bg-amber-500/10 rounded-full border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                    SEAL
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-200">Dr. Robert Vance</p>
                    <p className="text-[10px] text-slate-400">Director of Education</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Engineered for Perfection</h2>
          <p className="text-slate-400 text-sm">
            Everything you need to design, issue, manage and authenticate certificates at enterprise scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all duration-300 shadow-xl group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CANVA TEMPLATES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-white">10 Canva-Quality Preset Templates</h2>
            <p className="text-xs text-slate-400 mt-1">Pre-configured with professional typography, gold seals, and ornate frames.</p>
          </div>
          <Link
            to="/org/designer"
            className="mt-4 sm:mt-0 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>Explore All Templates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATE_PRESETS.slice(0, 6).map((t) => (
            <div
              key={t.id}
              className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all shadow-xl p-3"
            >
              <div
                className="h-44 rounded-xl border flex flex-col justify-center items-center p-4 relative overflow-hidden group-hover:scale-[1.02] transition-transform"
                style={{ backgroundColor: t.bg, borderColor: t.borderColor }}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-center" style={{ color: t.borderColor }}>
                  {t.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-1">1920 × 1080</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[10px] text-slate-400">{t.category} Category</p>
                </div>
                <Link
                  to="/org/designer"
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                >
                  Use Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 pt-12 max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
        <p>© 2026 CertifyCraft Full-Stack Platform. Created with React, Express, MongoDB & Fabric.js.</p>
      </footer>
    </div>
  );
};
