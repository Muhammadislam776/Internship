import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Overview from './pages/Overview';
import DashboardPage from './pages/DashboardPage';
import ApiHealth from './pages/ApiHealth';
import RequestLogs from './pages/RequestLogs';
import ErrorIntelligence from './pages/ErrorIntelligence';
import TestErrors from './pages/TestErrors';
import WinstonLogs from './pages/WinstonLogs';
import Settings from './pages/Settings';
import MetricsPage from './pages/MetricsPage';
import { ToastProvider } from './context/ToastContext';

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app-layout">
      {/* Responsive Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Container */}
      <div className="flex-grow-1 d-flex flex-column min-vw-0 overflow-x-hidden">
        {/* Header Navbar */}
        <Navbar
          onRefresh={handleRefresh}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Views */}
        <main className="flex-grow-1">
          <Routes key={refreshKey}>
            <Route path="/" element={<Overview />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/health" element={<ApiHealth />} />
            <Route path="/request-logs" element={<RequestLogs />} />
            <Route path="/error-intelligence" element={<ErrorIntelligence />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="/test-errors" element={<TestErrors />} />
            <Route path="/winston-logs" element={<WinstonLogs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Overview />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
}

export default App;
