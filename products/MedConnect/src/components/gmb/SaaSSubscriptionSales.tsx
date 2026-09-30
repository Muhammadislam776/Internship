import React, { useState } from 'react';
import { SAAS_PRICING_TIERS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2,
  Calculator,
  Zap,
  ArrowRight,
  CreditCard,
  Lock,
  DollarSign,
  Check,
  XCircle
} from 'lucide-react';

export const SaaSSubscriptionSales: React.FC = () => {
  const { showToast } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [cliniciansCount, setCliniciansCount] = useState<number>(4);
  const [monthlyAppointments, setMonthlyAppointments] = useState<number>(1200);
  const [selectedPlan, setSelectedPlan] = useState<string>('practice');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // ROI Math
  const baselineNoShows = Math.round(monthlyAppointments * 0.12);
  const recoveredAppointments = Math.round(baselineNoShows * 0.68);
  const monthlyRevenueSavedGbp = recoveredAppointments * 45;
  const receptionistHoursSaved = Math.round(monthlyAppointments * 0.12);
  const netRoiPercentage = Math.round(((monthlyRevenueSavedGbp - 149) / 149) * 100);

  const handleSubscribe = (tierName: string) => {
    setSelectedPlan(tierName);
    setIsCheckoutOpen(true);
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutOpen(false);
    showToast('success', 'SaaS License Activated', `Clinic subscription to "${selectedPlan.toUpperCase()}" initialized.`);
  };

  return (
    <div className="space-y-8">
      {/* Hero SaaS Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>B2B SaaS Platform For UK Healthcare Providers</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          ClinicFlow SaaS Subscription Tiers & ROI Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Predictable recurring plans engineered to eliminate phone queues, prevent no-shows with ML, and provide WebRTC telehealth.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-12 h-6 bg-slate-200 rounded-full p-1 transition-colors relative"
          >
            <div
              className={`w-4 h-4 rounded-full bg-blue-600 transition-transform duration-200 ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-blue-700 font-bold' : 'text-slate-500'}`}>
            <span>Annual (Save 20%)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
              2 MONTHS FREE
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAAS_PRICING_TIERS.map((tier) => {
          const price = billingCycle === 'monthly' ? tier.priceMonthlyGbp : Math.round(tier.annualPriceGbp / 12);

          return (
            <div
              key={tier.id}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                tier.popular
                  ? 'bg-white border-2 border-blue-600 shadow-lg scale-[1.02]'
                  : 'bg-white border border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Recommended For UK Clinics
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{tier.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">£{price}</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleSubscribe(tier.name)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    tier.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  Subscribe to {tier.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive ROI Calculator Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">Practice ROI & Recovered Revenue Calculator</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Number of Clinicians in Practice: <strong className="text-blue-600 font-bold">{cliniciansCount}</strong>
              </label>
              <input
                type="range"
                min={1}
                max={25}
                value={cliniciansCount}
                onChange={(e) => setCliniciansCount(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Estimated Monthly Appointments: <strong className="text-blue-600 font-bold">{monthlyAppointments}</strong>
              </label>
              <input
                type="range"
                min={100}
                max={5000}
                step={50}
                value={monthlyAppointments}
                onChange={(e) => setMonthlyAppointments(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-700 block font-bold uppercase">Monthly Recovered Rev</span>
              <span className="text-2xl font-black text-emerald-900 font-mono">£{monthlyRevenueSavedGbp}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] text-blue-700 block font-bold uppercase">Estimated SaaS ROI</span>
              <span className="text-2xl font-black text-blue-900 font-mono">+{netRoiPercentage}%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 col-span-2">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Reception Hours Saved</span>
              <span className="text-lg font-bold text-slate-900 font-mono">~{receptionistHoursSaved} hours / month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Confirm SaaS Plan: {selectedPlan}</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-slate-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Your clinic license includes full WebRTC Telehealth, Twilio automated SMS dispatches, and NHS EPS Release 2 repeat prescription modules.
            </p>

            <button
              onClick={handleCompleteCheckout}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              Activate Clinic License
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
