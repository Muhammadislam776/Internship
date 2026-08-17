import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import EventTable from '../components/EventTable';
import { eventEngine } from '../services/eventEngine';
import { Database, Filter, ArrowUpDown } from 'lucide-react';

export default function Events() {
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
            <Database size={20} className="text-[#2563EB]" />
            <h1 className="font-heading text-2xl font-extrabold text-[#071A2B]">Database Event Logs</h1>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Complete audit record of PostgreSQL inserts on public.notifications
          </p>
        </div>

        <EventTable events={events} />
      </main>
    </div>
  );
}
