import React from 'react';
import { FiSettings, FiMoon, FiSun, FiGlobe, FiBell, FiShield, FiSave } from 'react-icons/fi';

const SettingsPage = ({ theme, toggleTheme, onShowToast }) => {
  return (
    <div className="py-2" data-testid="settings-page">
      
      {/* Header */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="p-2.5 rounded-3 bg-gradient-primary text-white shadow-sm">
          <FiSettings size={22} />
        </div>
        <div>
          <h2 className="fw-extrabold text-primary m-0 tracking-tight">Application Settings</h2>
          <p className="text-secondary fs-6 m-0">Customize your workspace preferences and environment variables.</p>
        </div>
      </div>

      <div className="row g-4">
        
        {/* Left Settings Panel */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4 rounded-4 mb-4">
            <h5 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
              <FiSun size={18} />
              <span>Appearance & Theme</span>
            </h5>
            
            <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-body-tertiary border mb-3">
              <div>
                <div className="fw-bold text-primary fs-7">Theme Mode</div>
                <div className="text-secondary fs-7">Current default: Light Glassmorphism</div>
              </div>
              <button 
                onClick={toggleTheme}
                className="btn btn-glass d-flex align-items-center gap-2"
              >
                {theme === 'light' ? (
                  <>
                    <FiMoon size={16} className="text-indigo" />
                    <span>Switch to Dark</span>
                  </>
                ) : (
                  <>
                    <FiSun size={16} className="text-warning" />
                    <span>Switch to Light</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-4 mb-4">
            <h5 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
              <FiGlobe size={18} />
              <span>Backend & API Endpoint</span>
            </h5>

            <div className="mb-3">
              <label className="form-label fs-7 fw-bold text-secondary">REST API Base URL</label>
              <input 
                type="text" 
                className="form-control form-control-glass" 
                defaultValue="http://localhost:5000/api" 
                readOnly 
              />
              <span className="fs-7 text-muted mt-1 d-block">Configured via Express proxy in vite.config.js</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-4">
            <h5 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
              <FiBell size={18} />
              <span>Notifications & Alerts</span>
            </h5>

            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="toastAlerts" defaultChecked />
              <label className="form-check-label fs-7 fw-semibold text-secondary" htmlFor="toastAlerts">
                Enable interactive Toast notifications for task actions
              </label>
            </div>

            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="testRunAlerts" defaultChecked />
              <label className="form-check-label fs-7 fw-semibold text-secondary" htmlFor="testRunAlerts">
                Notify when Vitest background suite completes
              </label>
            </div>

            <button 
              onClick={() => onShowToast('Settings saved successfully! 🎉')}
              className="btn btn-gradient d-flex align-items-center gap-2 mt-2"
            >
              <FiSave size={16} />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>

        {/* Right System Info Panel */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 rounded-4">
            <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
              <FiShield size={18} />
              <span>System Diagnostics</span>
            </h6>

            <div className="d-flex flex-column gap-2 fs-7">
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-secondary">Environment</span>
                <span className="fw-bold text-primary">Development</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-secondary">Frontend Library</span>
                <span className="fw-bold text-primary">React 18.3</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-secondary">Build Tool</span>
                <span className="fw-bold text-primary">Vite 5.2</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-secondary">Backend Framework</span>
                <span className="fw-bold text-primary">Express 4.19</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-secondary">Runner & Assertions</span>
                <span className="fw-bold text-primary">Vitest + RTL + Supertest</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SettingsPage;
