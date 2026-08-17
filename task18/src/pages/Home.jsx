import React, { useState } from 'react';
import Hero from '../components/Hero';
import EventVisualizer from '../components/EventVisualizer';
import CreateEventForm from '../components/CreateEventForm';
import InteractivePayloadTerminal from '../components/InteractivePayloadTerminal';
import InteractiveImageCards from '../components/InteractiveImageCards';
import LatencyBenchmarkCard from '../components/LatencyBenchmarkCard';
import PlayDemoCard from '../components/PlayDemoCard';
import Footer from '../components/Footer';

export default function Home() {
  const [pipelineStage, setPipelineStage] = useState('IDLE');
  const [activeEvent, setActiveEvent] = useState(null);
  const [currentFormData, setCurrentFormData] = useState({
    name: 'Alexa Chen',
    email: 'alexa.chen@luminaresort.com',
    eventType: 'New Booking',
    subject: 'Booking Confirmation — Skyline Suite #402',
    message: 'Hello Alexa, your luxury suite booking for Oct 24 - Oct 28 has been confirmed by Lumina Resort.'
  });

  const handleStageChange = (stage, record) => {
    setPipelineStage(stage);
    if (record) {
      setActiveEvent(record);
      setCurrentFormData({
        name: record.name,
        email: record.email,
        eventType: record.event_type,
        subject: record.subject,
        message: record.message
      });
    }
  };

  const handleSelectPreset = (preset) => {
    setCurrentFormData(preset);
    const formElem = document.getElementById('create-event-form-section');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      
      {/* Hero Section */}
      <Hero onOpenDemo={() => {
        const demoCardElem = document.getElementById('demo-walkthrough-section');
        if (demoCardElem) demoCardElem.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* Main Interactive Demo Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-12 pb-20">
        
        {/* Live Event Pipeline Visualizer */}
        <section id="live-visualizer-section">
          <EventVisualizer currentStage={pipelineStage} activeEvent={activeEvent} />
        </section>

        {/* 2-Column Grid: Create Event Form + Live Code Inspector Terminal */}
        <section id="create-event-form-section" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <CreateEventForm
            onEventTriggered={(record) => {
              setActiveEvent(record);
            }}
            onStageChange={handleStageChange}
          />
          
          <div className="space-y-6">
            <InteractivePayloadTerminal formData={currentFormData} />
          </div>
        </section>

        {/* Sub-Second Execution Latency Breakdown */}
        <section id="latency-section">
          <LatencyBenchmarkCard />
        </section>

        {/* Interactive Image Cards */}
        <section id="use-cases-section">
          <InteractiveImageCards onSelectType={handleSelectPreset} />
        </section>

        {/* "How NotifyFlow Works" Play/Demo Card */}
        <section id="demo-walkthrough-section">
          <PlayDemoCard />
        </section>

      </main>

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}
