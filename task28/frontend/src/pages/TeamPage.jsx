import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { Users, CheckCircle2, Clock, Mail, ShieldCheck } from 'lucide-react';

const TeamPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await authService.getUsers();
      if (res.success) setUsers(res.users);
    } catch (err) {
      console.error('Team fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-cyber/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-cyber" />
            <h1 className="text-2xl font-extrabold text-white">Team Workspace & Workload</h1>
          </div>
          <p className="text-xs text-slate-400">Manage member roles, active assignments, and team velocity</p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-cyber/15 border border-cyber/30 text-cyber font-extrabold text-xs">
          {users.length} Active Team Members
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((member) => {
          const workloadRatio = member.assignedTasks > 0
            ? Math.round((member.completedTasks / member.assignedTasks) * 100)
            : 0;

          return (
            <div
              key={member._id}
              className="glass-card rounded-3xl p-6 border border-cyber/20 hover:border-cyber/50 hover:shadow-cyan-glow transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* User Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyber/30 group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-status-success rounded-full ring-2 ring-midnight" />
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-cyber transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-cyber">{member.role}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {member.email}
                    </p>
                  </div>
                </div>

                {/* Task Workload Progress */}
                <div className="mt-4 p-4 rounded-2xl bg-midnight/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">Workload Execution</span>
                    <span className="text-cyber">{workloadRatio}%</span>
                  </div>
                  <div className="w-full bg-midnight rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-electric via-cyber to-vibrant h-full rounded-full transition-all duration-500"
                      style={{ width: `${workloadRatio}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Assigned: <strong className="text-white">{member.assignedTasks}</strong></span>
                    <span>Completed: <strong className="text-status-success">{member.completedTasks}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-cyber" /> Verified Member
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 bg-electric/15 text-electric rounded-md">
                  Active
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamPage;
