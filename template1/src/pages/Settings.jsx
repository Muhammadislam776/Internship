import React from 'react';

const Settings = () => {
  return (
    <div className="dashboard-content">
      <div className="chart-card" style={{ padding: '24px' }}>
        <h3 className="chart-title">Settings</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Configure your application preferences, notifications, and privacy settings here.
        </p>
      </div>
    </div>
  );
};

export default Settings;
