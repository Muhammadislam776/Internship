import React from 'react';
import { PerformanceProvider, usePerformance } from './context/PerformanceContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Explore } from './pages/Explore';
import { Favorites } from './pages/Favorites';
import { PerformanceLab } from './pages/PerformanceLab';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

function MainLayout() {
  const { activeTab } = usePerformance();

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header />

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'explore' && <Explore />}
        {activeTab === 'favorites' && <Favorites />}
        {activeTab === 'lab' && <PerformanceLab />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PerformanceProvider>
        <ToastProvider>
          <MainLayout />
        </ToastProvider>
      </PerformanceProvider>
    </ErrorBoundary>
  );
}
