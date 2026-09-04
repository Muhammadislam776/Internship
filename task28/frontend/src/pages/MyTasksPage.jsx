import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import { CheckSquare, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TaskSkeleton } from '../components/LoadingSkeleton';

const MyTasksPage = ({ onSelectTask, onEditTask, onDeleteTask }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const res = await taskService.getTasks();
      if (res.success) {
        // Filter tasks assigned to current user or show all tasks in demo mode if unassigned
        const myTasks = res.tasks.filter(
          (t) => t.assignee_id && t.assignee_id._id === user?._id
        );
        setTasks(myTasks.length > 0 ? myTasks : res.tasks);
      }
    } catch (err) {
      console.error('My Tasks fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'DONE');
  const completedTasks = tasks.filter((t) => t.status === 'DONE');
  const overdueTasks = tasks.filter(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'DONE'
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-cyber/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-6 h-6 text-cyber" />
            <h1 className="text-2xl font-extrabold text-white">My Deliverables</h1>
          </div>
          <p className="text-xs text-slate-400">
            Personal task queue for {user?.name || 'Muhammad'} ({pendingTasks.length} pending)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="px-3 py-1.5 rounded-xl bg-cyber/15 text-cyber border border-cyber/30">
            Pending: {pendingTasks.length}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-status-success/15 text-status-success border border-status-success/30">
            Completed: {completedTasks.length}
          </div>
          {overdueTasks.length > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-status-danger/20 text-status-danger border border-status-danger/40 animate-pulse">
              Overdue: {overdueTasks.length}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Overdue Section */}
          {overdueTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-status-danger uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Overdue Tasks ({overdueTasks.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {overdueTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onSelectTask={onSelectTask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pending Tasks */}
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyber" /> Pending Deliverables ({pendingTasks.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onSelectTask={onSelectTask}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                />
              ))}
            </div>
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-extrabold text-status-success uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Completed Deliverables ({completedTasks.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onSelectTask={onSelectTask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyTasksPage;
