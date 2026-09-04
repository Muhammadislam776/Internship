import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Settings, Shield, Bell, CheckCircle, QrCode, Lock } from 'lucide-react';

export const SystemSettings = () => {
  const [settings, setSettings] = useState({
    platformName: 'CertifyCraft SaaS Platform',
    allowRegistration: true,
    maintenanceMode: false,
    supportEmail: 'support@certmaker.com',
    maxCertificatesPerOrg: 50000,
    certIdFormat: 'CERT-YYYY-XXXXXX'
  });
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.getSystemSettings();
      if (res.success && res.settings) {
        setSettings({ ...settings, ...res.settings });
      }
    } catch (err) {
      console.error('[Fetch Settings Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateSystemSettings(settings);
      if (res.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  if (loading) return <LoadingSpinner label="Loading system settings..." />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform System Settings</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Configure global SaaS application settings, Certificate ID format, registration access & security policies.
          </p>
        </div>
      </div>

      {/* Settings Form Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">General Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Platform Brand Name</label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Certificate Configuration */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Certificate & QR Format</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Certificate ID Format Pattern</label>
                <input
                  type="text"
                  value={settings.certIdFormat}
                  onChange={(e) => setSettings({ ...settings, certIdFormat: e.target.value })}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Max Certificate Quota Per Org</label>
                <input
                  type="number"
                  value={settings.maxCertificatesPerOrg}
                  onChange={(e) => setSettings({ ...settings, maxCertificatesPerOrg: parseInt(e.target.value) })}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* System Toggles */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Platform Access Control</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-900">Public Organization Registration</p>
                  <p className="text-[10px] text-slate-500">Allow new institutions to sign up online.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-900">Maintenance Mode</p>
                  <p className="text-[10px] text-slate-500">Temporarily restrict access for system upgrades.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {isSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Settings updated successfully!</span>
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all"
              >
                Save System Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
