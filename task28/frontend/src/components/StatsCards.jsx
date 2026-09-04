import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Layers, Users, TrendingUp } from 'lucide-react';
import FlipCard from './FlipCard';

const StatsCards = ({ stats = {} }) => {
  const {
    totalTasks = 248,
    completedTasks = 156,
    inProgressTasks = 62,
    overdueTasks = 8,
    activeProjects = 5,
    teamMembers = 6,
    progressPercentage = 76
  } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 3D FLIP CARD 1: TOTAL TASKS */}
      <FlipCard
        frontTitle="Total Tasks"
        frontValue={totalTasks}
        frontSubtitle="All project deliverables"
        backTitle="Daily Activity"
        backValue={`${completedTasks} completed`}
        backSubtitle="↑ +12% productivity this week"
        icon={Layers}
      />

      {/* 3D FLIP CARD 2: PROJECT PROGRESS */}
      <FlipCard
        frontTitle="Project Progress"
        frontValue={`${progressPercentage}%`}
        frontSubtitle="Weighted team execution"
        backTitle="Remaining Load"
        backValue={`${totalTasks - completedTasks} tasks remaining`}
        backSubtitle="Target completion in 12 days"
        icon={TrendingUp}
      />

      {/* STANDARD CARD 3: IN PROGRESS */}
      <div className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-electric/30 hover:border-electric/60 hover:shadow-blue-glow transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            In Progress
          </span>
          <div className="p-2.5 rounded-xl bg-electric/15 border border-electric/30 text-electric">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            {inProgressTasks}
          </h3>
          <p className="text-xs text-electric font-semibold mt-1">Active development tasks</p>
        </div>
        <div className="w-full bg-midnight rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-electric h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (inProgressTasks / (totalTasks || 1)) * 100 * 2)}%` }}
          />
        </div>
      </div>

      {/* STANDARD CARD 4: OVERDUE TASKS */}
      <div className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-status-danger/30 hover:border-status-danger/60 hover:shadow-glass transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Overdue Tasks
          </span>
          <div className="p-2.5 rounded-xl bg-status-danger/15 border border-status-danger/30 text-status-danger">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-status-danger tracking-tight">
            {overdueTasks}
          </h3>
          <p className="text-xs text-status-danger font-semibold mt-1">Requires immediate attention</p>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Active Projects: <strong className="text-white">{activeProjects}</strong></span>
          <span>Team: <strong className="text-white">{teamMembers}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
