import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Activity, Search, Shield, Filter, Clock, UserCheck } from 'lucide-react';

export const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.getActivityLogs();
      if (res.success) setLogs(res.logs);
    } catch (err) {
      console.error('[Fetch Activity Logs Error]', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading platform audit logs..." />;

  const filteredLogs = logs.filter((log) =>
    log.user?.toLowerCase().includes(search.toLowerCase()) ||
    log.action?.toLowerCase().includes(search.toLowerCase()) ||
    log.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Activity & Audit Trail</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Chronological audit feed of administrative actions, logins, template modifications, and security events.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, user or category..."
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Activity Timeline Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Audit Timeline Feed</h3>

        <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white shadow-sm" />

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1 hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-slate-900">{log.user}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                      {log.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{log.date}</span>
                </div>

                <p className="text-xs font-semibold text-slate-800">{log.action}</p>

                <div className="flex items-center space-x-4 text-[10px] text-slate-400 font-mono pt-1">
                  <span>IP: {log.ip}</span>
                  <span>Session: Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
