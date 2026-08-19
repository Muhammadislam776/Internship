import React from 'react';
import { 
  ShoppingBag, 
  Send, 
  CheckCircle2, 
  Server, 
  Link, 
  ExternalLink, 
  CreditCard, 
  Check, 
  ArrowRight,
  Code
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "User Selects Product",
      desc: "User picks a plan (e.g. Pro Plan $49) on frontend and clicks 'Secure Checkout'.",
      icon: ShoppingBag,
      color: "bg-blue-600 text-white"
    },
    {
      num: 2,
      title: "Frontend sends POST /create-payment",
      desc: "Client sends POST /create-payment with body: { productId: 'pro' }.",
      icon: Send,
      color: "bg-orange-500 text-white"
    },
    {
      num: 3,
      title: "Backend Validates Request",
      desc: "Express server validates productId server-side & retrieves authoritative price ($49).",
      icon: Server,
      color: "bg-blue-700 text-white"
    },
    {
      num: 4,
      title: "Stripe Checkout Session Created",
      desc: "Stripe SDK calls stripe.checkout.sessions.create({ mode: 'payment', line_items... }).",
      icon: Code,
      color: "bg-orange-600 text-white"
    },
    {
      num: 5,
      title: "Stripe Returns Checkout URL",
      desc: "Backend receives session URL (e.g. checkout.stripe.com/pay/cs_test_...) & returns to client.",
      icon: Link,
      color: "bg-emerald-600 text-white"
    },
    {
      num: 6,
      title: "Redirect to Stripe Checkout",
      desc: "Frontend automatically redirects browser window.location.href to Stripe URL.",
      icon: ExternalLink,
      color: "bg-blue-600 text-white"
    },
    {
      num: 7,
      title: "User Completes Payment",
      desc: "User submits payment securely on Stripe's hosted payment interface.",
      icon: CreditCard,
      color: "bg-orange-500 text-white"
    },
    {
      num: 8,
      title: "Redirect to Success / Cancel Page",
      desc: "Stripe returns user to /payment-success?session_id=... with order confirmation.",
      icon: CheckCircle2,
      color: "bg-emerald-500 text-white"
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Developer & Architecture Overview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-heading">
            How Stripe Checkout Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            The complete 8-step lifecycle of a PayFlow <code className="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded font-mono">POST /create-payment</code> transaction.
          </p>
        </div>

        {/* Steps Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="bg-slate-50 hover:bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center font-heading">
                      #{step.num}
                    </span>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>Step {step.num} of 8</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Code Snippet Callout */}
        <div className="mt-12 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Backend Route Definition</span>
              <h3 className="text-xl font-bold text-white font-heading mt-1">
                <span className="text-emerald-400 font-mono">POST</span> /create-payment
              </h3>
            </div>
            <span className="text-xs bg-slate-800 text-blue-400 px-3 py-1.5 rounded-xl border border-slate-700 font-mono">
              backend/controllers/paymentController.js
            </span>
          </div>

          <pre className="mt-6 p-4 rounded-2xl bg-slate-950 text-slate-300 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed border border-slate-800/80">
{`// 1. Validate Product Server-Side
const product = PRODUCTS[req.body.productId];
if (!product) return res.status(404).json({ error: 'Invalid product' });

// 2. Create Stripe Checkout Session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: product.name },
      unit_amount: product.priceInCents,
    },
    quantity: 1,
  }],
  success_url: \`\${CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}\`,
  cancel_url: \`\${CLIENT_URL}/payment-cancelled\`
});

// 3. Return URL to Frontend
res.json({ success: true, url: session.url, sessionId: session.id });`}
          </pre>
        </div>

      </div>
    </section>
  );
}
