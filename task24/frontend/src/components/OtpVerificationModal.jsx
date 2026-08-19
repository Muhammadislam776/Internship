import React, { useState } from 'react';
import { Lock, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';

export default function OtpVerificationModal({ isOpen, onClose, onVerify, amount, cardLast4 }) {
  const [pinInput, setPinInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pinInput || pinInput.length < 4) {
      setError('Please enter a valid 4 to 6-digit ATM PIN or Bank OTP code');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate 3D Secure Bank Verification
    setTimeout(() => {
      setLoading(false);
      onVerify(pinInput);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative space-y-6 animate-scaleUp">
        
        {/* Bank Security Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 text-white flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">3D Secure Bank Authentication</h3>
              <p className="text-[11px] text-slate-500">Verified by Visa / Mastercard SecureCode</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Summary Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Merchant:</span>
            <span className="font-bold text-slate-900">PayFlow E-Commerce Platform</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Card Charged:</span>
            <span className="font-mono font-bold text-slate-900">•••• •••• •••• {cardLast4 || '4242'}</span>
          </div>
          <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
            <span className="font-bold">Total Authorization:</span>
            <span className="font-black text-blue-600 text-sm">${amount?.toFixed(2)} USD</span>
          </div>
        </div>

        {/* ATM PIN / OTP Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-center">
            <label className="text-xs font-bold text-slate-800 block">
              Enter 4-Digit ATM PIN or 6-Digit SMS OTP
            </label>
            <p className="text-[11px] text-slate-500">
              A temporary security code was sent to your registered bank mobile number. (Use <code className="bg-slate-100 text-blue-600 px-1 font-bold">1234</code> or <code className="bg-slate-100 text-blue-600 px-1 font-bold">424242</code>)
            </p>

            <input
              type="password"
              maxLength={6}
              autoFocus
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-48 mx-auto text-center tracking-[0.5em] text-2xl font-black bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 font-mono"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold py-4 rounded-2xl text-sm shadow-lg flex items-center justify-center space-x-2 transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authorizing with Bank...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-emerald-200" />
                <span>Authorize & Complete Payment</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-400">
          🔒 256-bit TLS Encrypted Session • Visa & Mastercard Verified
        </div>

      </div>
    </div>
  );
}
