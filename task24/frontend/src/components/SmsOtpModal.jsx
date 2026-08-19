import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, ShieldCheck, Lock, RefreshCw, X, AlertCircle, CheckCircle2, MessageSquare, Info, Eye } from 'lucide-react';

export default function SmsOtpModal({ isOpen, onClose, phoneNumber, onOtpVerified }) {
  const { incomingSms } = useApp();
  const [otpInput, setOtpInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendStatus, setResendStatus] = useState(null);
  const [showRevealedCode, setShowRevealedCode] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setOtpInput('');
    setError(null);
    setResendStatus(null);
    setShowRevealedCode(false);
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const maskedPhone = phoneNumber || '+1 (555) 234-5678';

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!otpInput || otpInput.length < 4) {
      setError('Please enter the 6-digit SMS OTP code sent to your mobile phone.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          otpCode: otpInput.trim()
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Incorrect SMS OTP verification code. Please check your mobile phone messages and try again.');
      }

      onOtpVerified(otpInput.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:5001/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await res.json();
      setTimeLeft(60);
      setResendStatus(data.message || 'SMS OTP resent to your phone number');
    } catch (err) {
      setError('Failed to resend SMS code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative space-y-5 animate-scaleUp text-center">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 text-white flex items-center justify-center font-bold shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Mobile SMS Verification</h3>
              <p className="text-[11px] text-slate-500">Security Verification Gateway</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Info Box */}
        <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-100 space-y-1.5 text-xs text-slate-700 text-left">
          <div className="flex items-center space-x-2 text-blue-700 font-bold">
            <MessageSquare className="w-4 h-4 text-orange-500 shrink-0" />
            <span>SMS Dispatched to Mobile:</span>
          </div>
          <p className="font-mono font-extrabold text-blue-900 text-sm tracking-wide">
            {maskedPhone}
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            A 6-digit OTP code was dispatched to your mobile phone number.
          </p>
        </div>

        {/* REVEAL SMS CODE OPTION FOR LOCAL/CARRIER FILTER TESTING */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>International Carrier Filter Note</span>
            </span>
            <button
              type="button"
              onClick={() => setShowRevealedCode(!showRevealedCode)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 flex items-center space-x-1"
            >
              <Eye className="w-3 h-3 text-orange-500" />
              <span>{showRevealedCode ? 'Hide SMS Payload' : 'Inspect Received SMS'}</span>
            </button>
          </div>

          {showRevealedCode && incomingSms && (
            <div className="bg-slate-900 text-white p-3 rounded-xl font-mono text-[11px] space-y-1 animate-fadeIn">
              <p className="text-orange-400 font-bold">📩 Dispatched SMS Message Body:</p>
              <p className="text-slate-200">"{incomingSms.text}"</p>
              <button
                type="button"
                onClick={() => setOtpInput(incomingSms.code)}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold py-1.5 rounded-lg text-xs"
              >
                Auto-Fill Code ({incomingSms.code})
              </button>
            </div>
          )}
        </div>

        {resendStatus && (
          <div className="bg-emerald-50 text-emerald-700 text-xs p-2.5 rounded-xl font-bold flex items-center justify-center space-x-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{resendStatus}</span>
          </div>
        )}

        {/* OTP Code Form */}
        <form onSubmit={handleVerifySubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              Enter 6-Digit SMS Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              autoFocus
              placeholder="••••••"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="w-56 mx-auto text-center tracking-[0.4em] text-2xl font-black bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 font-mono text-slate-900 shadow-inner"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl font-semibold flex items-center space-x-2 text-left">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-bold py-4 rounded-2xl text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying SMS Code...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-orange-200" />
                <span>Verify OTP & Authorize Payment</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>Resend SMS in {timeLeft}s</span>
          <button
            type="button"
            disabled={timeLeft > 0 || loading}
            onClick={handleResendOtp}
            className="font-bold text-blue-600 disabled:text-slate-300 hover:underline"
          >
            Resend Code
          </button>
        </div>

      </div>
    </div>
  );
}
