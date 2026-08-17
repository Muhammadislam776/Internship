import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LiveTrafficTicker from './components/LiveTrafficTicker';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Emails from './pages/Emails';
import Analytics from './pages/Analytics';
import ApiDocs from './pages/ApiDocs';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FAFC] text-[#172033] flex flex-col font-sans">
        <LiveTrafficTicker />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/emails" element={<Emails />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
