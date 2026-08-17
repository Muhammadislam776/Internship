import React, { useState } from 'react';
import { Terminal, Copy, Check, Code, Database, Cpu, Play } from 'lucide-react';

export default function InteractivePayloadTerminal({ formData }) {
  const [activeTab, setActiveTab] = useState('sql');
  const [copied, setCopied] = useState(false);

  const name = formData?.name || 'Alexa Chen';
  const email = formData?.email || 'alexa@example.com';
  const eventType = formData?.eventType || 'New Booking';
  const subject = formData?.subject || 'Booking Confirmation';
  const message = formData?.message || 'Your room reservation is confirmed.';

  const sqlCode = `-- Executing SQL Statement on Supabase PostgreSQL
INSERT INTO public.notifications (
  id,
  name,
  email,
  event_type,
  subject,
  message,
  status,
  created_at
) VALUES (
  gen_random_uuid(),
  '${name.replace(/'/g, "''")}',
  '${email}',
  '${eventType}',
  '${subject.replace(/'/g, "''")}',
  '${message.replace(/'/g, "''")}',
  'PENDING',
  NOW()
) RETURNING id, status;`;

  const webhookJson = `{
  "type": "INSERT",
  "table": "notifications",
  "schema": "public",
  "record": {
    "id": "evt-7792-9901-4412",
    "name": "${name}",
    "email": "${email}",
    "event_type": "${eventType}",
    "subject": "${subject}",
    "message": "${message}",
    "status": "PENDING",
    "created_at": "${new Date().toISOString()}"
  },
  "old_record": null
}`;

  const denoLogs = `[INFO] 2026-08-16T17:10:00Z - Supabase Edge Function Invoked
[VERIFY] Validating incoming JSON payload schema...
[VALID] Recipient address validated: "${email}"
[UPDATE] DB status changed: PENDING -> PROCESSING (14ms)
[HTTP] POST https://api.resend.com/emails
[STATUS] 200 OK - Message ID: msg_${Math.random().toString(36).substring(2, 10)}
[UPDATE] DB status changed: PROCESSING -> SENT (sent_at: ${new Date().toISOString()})
[SUCCESS] Execution finished in 482ms`;

  const getCurrentCode = () => {
    if (activeTab === 'sql') return sqlCode;
    if (activeTab === 'webhook') return webhookJson;
    return denoLogs;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card-dark rounded-3xl overflow-hidden border border-[#22D3EE]/30 shadow-2xl">
      
      {/* Terminal Header Bar */}
      <div className="bg-[#040D17] px-5 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
            <span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>
          </div>
          <span className="text-xs font-mono font-bold text-[#22D3EE] flex items-center gap-1.5 pl-2">
            <Terminal size={14} /> Live Engine Code Inspector
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-[#071A2B] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'sql' ? 'bg-[#2563EB] text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            PostgreSQL SQL
          </button>
          <button
            onClick={() => setActiveTab('webhook')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'webhook' ? 'bg-[#2563EB] text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Webhook JSON
          </button>
          <button
            onClick={() => setActiveTab('deno')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === 'deno' ? 'bg-[#2563EB] text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Edge Runtime Logs
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="text-xs text-[#22D3EE] hover:text-white flex items-center gap-1 font-mono font-semibold"
        >
          {copied ? <Check size={14} className="text-[#22C55E]" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      {/* Terminal Content */}
      <div className="p-5 font-mono text-xs text-[#CBD5E1] bg-[#071A2B] overflow-x-auto min-h-[180px] leading-relaxed">
        <pre className={activeTab === 'sql' ? 'text-[#22D3EE]' : activeTab === 'webhook' ? 'text-[#FF7A18]' : 'text-[#22C55E]'}>
          {getCurrentCode()}
        </pre>
      </div>

      <div className="bg-[#040D17] px-5 py-2 text-[10px] font-mono text-[#94A3B8] flex items-center justify-between border-t border-white/5">
        <span>Target Table: public.notifications</span>
        <span>Auto-syncs with Form Inputs</span>
      </div>

    </div>
  );
}
