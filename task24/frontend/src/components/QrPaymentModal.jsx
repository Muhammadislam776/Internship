import React, { useState, useEffect } from 'react';
import { QrCode, Smartphone, CheckCircle2, Clock, X, Copy, RefreshCw } from 'lucide-react';

export default function QrPaymentModal({ isOpen, onClose, onVerify, walletType, amount }) {
  const [refId, setRefId] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minute countdown
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerify(refId || `QR-TX-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 relative space-y-6 animate-scaleUp text-center">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-left">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">QR Mobile Wallet Payment</h3>
              <p className="text-[11px] text-slate-500">{walletType || 'Scan QR Code to Pay'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Illustration Display */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 inline-block mx-auto shadow-inner space-y-3">
          <div className="w-48 h-48 bg-white p-3 rounded-2xl border-2 border-slate-900 mx-auto flex flex-col items-center justify-center shadow-md">
            {/* SVG Simulated QR Code */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
              <path d="M0,0 H30 V30 H0 Z M5,5 V25 H25 V5 Z M10,10 H20 V20 H10 Z" />
              <path d="M70,0 H100 V30 H70 Z M75,5 V25 H95 V5 Z M80,10 H90 V20 H80 Z" />
              <path d="M0,70 H30 V100 H0 Z M5,75 V95 H25 V75 Z M10,80 H20 V90 H10 Z" />
              <rect x="35" y="5" width="10" height="10" />
              <rect x="50" y="20" width="15" height="10" />
              <rect x="35" y="35" width="30" height="30" />
              <rect x="75" y="45" width="20" height="15" />
              <rect x="40" y="75" width="25" height="20" />
              <rect x="75" y="75" width="20" height="20" />
            </svg>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-slate-700">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>QR Code Expires in: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
          </div>
        </div>

        <div className="space-y-3 text-xs text-left">
          <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex items-center justify-between">
            <span className="text-slate-600 font-medium">Merchant Wallet Account:</span>
            <span className="font-mono font-bold text-blue-600">payflow.merchant@wallet</span>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Transaction Ref / ID (from your Mobile Wallet App):
              </label>
              <input
                type="text"
                placeholder="e.g. TX-99201948"
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{loading ? 'Verifying...' : 'Confirm Wallet Payment ($' + amount?.toFixed(2) + ')'}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
