import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NotificationCenter from './components/NotificationCenter';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyFiles from './pages/MyFiles';
import SharedFiles from './pages/SharedFiles';
import Favorites from './pages/Favorites';
import Trash from './pages/Trash';
import Settings from './pages/Settings';
import { authService } from './services/authService';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [storageStats, setStorageStats] = useState(null);

  // Helper for toast notifications
  const showToast = (message, type = 'info') => {
    const id = Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const isDashboardRoute = user && ['/dashboard', '/files', '/shared', '/favorites', '/trash', '/settings'].includes(location.pathname);

  return (
    <div className="app-container">
      {/* Fixed Glass Header */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main App Body */}
      {isDashboardRoute ? (
        <div className="dashboard-layout">
          <Sidebar 
            isOpen={isMobileSidebarOpen} 
            onClose={() => setIsMobileSidebarOpen(false)}
            storageStats={storageStats}
          />
          <main className="main-content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard user={user} showToast={showToast} onStorageUpdate={setStorageStats} />} />
              <Route path="/files" element={<MyFiles showToast={showToast} onStorageUpdate={setStorageStats} />} />
              <Route path="/shared" element={<SharedFiles showToast={showToast} />} />
              <Route path="/favorites" element={<Favorites showToast={showToast} />} />
              <Route path="/trash" element={<Trash showToast={showToast} onStorageUpdate={setStorageStats} />} />
              <Route path="/settings" element={<Settings user={user} storageStats={storageStats} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      ) : (
        <div style={{ marginTop: '72px' }}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={setUser} showToast={showToast} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" replace /> : <Register onLoginSuccess={setUser} showToast={showToast} />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      )}

      {/* Toast Notifications Overlay */}
      <NotificationCenter toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
