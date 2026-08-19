import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, DollarSign, Bell, Sparkles, RefreshCw, Key, ShieldCheck, Check, Lock, Smartphone, Send } from 'lucide-react';

export default function Settings() {
  const { 
    currency, 
    setCurrency, 
    animationsEnabled, 
    setAnimationsEnabled, 
    resetDemoData, 
    showToast,
    stripeStatus,
    handleSaveKeys
  } = useApp();

  const [inputSecretKey, setInputSecretKey] = useState('');
  const [inputPublishableKey, setInputPublishableKey] = useState('');
  const [keySaving, setKeySaving] = useState(false);

  // Twilio SMS Manager State
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioToken, setTwilioToken] = useState('');
  const [twilioPhone, setTwilioPhone] = useState('');
  const [twilioSaving, setTwilioSaving] = useState(false);
  const [twilioConfigured, setTwilioConfigured] = useState(false);

  const handleSaveStripeCredentials = async (e) => {
    e.preventDefault();
    if (!inputSecretKey.trim()) {
      showToast('Stripe Secret Key is required', 'error');
      return;
    }
    setKeySaving(true);
    await handleSaveKeys(inputSecretKey.trim(), inputPublishableKey.trim());
    setKeySaving(false);
  };

  const handleSaveTwilioCredentials = async (e) => {
    e.preventDefault();
    if (!twilioSid.trim() || !twilioToken.trim() || !twilioPhone.trim()) {
      showToast('All Twilio fields (Account SID, Auth Token, From Phone) are required', 'error');
      return;
    }

    setTwilioSaving(true);
    try {
      const response = await fetch('http://localhost:5001/api/update-twilio-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountSid: twilioSid.trim(),
          authToken: twilioToken.trim(),
          fromPhone: twilioPhone.trim()
        })
      });
      const data = await response.json();
      if (data.success) {
        setTwilioConfigured(true);
        showToast(data.message, 'success');
      } else {
        showToast(data.error || 'Twilio configuration failed', 'error');
      }
    } catch (err) {
      showToast('Failed to save Twilio settings', 'error');
    } finally {
      setTwilioSaving(false);
    }
  };

  const handleCurrencyChange = (c) => {
    setCurrency(c);
    localStorage.setItem('payflow_currency', c);
    showToast(`Currency display set to ${c}`, 'success');
  };

  const handleAnimationToggle = () => {
    const next = !animationsEnabled;
    setAnimationsEnabled(next);
    localStorage.setItem('payflow_animations', next ? 'true' : 'false');
    showToast(`Animations ${next ? 'enabled' : 'disabled'}`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Enterprise Integration Gateways
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2 font-heading">
          Application Settings & Gateways
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Connect your official Stripe & Twilio Real SIM SMS API credentials.
        </p>
      </div>

      {/* TWILIO REAL SIM SMS GATEWAY FORM */}
      <div className="bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">Twilio Real SIM SMS Gateway</h3>
              <p className="text-xs text-slate-400">Deliver real SMS OTP codes to physical mobile phone SIM cards</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center space-x-1">
            <Send className="w-3.5 h-3.5" />
            <span>{twilioConfigured ? 'Twilio SIM Gateway Active' : 'SIM Gateway Ready'}</span>
          </span>
        </div>

        <form onSubmit={handleSaveTwilioCredentials} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold">Twilio Account SID (TWILIO_ACCOUNT_SID)</label>
              <input
                type="text"
                placeholder="AC..."
                value={twilioSid}
                onChange={(e) => setTwilioSid(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-bold">Twilio Auth Token (TWILIO_AUTH_TOKEN)</label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={twilioToken}
                onChange={(e) => setTwilioToken(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold">Twilio From Phone Number (TWILIO_PHONE_NUMBER)</label>
            <input
              type="text"
              placeholder="+1 (555) 000-1122"
              value={twilioPhone}
              onChange={(e) => setTwilioPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">
              Dispatches SMS messages directly to physical SIM cards worldwide.
            </p>

            <button
              type="submit"
              disabled={twilioSaving}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{twilioSaving ? 'Saving...' : 'Enable Real SIM SMS Gateway'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* STRIPE CREDENTIALS FORM */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">Stripe API Keys Manager</h3>
              <p className="text-xs text-slate-400">Connect your Stripe Test Mode Secret Key for real API execution</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{stripeStatus}</span>
          </span>
        </div>

        <form onSubmit={handleSaveStripeCredentials} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-bold flex items-center justify-between">
              <span>Stripe Secret Key (STRIPE_SECRET_KEY)</span>
              <span className="text-[10px] text-slate-400">Starts with sk_test_...</span>
            </label>
            <input
              type="password"
              placeholder="sk_test_51..."
              value={inputSecretKey}
              onChange={(e) => setInputSecretKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold flex items-center justify-between">
              <span>Stripe Publishable Key (STRIPE_PUBLISHABLE_KEY)</span>
              <span className="text-[10px] text-slate-400">Starts with pk_test_...</span>
            </label>
            <input
              type="text"
              placeholder="pk_test_51..."
              value={inputPublishableKey}
              onChange={(e) => setInputPublishableKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-[11px] text-slate-400 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-orange-400" />
              <span>Keys are saved securely on backend server memory & .env file.</span>
            </p>

            <button
              type="submit"
              disabled={keySaving}
              className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{keySaving ? 'Saving...' : 'Save & Initialize Stripe'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
        
        {/* Currency Display Setting */}
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Currency Display</h3>
              <p className="text-xs text-slate-500">Format pricing across product catalog and checkout</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {['USD', 'EUR', 'GBP', 'PKR', 'INR'].map((c) => (
              <button
                key={c}
                onClick={() => handleCurrencyChange(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currency === c
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Animations Preference */}
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">3D Flip & Visual Animations</h3>
              <p className="text-xs text-slate-500">Enable card flip transforms and success confetti effects</p>
            </div>
          </div>

          <button
            onClick={handleAnimationToggle}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
              animationsEnabled ? 'bg-orange-500' : 'bg-slate-300'
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
              animationsEnabled ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Reset Demo Data */}
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reset Local Storage & Demo State</h3>
              <p className="text-xs text-slate-500">Clears cached preferences and restores initial transaction history</p>
            </div>
          </div>

          <button
            onClick={resetDemoData}
            className="bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-2xs transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>

      </div>

    </div>
  );
}
