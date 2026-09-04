import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Building2,
  Award,
  Users,
  ShieldCheck,
  TrendingUp,
  Plus,
  FileText,
  Eye,
  Download,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock
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

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [timeRange, setTimeRange] = useState('This Month');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, certsRes, orgsRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getCertificates({ limit: 6 }),
        api.getAllOrganizations()
      ]);

      if (analyticsRes.success) setStats(analyticsRes.stats);
      if (certsRes.success) setCertificates(certsRes.certificates);
      if (orgsRes.success) setOrganizations(orgsRes.organizations);
    } catch (err) {
      console.error('[Admin Dashboard Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeCert = async (certId) => {
    if (!window.confirm('Are you sure you want to revoke this certificate?')) return;
    try {
      const res = await api.revokeCertificate(certId, 'Revoked by Super Admin');
      if (res.success) {
        alert('Certificate revoked successfully.');
        fetchDashboardData();
      }
    } catch (err) {
      alert(`Revocation failed: ${err.message}`);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Super Admin Control Dashboard..." />;

  // Chart data setup
  const areaData = stats?.monthlyIssuance?.length > 0 ? stats.monthlyIssuance : [
    { month: 'Jan', count: 1200 },
    { month: 'Feb', count: 1850 },
    { month: 'Mar', count: 2400 },
    { month: 'Apr', count: 3100 },
    { month: 'May', count: 4200 },
    { month: 'Jun', count: 5600 }
  ];

  const pieData = [
    { name: 'Valid', value: stats?.activeCertificates || 22100, color: '#10B981' },
    { name: 'Draft', value: stats?.draftCertificates || 2100, color: '#3B82F6' },
    { name: 'Revoked', value: stats?.revokedCertificates || 180, color: '#EF4444' },
    { name: 'Expired', value: stats?.expiredCertificates || 480, color: '#F97316' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. DASHBOARD HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Good Morning, Admin 👋</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Here's what's happening across your certificate platform today.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/reports"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-colors flex items-center space-x-2"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>View Reports</span>
          </Link>

          <Link
            to="/org/designer"
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Template</span>
          </Link>
        </div>
      </div>

      {/* 2. STATISTICS CARDS (WHITE + BLUE + ORANGE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 — Organizations */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organizations</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-mono">
              {stats?.totalOrganizations ? stats.totalOrganizations.toLocaleString() : '1,248'}
            </h3>
            <div className="flex items-center space-x-1.5 mt-1 text-emerald-600 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.5% growth</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-600" />
        </div>

        {/* Card 2 — Certificates Issued */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certificates Issued</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-mono">
              {stats?.totalCertificates ? stats.totalCertificates.toLocaleString() : '24,860'}
            </h3>
            <div className="flex items-center space-x-1.5 mt-1 text-emerald-600 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.2% growth</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-2 h-full bg-orange-500" />
        </div>

        {/* Card 3 — Recipients */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recipients</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-mono">
              {stats?.totalRecipients ? stats.totalRecipients.toLocaleString() : '18,420'}
            </h3>
            <div className="flex items-center space-x-1.5 mt-1 text-emerald-600 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+9.4% growth</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-600" />
        </div>

        {/* Card 4 — Verifications */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verifications</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 font-mono">
              {stats?.verificationCount ? stats.verificationCount.toLocaleString() : '32,540'}
            </h3>
            <div className="flex items-center space-x-1.5 mt-1 text-emerald-600 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+21.8% growth</span>
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
              <h3 className="text-base font-bold text-slate-900">Certificate Issuance Chart</h3>
              <p className="text-xs text-slate-500">Platform-wide certificate generation volume.</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['Today', 'This Week', 'This Month', 'This Year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    timeRange === range
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
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
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
                <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Certificate Status Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Certificate Status Breakdown</h3>
            <p className="text-xs text-slate-500">Distribution across validity states.</p>
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
              <span className="text-slate-600">Valid: 22,100</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-600">Draft: 2,100</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-600">Revoked: 180</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-slate-600">Expired: 480</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTIONS SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Platform Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/org/designer"
            className="p-4 rounded-2xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/40 transition-all group flex items-start space-x-3"
          >
            <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600">Create Template</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Design a Canva certificate preset.</p>
            </div>
          </Link>

          <Link
            to="/admin/organizations"
            className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all group flex items-start space-x-3"
          >
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Manage Organizations</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Review issuer accounts & status.</p>
            </div>
          </Link>

          <Link
            to="/admin/certificates"
            className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all group flex items-start space-x-3"
          >
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Manage Certificates</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Search, revoke & manage credentials.</p>
            </div>
          </Link>

          <Link
            to="/admin/verification"
            className="p-4 rounded-2xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/40 transition-all group flex items-start space-x-3"
          >
            <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600">View Verification</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Monitor live QR scan activity.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 5. RECENT CERTIFICATES & RECENT ORGANIZATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Certificates Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Certificates</h3>
              <p className="text-xs text-slate-500">Latest issued credentials across organizations.</p>
            </div>
            <Link to="/admin/certificates" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Certificate ID</th>
                  <th className="pb-3">Recipient</th>
                  <th className="pb-3">Course / Title</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <tr key={cert._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-mono font-bold text-blue-600">{cert.certificateId}</td>
                      <td className="py-3 font-semibold text-slate-900">{cert.recipientName}</td>
                      <td className="py-3 text-slate-600 truncate max-w-[140px]">{cert.courseName}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cert.status === 'Issued' || cert.status === 'Valid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : cert.status === 'Revoked'
                              ? 'bg-rose-100 text-rose-700'
                              : cert.status === 'Expired'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {cert.status}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <Link
                          to={`/verify/${cert.certificateId}`}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px]"
                        >
                          View
                        </Link>
                        {cert.status !== 'Revoked' && (
                          <button
                            onClick={() => handleRevokeCert(cert._id)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-[10px]"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400 text-xs">
                      No recent certificates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Organizations Card List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Organizations</h3>
              <p className="text-xs text-slate-500">Newly registered issuers.</p>
            </div>
            <Link to="/admin/organizations" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {organizations.slice(0, 4).map((org) => (
              <div key={org._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    <img src={org.logo} alt={org.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{org.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{org.contactEmail}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
