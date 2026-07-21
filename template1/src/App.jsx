import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import SamplePage from './pages/SamplePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Documentation from './pages/Documentation';
import Icons from './pages/Icons';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import LockScreen from './pages/LockScreen';
import Typography from './pages/Typography';
import Notifications from './pages/Notifications';
import './App.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={isOpen} closeSidebar={closeSidebar} />
        
        <main className="main-wrapper">
          <Topbar toggleSidebar={toggleSidebar} />
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sample-page" element={<SamplePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/icons" element={<Icons />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/lock-screen" element={<LockScreen />} />
            <Route path="/typography" element={<Typography />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>
        
        {/* Universal Overlay with Blur */}
        <div className={`mobile-overlay ${isOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
      </div>
    </Router>
  );
}

export default App;
