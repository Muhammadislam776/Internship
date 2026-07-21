import React from 'react';

const Messages = () => {
  return (
    <div className="dashboard-content">
      <div className="chart-card" style={{ padding: '24px' }}>
        <h3 className="chart-title">My Messages</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Check your inbox, send new messages, and manage your communications.
        </p>
      </div>
    </div>
  );
};

export default Messages;
