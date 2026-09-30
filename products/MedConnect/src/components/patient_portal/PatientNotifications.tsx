import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  Pill,
  FileText,
  CheckCircle2,
  Clock,
  ChevronRight,
  Check
} from 'lucide-react';

interface PatientNotificationsProps {
  onNavigateTab: (tab: string) => void;
}

export const PatientNotifications: React.FC<PatientNotificationsProps> = ({ onNavigateTab }) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const [notifications, setNotifications] = useState([
    {
      id: 'n_1',
      title: 'Appointment Confirmed',
      description: 'Your Telehealth video consultation with Dr. Sarah Jenkins is confirmed for 30 Sep at 10:30 AM.',
      time: '1 hour ago',
      read: false,
      type: 'appointment',
      targetTab: 'patient_appointments'
    },
    {
      id: 'n_2',
      title: 'Repeat Prescription Approved',
      description: 'Dr. Sarah Jenkins digitally signed and authorized your Salbutamol inhaler refill via NHS EPS.',
      time: 'Yesterday',
      read: false,
      type: 'prescription',
      targetTab: 'patient_prescriptions'
    },
    {
      id: 'n_3',
      title: 'Pre-Visit Health Questionnaire Due',
      description: 'Please complete your digital medical questionnaire before your upcoming video appointment.',
      time: '2 days ago',
      read: true,
      type: 'form',
      targetTab: 'patient_forms'
    }
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => !n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'prescription':
        return <Pill className="w-4 h-4 text-orange-600" />;
      case 'form':
      default:
        return <FileText className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time updates regarding your consultations, prescriptions, and health questionnaires
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" /> Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            filter === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            filter === 'unread'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs divide-y divide-slate-100">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4 transition-colors ${
                !item.read ? 'bg-blue-50/20 -mx-3 px-3 rounded-2xl' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    markAsRead(item.id);
                    onNavigateTab(item.targetTab);
                  }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 cursor-pointer"
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
};
