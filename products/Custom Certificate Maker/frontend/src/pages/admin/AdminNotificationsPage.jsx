import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Bell, CheckCircle2, AlertTriangle, Info, ShieldCheck, Check } from 'lucide-react';

export const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.getAdminNotifications();
      if (res.success) setNotifications(res.notifications);
    } catch (err) {
      console.error('[Fetch Notifications Error]', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading notifications feed..." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time platform alerts, new organization registrations, revoked certificates, and high scan volume.
          </p>
        </div>
      </div>

      {/* Notifications List Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Recent Alerts & System Events</h3>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border flex items-start space-x-3 transition-all ${
                notif.read ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/50 border-blue-200 shadow-sm'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 shrink-0">
                <Bell className="w-4 h-4 text-orange-500" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{notif.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
