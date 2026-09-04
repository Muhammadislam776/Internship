import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Award,
  Calendar,
  Users,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  LayoutTemplate,
  UserPlus,
  PenTool,
  Download,
  Share2,
  Eye,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const OrgDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentCerts, setRecentCerts] = useState([]);
  const [chartRange, setChartRange] = useState('30 Days');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, certsRes] = await Promise.all([
        api.getOrgStats(),
        api.getCertificates({ limit: 5 })
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (certsRes.success) setRecentCerts(certsRes.certificates);
    } catch (err) {
      console.error('[Org Dashboard Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Organization Issuer Dashboard..." />;

  // Chart dataset
  const areaData = [
    { name: 'Mon', certs: 42 },
    { name: 'Tue', certs: 68 },
    { name: 'Wed', certs: 95 },
    { name: 'Thu', certs: 130 },
    { name: 'Fri', certs: 180 },
    { name: 'Sat', certs: 240 },
    { name: 'Sun', certs: 326 }
  ];

  const pieData = [
    { name: 'Valid', value: stats?.activeCertificates || 2480, color: '#10B981' },
    { name: 'Draft', value: stats?.draftCertificates || 240, color: '#3B82F6' },
    { name: 'Revoked', value: stats?.revokedCertificates || 35, color: '#EF4444' },
    { name: 'Expired', value: 85, color: '#F97316' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. DASHBOARD HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Welcome back, {user?.name || 'Tech Academy'} 👋</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Create, issue and manage professional certificates from one place.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/org/templates"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-colors flex items-center space-x-2"
          >
            <LayoutTemplate className="w-4 h-4 text-blue-600" />
            <span>Browse Templates</span>
          </Link>

          <Link
            to="/org/designer"
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create Certificate</span>
          </Link>
        </div>
      </div>

      {/* 2. STATISTICS CARDS (WHITE + BLUE + ORANGE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Certificates */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Certificates</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-mono">
              {stats?.totalCertificates ? stats.totalCertificates.toLocaleString() : '2,840'}
            </h3>
            <div className="flex items-center space-x-1.5 mt-1 text-emerald-600 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2% growth</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-600" />
        </div>

        {/* This Month */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">This Month</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-mono">326</h3>
            <div className="flex items-center space-x-1.5 mt-1 text-emerald-600 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.5% growth</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-2 h-full bg-orange-500" />
        </div>

        {/* Recipients */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recipients</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-mono">2,120</h3>
            <div className="flex items-center space-x-1.5 mt-1 text-emerald-600 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8.4% growth</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-600" />
        </div>

        {/* Verifications */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verifications</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-mono">5,640</h3>
            <div className="flex items-center space-x-1.5 mt-1 text-emerald-600 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+24.1% growth</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-2 h-full bg-orange-500" />
        </div>
      </div>

      {/* 3. ANALYTICS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certificate Issuance Line/Area Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Certificate Issuance Trend</h3>
              <p className="text-xs text-slate-500">Volume generated by your organization.</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['7 Days', '30 Days', '6 Months', '1 Year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    chartRange === range
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="orgColorCerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="certs" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#orgColorCerts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Certificate Status Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Certificate Status</h3>
            <p className="text-xs text-slate-500">Validity states breakdown.</p>
          </div>

          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Valid: 2,480</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-600">Draft: 240</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-600">Revoked: 35</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-slate-600">Expired: 85</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTIONS CARDS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/org/designer"
            className="p-4 rounded-2xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/40 transition-all group flex items-start space-x-3"
          >
            <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600">Create Certificate</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Open Canva-style designer workflow.</p>
            </div>
          </Link>

          <Link
            to="/org/templates"
            className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all group flex items-start space-x-3"
          >
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Browse Templates</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Explore 18 Canva design presets.</p>
            </div>
          </Link>

          <Link
            to="/org/recipients"
            className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all group flex items-start space-x-3"
          >
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Add Recipient</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Register new student record.</p>
            </div>
          </Link>

          <Link
            to="/org/branding"
            className="p-4 rounded-2xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/40 transition-all group flex items-start space-x-3"
          >
            <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600">Manage Branding</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Upload logo & signatures.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 5. RECENT CERTIFICATES TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Certificates</h3>
            <p className="text-xs text-slate-500">Latest credentials issued by your institution.</p>
          </div>
          <Link to="/org/issued" className="text-xs font-bold text-blue-600 hover:text-blue-700">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="pb-3.5 px-4">Certificate ID</th>
                <th className="pb-3.5 px-4">Recipient</th>
                <th className="pb-3.5 px-4">Course Program</th>
                <th className="pb-3.5 px-4">Issue Date</th>
                <th className="pb-3.5 px-4">Status</th>
                <th className="pb-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {recentCerts.length > 0 ? (
                recentCerts.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{cert.certificateId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{cert.recipientName}</td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[180px]">{cert.courseName}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(cert.issueDate || cert.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          cert.status === 'Issued' || cert.status === 'Valid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {cert.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        to={`/verify/${cert.certificateId}`}
                        target="_blank"
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px]"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => alert(`Share URL copied: ${window.location.origin}/verify/${cert.certificateId}`)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-lg text-[10px]"
                      >
                        Share
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400 text-xs">
                    No certificates issued yet. Click "+ Create Certificate" to start!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
