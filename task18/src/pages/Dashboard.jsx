import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import EventTable from '../components/EventTable';
import CreateEventForm from '../components/CreateEventForm';
import { eventEngine } from '../services/eventEngine';
import { Plus, Database, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setEvents(eventEngine.getEvents());
    setStats(eventEngine.getAnalytics());

    const unsubscribe = eventEngine.subscribe((updated) => {
      setEvents(updated);
      setStats(eventEngine.getAnalytics());
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex pt-16">
      
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#2563EB]" />
              <h1 className="font-heading text-2xl font-extrabold text-[#071A2B]">System Overview</h1>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Real-time PostgreSQL event monitoring & Supabase Edge Function email dispatcher
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-orange text-xs py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus size={16} /> Trigger New Event
          </button>
        </div>

        {/* 3D Flip Statistic Cards */}
        <section>
          <StatsCards stats={stats} />
        </section>

        {/* Live Database Events Stream Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-[#2563EB]" />
              <h3 className="font-heading text-lg font-bold text-[#071A2B]">Real-Time Event Feed</h3>
            </div>
            <span className="text-xs font-mono text-[#22C55E] flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
              Live Subscription Active
            </span>
          </div>

          <EventTable events={events} />
        </section>

      </main>

      {/* Quick Trigger Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#071A2B]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute -top-4 -right-4 z-10 w-8 h-8 rounded-full bg-white text-slate-700 shadow-lg flex items-center justify-center font-bold hover:bg-slate-100"
            >
              ✕
            </button>
            <CreateEventForm
              onEventTriggered={() => {
                setTimeout(() => setShowCreateModal(false), 1500);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
