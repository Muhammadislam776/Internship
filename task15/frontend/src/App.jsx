import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { AdminUsers } from './pages/AdminUsers';
import { Dashboard } from './pages/Dashboard';
import { Roles } from './pages/Roles';
import { Permissions } from './pages/Permissions';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Reports } from './pages/Reports';
import { ActivityLogs } from './pages/ActivityLogs';
import { Settings } from './pages/Settings';
import { Support } from './pages/Support';
import { Toast } from './components/Toast';
import { useUsers } from './hooks/useUsers';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const userHook = useUsers();

  const handleShowToast = (newToast) => {
    setToast(newToast);
  };

  const handleSearchFocus = () => {
    setActiveTab('users');
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder*="Search users"]');
      if (searchInput) searchInput.focus();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#071A2B] text-white flex flex-col font-sans relative selection:bg-[#22D3EE] selection:text-[#071A2B]">
      {/* Dynamic Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiHealth={userHook.apiHealth}
        onSearchFocus={handleSearchFocus}
        onShowToast={handleShowToast}
      />

      {/* Main Container */}
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex gap-8">
        {/* Enterprise Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Dynamic Page Router mapping distinct screens */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard 
              userHook={userHook} 
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === 'users' && (
            <AdminUsers 
              userHook={userHook} 
              onShowToast={handleShowToast} 
            />
          )}

          {activeTab === 'roles' && (
            <Roles 
              onShowToast={handleShowToast} 
            />
          )}

          {activeTab === 'permissions' && (
            <Permissions 
              onShowToast={handleShowToast} 
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage />
          )}

          {activeTab === 'reports' && (
            <Reports 
              users={userHook.users} 
              onShowToast={handleShowToast} 
            />
          )}

          {activeTab === 'activity' && (
            <ActivityLogs />
          )}

          {(activeTab === 'settings' || activeTab === 'security') && (
            <Settings 
              onShowToast={handleShowToast} 
            />
          )}

          {activeTab === 'support' && (
            <Support 
              onShowToast={handleShowToast} 
            />
          )}
        </main>
      </div>

      {/* Toast Alerts */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Rich Website-Like Footer */}
      <Footer apiHealth={userHook.apiHealth} />
    </div>
  );
}

export default App;
