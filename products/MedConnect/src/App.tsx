import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppHeader } from './components/layout/AppHeader';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthPage } from './components/auth/AuthPage';
import { LandingPage } from './components/public/LandingPage';
import { BookAppointmentModal } from './components/scheduler/BookAppointmentModal';
import { SupabaseConfigModal } from './components/common/SupabaseConfigModal';

// Dedicated Dashboards for each role
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { ReceptionistDashboard } from './components/dashboards/ReceptionistDashboard';
import { PracticeManagerDashboard } from './components/dashboards/PracticeManagerDashboard';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard';

const MainLayout: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [isQuickBookOpen, setIsQuickBookOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [publicView, setPublicView] = useState<'landing' | 'auth'>('landing');
  const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'register'>('login');

  // If user is not authenticated, toggle between Landing Page and Auth Page
  if (!isAuthenticated || !currentUser) {
    if (publicView === 'auth') {
      return (
        <>
          <AuthPage
            onBackToHome={() => setPublicView('landing')}
            defaultMode={authDefaultMode}
          />
          <ToastContainer />
        </>
      );
    }

    return (
      <>
        <LandingPage
          onOpenAuth={(mode = 'login') => {
            setAuthDefaultMode(mode);
            setPublicView('auth');
          }}
        />
        <ToastContainer />
      </>
    );
  }

  // Dynamic Dashboard Render based on User Role
  const renderRoleDashboard = () => {
    switch (currentUser.role) {
      case 'doctor':
        return <DoctorDashboard />;
      case 'patient':
        return <PatientDashboard />;
      case 'receptionist':
        return <ReceptionistDashboard />;
      case 'practice_manager':
        return <PracticeManagerDashboard />;
      case 'saas_admin':
        return <SuperAdminDashboard />;
      default:
        return <DoctorDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Authenticated App Header */}
      <AppHeader
        onOpenQuickBook={() => setIsQuickBookOpen(true)}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Workspace Layout with Sidebar */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Collapsible Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Role Dashboard Main Area */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 overflow-y-auto min-w-0">
          {renderRoleDashboard()}
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <BookAppointmentModal isOpen={isQuickBookOpen} onClose={() => setIsQuickBookOpen(false)} />
      <SupabaseConfigModal isOpen={isSupabaseModalOpen} onClose={() => setIsSupabaseModalOpen(false)} />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
