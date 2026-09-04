import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ShieldCheck, Search, CheckCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrgVerificationPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.getVerificationLogs();
      if (res.success) setLogs(res.logs);
    } catch (err) {
      console.error('[Fetch Org Verification Error]', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading verification scan activity..." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organization Verification Scans</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Live verification scan logs specifically for certificates issued by your institution.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Certificate ID</th>
                <th className="py-3.5 px-4">Result</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-blue-600">
                    <Link to={`/verify/${log.certificateId}`} target="_blank" className="hover:underline">
                      {log.certificateId}
                    </Link>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      {log.result}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">{new Date(log.verificationDate).toLocaleString()}</td>
                  <td className="py-4 px-4 font-mono text-slate-600">{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
