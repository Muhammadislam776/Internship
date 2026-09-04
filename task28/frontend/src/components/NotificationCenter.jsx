import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, MessageSquare, ArrowRight, X } from 'lucide-react';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'assignment',
      title: 'Task Assigned',
      message: 'Sophia assigned you "Implement @dnd-kit Drag and Drop Engine"',
      time: '10m ago',
      unread: true
    },
    {
      id: 2,
      type: 'status',
      title: 'Task Status Updated',
      message: 'Task "Express API Task Position Endpoint" moved to IN_PROGRESS',
      time: '1h ago',
      unread: true
    },
    {
      id: 3,
      type: 'deadline',
      title: 'Deadline Approaching',
      message: '"3D Flip Statistic Cards Component" due tomorrow',
      time: '3h ago',
      unread: false
    },
    {
      id: 4,
      type: 'comment',
      title: 'New Comment',
      message: 'Elena commented on "Dark Mode Accessibility Audit"',
      time: '5h ago',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5 text-slate-300 hover:text-cyber transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-vibrant text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-orange-glow animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl shadow-glass p-4 border border-cyber/20 z-50 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-vibrant/20 text-vibrant rounded-md">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold text-cyber hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  n.unread
                    ? 'bg-midnight-hover border-cyber/30 text-white'
                    : 'bg-midnight/40 border-white/5 text-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-cyber">
                    {n.type === 'assignment' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {n.type === 'status' && <ArrowRight className="w-3.5 h-3.5" />}
                    {n.type === 'deadline' && <Clock className="w-3.5 h-3.5 text-vibrant" />}
                    {n.type === 'comment' && <MessageSquare className="w-3.5 h-3.5 text-electric" />}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
