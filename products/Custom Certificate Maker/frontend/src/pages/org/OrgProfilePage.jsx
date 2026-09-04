import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Building2, Globe, Mail, Phone, MapPin, CheckCircle, Save } from 'lucide-react';

export const OrgProfilePage = () => {
  const [profile, setProfile] = useState({
    name: 'Tech Academy Institute of Software Engineering',
    logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    website: 'https://techacademy.example.com',
    contactEmail: 'contact@techacademy.com',
    contactPhone: '+1 (555) 019-2831',
    address: '100 Innovation Boulevard, Silicon Valley, CA',
    description: 'Leading certified tech academy specializing in cloud-native software engineering and modern web development.'
  });
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.getOrgProfile();
      if (res.success && res.organization) {
        setProfile({ ...profile, ...res.organization });
      }
    } catch (err) {
      console.error('[Fetch Profile Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateOrgProfile(profile);
      if (res.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      alert(`Profile update failed: ${err.message}`);
    }
  };

  if (loading) return <LoadingSpinner label="Loading organization profile..." />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organization Profile & Details</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage your official institution profile, public contact details, website, and institutional address.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Organization Full Name *</label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email *</label>
              <input
                type="email"
                required
                value={profile.contactEmail}
                onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={profile.contactPhone}
                onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Website</label>
              <input
                type="text"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Logo URL</label>
              <input
                type="text"
                value={profile.logo}
                onChange={(e) => setProfile({ ...profile, logo: e.target.value })}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Institution Description</label>
            <textarea
              rows="3"
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {isSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
