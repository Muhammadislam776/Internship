import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import EmailLogs from '../components/EmailLogs';
import { eventEngine } from '../services/eventEngine';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function Emails() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(eventEngine.getEvents());
    const unsubscribe = eventEngine.subscribe((updated) => setEvents(updated));
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex pt-16">
      <Sidebar className="hidden lg:flex" />

      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-x-hidden">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Mail size={20} className="text-[#2563EB]" />
            <h1 className="font-heading text-2xl font-extrabold text-[#071A2B]">Transactional Email Logs</h1>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Track email delivery statuses, message IDs, and inspect full rendered HTML body content
          </p>
        </div>

        <EmailLogs events={events} />
      </main>
    </div>
  );
}
