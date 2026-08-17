import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FileCode2, Copy, Check, Terminal, Database, Cpu, Zap, ShieldCheck } from 'lucide-react';

export default function ApiDocs() {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (text, sectionId) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlCode = `-- PostgreSQL Table Definition
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    event_type TEXT NOT NULL DEFAULT 'New Booking',
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    email_message_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ
);

-- Trigger Function invoking Supabase Edge Function
CREATE OR REPLACE FUNCTION public.handle_new_notification_event()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM net.http_post(
        url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-notification-email',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        ),
        body := jsonb_build_object('type', 'INSERT', 'record', row_to_json(NEW))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`;

  const edgeFunctionCode = `// Supabase Edge Function: index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { record } = await req.json();
  const resendApiKey = Deno.env.get('RESEND_API_KEY');

  // Validate payload
  if (!record?.email) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid recipient' }), { status: 400 });
  }

  // Call Email Provider (Resend API)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${resendApiKey}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'NotifyFlow <notifications@resend.dev>', to: [record.email], subject: record.subject, html: '...' })
  });

  return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), { status: 200 });
});`;

  const payloadSample = `{
  "type": "INSERT",
  "table": "notifications",
  "record": {
    "id": "evt-9042-8811",
    "name": "Alexa Chen",
    "email": "alexa.chen@luminaresort.com",
    "event_type": "New Booking",
    "subject": "Booking Confirmed — Skyline Suite #402",
    "message": "Reservation confirmed for Oct 24 - 28, 2026."
  }
}`;

  const responseSuccess = `{
  "success": true,
  "message": "Email sent successfully",
  "email_message_id": "msg_resend_90428811",
  "recipient": "alexa.chen@luminaresort.com",
  "event_type": "New Booking"
}`;

  const responseFailure = `{
  "success": false,
  "message": "Email delivery failed",
  "error": "Invalid recipient email address format."
}`;

  const curlSample = `curl -X POST 'https://<PROJECT_REF>.supabase.co/functions/v1/send-notification-email' \\
  -H 'Authorization: Bearer <ANON_OR_SERVICE_ROLE_KEY>' \\
  -H 'Content-Type: application/json' \\
  -d '${payloadSample.replace(/\n/g, '')}'`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex pt-16">
      <Sidebar className="hidden lg:flex" />

      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <FileCode2 size={20} className="text-[#2563EB]" />
            <h1 className="font-heading text-2xl font-extrabold text-[#071A2B]">API & Webhook Architecture Documentation</h1>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Complete technical specification for database tables, Deno Edge Functions, and HTTP endpoints
          </p>
        </div>

        {/* Security Alert Banner */}
        <div className="p-4 rounded-2xl bg-[#071A2B] border border-[#22D3EE]/30 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-[#22C55E]" />
            <div className="text-xs">
              <span className="font-bold text-[#22D3EE]">Zero Credentials Leaked: </span>
              Email provider API keys reside strictly inside Supabase Edge Function Secrets. Never exposed to React.
            </div>
          </div>
          <span className="text-[10px] font-mono bg-[#22C55E]/20 text-[#22C55E] px-2.5 py-1 rounded-full font-bold">
            SECURE ARCHITECTURE
          </span>
        </div>

        {/* Section 1: Database Table & PostgreSQL Trigger */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-[#2563EB]" />
              <h3 className="font-heading text-base font-bold text-[#071A2B]">1. Supabase PostgreSQL Schema & Trigger</h3>
            </div>
            <button
              onClick={() => copyToClipboard(sqlCode, 'sql')}
              className="text-xs text-[#2563EB] font-semibold flex items-center gap-1 hover:underline"
            >
              {copiedSection === 'sql' ? <Check size={14} /> : <Copy size={14} />}
              {copiedSection === 'sql' ? 'Copied SQL!' : 'Copy SQL Script'}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-[#071A2B] text-[#22D3EE] font-mono text-xs overflow-x-auto border border-slate-800">
            {sqlCode}
          </pre>
        </div>

        {/* Section 2: Supabase Edge Function Deno Code */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu size={18} className="text-[#FF7A18]" />
              <h3 className="font-heading text-base font-bold text-[#071A2B]">2. Deno TypeScript Edge Function Implementation</h3>
            </div>
            <button
              onClick={() => copyToClipboard(edgeFunctionCode, 'deno')}
              className="text-xs text-[#2563EB] font-semibold flex items-center gap-1 hover:underline"
            >
              {copiedSection === 'deno' ? <Check size={14} /> : <Copy size={14} />}
              {copiedSection === 'deno' ? 'Copied TS!' : 'Copy Deno Code'}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-[#071A2B] text-[#CBD5E1] font-mono text-xs overflow-x-auto border border-slate-800">
            {edgeFunctionCode}
          </pre>
        </div>

        {/* Section 3: Request Payload & Responses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-heading text-sm font-bold text-[#071A2B]">Example Database Webhook Request Payload</h4>
            <pre className="p-4 rounded-2xl bg-[#071A2B] text-[#22D3EE] font-mono text-xs overflow-x-auto">
              {payloadSample}
            </pre>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-heading text-sm font-bold text-[#071A2B]">Structured Response JSON Schemas</h4>
            <div className="text-[11px] font-bold text-[#22C55E]">HTTP 200 OK — Success Payload:</div>
            <pre className="p-3 rounded-xl bg-[#071A2B] text-[#22C55E] font-mono text-[11px] overflow-x-auto">
              {responseSuccess}
            </pre>

            <div className="text-[11px] font-bold text-[#EF4444] pt-2">HTTP 400 / 500 — Delivery Failure Payload:</div>
            <pre className="p-3 rounded-xl bg-[#071A2B] text-[#EF4444] font-mono text-[11px] overflow-x-auto">
              {responseFailure}
            </pre>
          </div>

        </div>

        {/* Section 4: cURL Tester */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-[#2563EB]" />
              <h4 className="font-heading text-sm font-bold text-[#071A2B]">Direct cURL Test Command</h4>
            </div>
            <button
              onClick={() => copyToClipboard(curlSample, 'curl')}
              className="text-xs text-[#2563EB] font-semibold flex items-center gap-1 hover:underline"
            >
              {copiedSection === 'curl' ? <Check size={14} /> : <Copy size={14} />}
              {copiedSection === 'curl' ? 'Copied cURL!' : 'Copy Command'}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-[#071A2B] text-[#FF7A18] font-mono text-xs overflow-x-auto">
            {curlSample}
          </pre>
        </div>

      </main>
    </div>
  );
}
