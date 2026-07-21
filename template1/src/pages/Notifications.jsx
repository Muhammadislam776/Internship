import React, { useState } from 'react';
import './Notifications.css';

const initialNotifications = [
  {
    id: 1,
    type: 'message',
    title: 'New Message from Sarah',
    description: 'Hey, can we schedule a quick call to discuss the new project dashboard?',
    time: '2 minutes ago',
    unread: true,
    icon: 'ri-mail-line',
    color: 'var(--primary-color)'
  },
  {
    id: 2,
    type: 'success',
    title: 'Deployment Successful',
    description: 'The WEIC Dash v2.0 has been successfully deployed to the production server.',
    time: '1 hour ago',
    unread: true,
    icon: 'ri-checkbox-circle-line',
    color: 'var(--success)'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Server CPU Usage High',
    description: 'Server-1 is currently running at 92% CPU capacity. Consider scaling up.',
    time: '3 hours ago',
    unread: false,
    icon: 'ri-error-warning-line',
    color: 'var(--warning)'
  },
  {
    id: 4,
    type: 'info',
    title: 'Weekly Report Ready',
    description: 'Your weekly analytics and performance report is generated and ready to download.',
    time: '1 day ago',
    unread: false,
    icon: 'ri-bar-chart-box-line',
    color: 'var(--info)'
  },
  {
    id: 5,
    type: 'danger',
    title: 'Failed Payment',
    description: 'The subscription renewal for workspace "Alpha" failed due to an expired card.',
    time: '2 days ago',
    unread: false,
    icon: 'ri-close-circle-line',
    color: 'var(--danger)'
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="dashboard-content">
      <div className="notifications-container">
        <div className="notifications-header">
          <div>
            <h2>Notifications</h2>
            <p>You have {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}</p>
          </div>
          {unreadCount > 0 && (
            <button className="mark-read-btn" onClick={markAllAsRead}>
              <i className="ri-check-double-line"></i> Mark all as read
            </button>
          )}
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <i className="ri-notification-off-line"></i>
              <p>You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                <div className="notification-icon" style={{ backgroundColor: `${notif.color}15`, color: notif.color }}>
                  <i className={notif.icon}></i>
                </div>
                <div className="notification-content">
                  <div className="notification-top">
                    <h4>{notif.title}</h4>
                    <span className="notification-time">{notif.time}</span>
                  </div>
                  <p>{notif.description}</p>
                </div>
                <div className="notification-actions">
                  <button className="delete-btn" onClick={() => removeNotification(notif.id)} title="Remove">
                    <i className="ri-close-line"></i>
                  </button>
                </div>
                {notif.unread && <div className="unread-dot"></div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
