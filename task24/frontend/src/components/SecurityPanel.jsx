import React from 'react';
import { Lock, Shield, Zap, CheckCircle2, CreditCard, ExternalLink } from 'lucide-react';

export default function SecurityPanel() {
  const securityFeatures = [
    {
      icon: Lock,
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-100",
      title: "🔒 Secure Checkout",
      desc: "Payments are processed directly via Stripe's PCI-DSS Level 1 compliant hosted checkout infrastructure."
    },
    {
      icon: Shield,
      color: "text-orange-500",
      bgColor: "bg-orange-50 border-orange-100",
      title: "🛡️ Protected Data",
      desc: "Sensitive credit card numbers or security credentials are NEVER stored on local servers."
    },
    {
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-50 border-amber-100",
      title: "⚡ Fast Processing",
      desc: "Checkout sessions are created instantly on the backend with zero friction for your users."
    },
    {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 border-emerald-100",
      title: "✓ Trusted Platform",
      desc: "Official Stripe Server SDK integration following enterprise security standards."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Bank-Grade Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
            Your Payment Security Matters
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Built with security-first architecture to protect every step of the transaction.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.bgColor} mb-4`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>PCI-DSS Verified</span>
                  <span className="text-blue-600">Stripe SDK</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Icons Bar */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              Stripe
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Supported Payment Methods</p>
              <p className="text-xs text-slate-500">Global credit cards, digital wallets & direct debit</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-bold text-slate-700">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">💳 Visa</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">💳 Mastercard</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200"> Apple Pay</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">G Google Pay</span>
          </div>
        </div>

      </div>
    </section>
  );
}
