import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Validation from './pages/Validation';
import Users from './pages/Users';
import ApiDocs from './pages/ApiDocs';
import Activity from './pages/Activity';
import Settings from './pages/Settings';

export default function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-container">
      {/* Background cyber grid & animated glow blobs */}
      <div className="cyber-bg-grid"></div>
      <div className="blob-1"></div>
      <div className="blob-2"></div>

      {/* Header */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Page Routing */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/validation" element={<Validation />} />
          <Route path="/users" element={<Users />} />
          <Route path="/docs" element={<ApiDocs />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
