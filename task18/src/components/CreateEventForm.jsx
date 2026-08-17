import React, { useState } from 'react';
import { Send, Sparkles, User, Mail, Tag, FileText, MessageSquare, CheckCircle2, AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';
import { eventEngine } from '../services/eventEngine';
import confetti from 'canvas-confetti';

export default function CreateEventForm({ onEventTriggered, onStageChange }) {
  const [formData, setFormData] = useState({
    name: 'Alexa Chen',
    email: 'alexa.chen@luminaresort.com',
    eventType: 'New Booking',
    subject: 'Booking Confirmation — Skyline Suite #402',
    message: 'Hello Alexa, your luxury suite booking for Oct 24 - Oct 28 has been confirmed by Lumina Resort.'
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [result, setResult] = useState(null);

  const eventTypes = [
    'New Booking',
    'New User',
    'New Order',
    'Payment',
    'Support Ticket',
    'Custom'
  ];

  const presets = [
    {
      name: 'Alexa Chen',
      email: 'alexa.chen@luminaresort.com',
      eventType: 'New Booking',
      subject: 'Booking Confirmed — Skyline Suite #402',
      message: 'Your room reservation for Oct 24-28, 2026 is confirmed. Total paid: $1,850.00 USD.'
    },
    {
      name: 'Marcus Vance',
      email: 'marcus.vance@techcorp.io',
      eventType: 'New User',
      subject: 'Welcome to NotifyFlow Developer Portal',
      message: 'Your developer workspace is ready. Access your API keys in the Settings tab.'
    },
    {
      name: 'Elena Rostova',
      email: 'elena.rostova@cybernet.de',
      eventType: 'Payment',
      subject: 'Payout Processed — $1,450.00 USD',
      message: 'Your withdrawal to Deutsche Bank (****9876) has completed successfully.'
    },
    {
      name: 'Invalid Test User',
      email: 'invalid-email-blocked',
      eventType: 'Support Ticket',
      subject: 'Failed Dispatch Test Case',
      message: 'Testing error handling flow when email recipient is invalid.'
    }
  ];

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) errors.name = 'Customer Name is required';
    if (!formData.email.trim()) errors.email = 'Email address is required';
    else if (!emailRegex.test(formData.email) && !formData.email.includes('blocked')) errors.email = 'Please enter a valid email address.';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Notification message is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const applyPreset = (preset) => {
    setFormData(preset);
    setFieldErrors({});
    setResult(null);
    setPendingMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setResult(null);
    setPendingMessage('Event created. Waiting for notification processor...');

    try {
      const res = await eventEngine.triggerNotificationEvent(formData, (stage, record) => {
        if (stage === 'EDGE_FUNCTION') {
          setPendingMessage('⚡ Sending Email...');
        }
        if (onStageChange) onStageChange(stage, record);
      });

      setPendingMessage('');
      setResult(res);

      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#2563EB', '#22D3EE', '#FF7A18', '#22C55E']
        });
      }

      if (onEventTriggered) onEventTriggered(res.record);
    } catch (err) {
      setPendingMessage('');
      setResult({
        success: false,
        message: err.message || 'Error executing event trigger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!result?.record?.id) return;
    setLoading(true);
    setPendingMessage('Retrying event delivery...');

    try {
      const res = await eventEngine.retryNotificationEvent(result.record.id, (stage, record) => {
        if (onStageChange) onStageChange(stage, record);
      });
      setPendingMessage('');
      setResult(res);
    } catch (err) {
      setPendingMessage('');
      setResult({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 lg:p-8 border border-white/80 shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#FF7A18] flex items-center justify-center text-white shadow-md">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-[#071A2B]">Create New Event</h3>
            <p className="text-xs text-[#64748B]">Trigger database INSERT → Edge Function → Email Dispatch</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#64748B] uppercase">Presets:</span>
          {presets.slice(0, 3).map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#2563EB]/10 text-[#2563EB] border border-slate-200 transition-colors"
            >
              {p.eventType}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-[#071A2B] mb-1.5 flex items-center gap-1.5">
              <User size={13} className="text-[#2563EB]" />
              Customer Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: null });
              }}
              placeholder="e.g. Alexa Chen"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#071A2B] focus:outline-none transition-all ${
                fieldErrors.name ? 'border-[#EF4444] bg-[#EF4444]/5' : 'border-slate-200 bg-[#F8FAFC] focus:border-[#2563EB]'
              }`}
            />
            {fieldErrors.name && <p className="text-[11px] text-[#EF4444] mt-1 font-semibold">{fieldErrors.name}</p>}
          </div>

          {/* Customer Email */}
          <div>
            <label className="block text-xs font-semibold text-[#071A2B] mb-1.5 flex items-center gap-1.5">
              <Mail size={13} className="text-[#2563EB]" />
              Customer Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
              }}
              placeholder="e.g. alexa@example.com"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#071A2B] focus:outline-none transition-all ${
                fieldErrors.email ? 'border-[#EF4444] bg-[#EF4444]/5' : 'border-slate-200 bg-[#F8FAFC] focus:border-[#2563EB]'
              }`}
            />
            {fieldErrors.email && <p className="text-[11px] text-[#EF4444] mt-1 font-semibold">{fieldErrors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Event Type */}
          <div>
            <label className="block text-xs font-semibold text-[#071A2B] mb-1.5 flex items-center gap-1.5">
              <Tag size={13} className="text-[#2563EB]" />
              Event Type
            </label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm text-[#071A2B] focus:outline-none cursor-pointer"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Email Subject */}
          <div>
            <label className="block text-xs font-semibold text-[#071A2B] mb-1.5 flex items-center gap-1.5">
              <FileText size={13} className="text-[#2563EB]" />
              Email Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => {
                setFormData({ ...formData, subject: e.target.value });
                if (fieldErrors.subject) setFieldErrors({ ...fieldErrors, subject: null });
              }}
              placeholder="e.g. Booking Confirmation"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#071A2B] focus:outline-none transition-all ${
                fieldErrors.subject ? 'border-[#EF4444] bg-[#EF4444]/5' : 'border-slate-200 bg-[#F8FAFC] focus:border-[#2563EB]'
              }`}
            />
            {fieldErrors.subject && <p className="text-[11px] text-[#EF4444] mt-1 font-semibold">{fieldErrors.subject}</p>}
          </div>
        </div>

        {/* Message Body */}
        <div>
          <label className="block text-xs font-semibold text-[#071A2B] mb-1.5 flex items-center gap-1.5">
            <MessageSquare size={13} className="text-[#2563EB]" />
            Notification Message Body
          </label>
          <textarea
            rows={3}
            value={formData.message}
            onChange={(e) => {
              setFormData({ ...formData, message: e.target.value });
              if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: null });
            }}
            placeholder="Type your notification message content..."
            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#071A2B] focus:outline-none transition-all resize-none ${
              fieldErrors.message ? 'border-[#EF4444] bg-[#EF4444]/5' : 'border-slate-200 bg-[#F8FAFC] focus:border-[#2563EB]'
            }`}
          />
          {fieldErrors.message && <p className="text-[11px] text-[#EF4444] mt-1 font-semibold">{fieldErrors.message}</p>}
        </div>

        {/* Pending Processing Notice */}
        {pendingMessage && (
          <div className="p-3 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] text-xs font-mono font-bold flex items-center gap-2 animate-pulse">
            <RefreshCw size={15} className="animate-spin" />
            {pendingMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto btn-orange text-sm py-3 px-8 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Executing Pipeline...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Trigger Notification</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => applyPreset(presets[3])}
            className="text-xs text-[#EF4444] hover:underline font-semibold"
          >
            Test Invalid Email Failure Case
          </button>
        </div>
      </form>

      {/* Result Display Box */}
      {result && (
        <div className={`mt-6 p-4 rounded-2xl border flex items-start gap-3 transition-all ${
          result.success
            ? 'bg-[#22C55E]/10 border-[#22C55E]/40 text-[#172033]'
            : 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#172033]'
        }`}>
          {result.success ? (
            <CheckCircle2 size={22} className="text-[#22C55E] shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={22} className="text-[#EF4444] shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs space-y-1">
            <div className="font-bold text-sm">
              {result.success ? '✓ EMAIL DELIVERED' : '✕ EMAIL DELIVERY FAILED'}
            </div>
            <p className="text-slate-600 font-medium">{result.message}</p>
            
            {result.record && (
              <div className="mt-2 font-mono text-[11px] bg-white/80 p-2.5 rounded-xl border border-slate-200 space-y-1">
                <div>Tracking ID: <strong>{result.record.id}</strong></div>
                <div>Status: <strong className={result.success ? 'text-[#22C55E]' : 'text-[#EF4444]'}>{result.record.status}</strong></div>
                {result.record.email_message_id && (
                  <div>Message ID: <strong>{result.record.email_message_id}</strong></div>
                )}
                {result.record.error_message && (
                  <div className="text-[#EF4444]">Error: <strong>{result.record.error_message}</strong></div>
                )}
              </div>
            )}

            {/* Retry Button for Failed dispatches */}
            {!result.success && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={loading}
                  className="btn-orange text-xs py-1.5 px-4 rounded-lg font-bold flex items-center gap-1.5"
                >
                  <RotateCcw size={14} /> RETRY DISPATCH
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
