import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { authService } from '../services/authService';
import { BarChart2, TrendingUp, PieChart as PieIcon, CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie, 
  LineChart, 
  Line 
} from 'recharts';

const AnalyticsPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [taskRes, projRes, userRes] = await Promise.all([
        taskService.getTasks(),
        projectService.getProjects(),
        authService.getUsers()
      ]);

      if (taskRes.success) setTasks(taskRes.tasks);
      if (projRes.success) setProjects(projRes.projects);
      if (userRes.success) setUsers(userRes.users);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const overdueTasks = tasks.filter(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'DONE'
  ).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Status breakdown data for Donut Chart
  const statusData = [
    { name: 'Backlog', value: tasks.filter((t) => t.status === 'BACKLOG').length, color: '#64748B' },
    { name: 'To Do', value: tasks.filter((t) => t.status === 'TODO').length, color: '#2563EB' },
    { name: 'In Progress', value: inProgressTasks, color: '#22D3EE' },
    { name: 'In Review', value: tasks.filter((t) => t.status === 'IN_REVIEW').length, color: '#8B5CF6' },
    { name: 'Done', value: completedTasks, color: '#22C55E' }
  ];

  // Team Workload data for Bar Chart
  const workloadData = users.map((user) => {
    const userTasks = tasks.filter((t) => t.assignee_id && t.assignee_id._id === user._id);
    return {
      name: user.name.split(' ')[0],
      tasks: userTasks.length,
      completed: userTasks.filter((t) => t.status === 'DONE').length
    };
  });

  // Project completion line data
  const projectCompletionData = projects.map((p) => ({
    name: p.name.length > 12 ? `${p.name.substring(0, 12)}...` : p.name,
    progress: p.progress || 0
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-cyber/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-6 h-6 text-cyber" />
            <h1 className="text-2xl font-extrabold text-white">Project Analytics & Performance</h1>
          </div>
          <p className="text-xs text-slate-400">Real-time team execution velocity and completion breakdown</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-cyber/20 border border-cyber/30 text-cyber font-extrabold text-xs">
            Overall Completion: {completionPercentage}%
          </div>
        </div>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-cyber/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Tasks</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{totalTasks}</h3>
          </div>
          <div className="p-3 bg-electric/15 text-cyber rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-status-success/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Completed</p>
            <h3 className="text-3xl font-extrabold text-status-success mt-1">{completedTasks}</h3>
          </div>
          <div className="p-3 bg-status-success/15 text-status-success rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-cyber/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">In Progress</p>
            <h3 className="text-3xl font-extrabold text-cyber mt-1">{inProgressTasks}</h3>
          </div>
          <div className="p-3 bg-cyber/15 text-cyber rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-status-danger/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Overdue</p>
            <h3 className="text-3xl font-extrabold text-status-danger mt-1">{overdueTasks}</h3>
          </div>
          <div className="p-3 bg-status-danger/15 text-status-danger rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DONUT CHART: Task Status Breakdown */}
        <div className="glass-card rounded-3xl p-6 border border-cyber/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyber" /> Status Distribution
            </h3>
            <span className="text-xs font-bold text-cyber">{totalTasks} Total Tasks</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#071A2B', borderColor: '#22D3EE', borderRadius: '12px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap text-xs font-semibold mt-2">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-300">{s.name}: <strong className="text-white">{s.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* BAR CHART: Team Workload */}
        <div className="glass-card rounded-3xl p-6 border border-cyber/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-electric" /> Team Workload
            </h3>
            <span className="text-xs font-bold text-slate-400">Assigned Tasks per Member</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#071A2B', borderColor: '#22D3EE', borderRadius: '12px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Bar dataKey="tasks" fill="#2563EB" radius={[6, 6, 0, 0]} name="Assigned" />
                <Bar dataKey="completed" fill="#22C55E" radius={[6, 6, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LINE CHART: Project Completion Progress */}
        <div className="glass-card rounded-3xl p-6 border border-cyber/20 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-vibrant" /> Project Progress Velocity
            </h3>
            <span className="text-xs font-bold text-cyber">Calculated % Completed</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectCompletionData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#071A2B', borderColor: '#FF7A18', borderRadius: '12px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Line type="monotone" dataKey="progress" stroke="#FF7A18" strokeWidth={3} dot={{ fill: '#22D3EE', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
