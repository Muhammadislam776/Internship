import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage = ({ onSelectTask }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await taskService.getTasks();
      if (res.success) setTasks(res.tasks);
    } catch (err) {
      console.error('Calendar tasks fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format month and year
  const monthYearStr = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get tasks scheduled for current month
  const scheduledTasks = tasks.filter((t) => {
    if (!t.due_date) return false;
    const d = new Date(t.due_date);
    return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-cyber/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-6 h-6 text-cyber" />
            <h1 className="text-2xl font-extrabold text-white">Task Deadline Calendar</h1>
          </div>
          <p className="text-xs text-slate-400">Track project milestones and due date deadlines</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 border border-cyber/20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-extrabold text-white px-3">{monthYearStr}</span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 border border-cyber/20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Deadlines List Agenda View */}
      <div className="glass-card rounded-3xl p-6 border border-cyber/20 space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4">
          Upcoming Deadlines in {monthYearStr} ({scheduledTasks.length})
        </h3>

        {scheduledTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No deadlines scheduled for {monthYearStr}.
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledTasks.map((task) => {
              const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'DONE';
              const dueDateStr = new Date(task.due_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={task._id}
                  onClick={() => onSelectTask && onSelectTask(task)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isOverdue
                      ? 'bg-status-danger/10 border-status-danger/40 hover:border-status-danger'
                      : 'bg-midnight/60 border-cyber/15 hover:border-cyber/50 hover:bg-midnight-hover'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${isOverdue ? 'bg-status-danger/20 text-status-danger' : 'bg-cyber/20 text-cyber'}`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white hover:text-cyber transition-colors">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                      isOverdue ? 'bg-status-danger text-white' : 'bg-cyber/15 text-cyber border border-cyber/30'
                    }`}>
                      Due: {dueDateStr}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-bold bg-slate-800 text-slate-300 rounded-lg">
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
