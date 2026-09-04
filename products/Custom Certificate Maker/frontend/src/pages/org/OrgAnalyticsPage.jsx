import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Award, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const OrgAnalyticsPage = () => {
  const chartData = [
    { month: 'Jan', certs: 210, verifications: 420 },
    { month: 'Feb', certs: 340, verifications: 680 },
    { month: 'Mar', certs: 480, verifications: 920 },
    { month: 'Apr', certs: 620, verifications: 1300 },
    { month: 'May', certs: 850, verifications: 1800 },
    { month: 'Jun', certs: 1200, verifications: 2500 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organization Analytics & Reports</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Certificate generation volume, verification trends, recipient metrics, and template usage statistics.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Certificate Issuance vs. Verification Trend</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="certs" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} name="Certificates Issued" />
              <Area type="monotone" dataKey="verifications" stroke="#F97316" fill="#F97316" fillOpacity={0.2} name="QR Verifications" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
