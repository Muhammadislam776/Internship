import React from 'react';

const Profile = () => {
  return (
    <div className="dashboard-content">
      <div className="chart-card" style={{ padding: '24px' }}>
        <h3 className="chart-title">User Profile</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          View and edit your personal information, avatar, and contact details.
        </p>
      </div>
    </div>
  );
};

export default Profile;
