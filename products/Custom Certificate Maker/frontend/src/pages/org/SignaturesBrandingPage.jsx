import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { PenTool, Upload, Image as ImageIcon, Trash2, CheckCircle, Plus } from 'lucide-react';

export const SignaturesBrandingPage = () => {
  const [profile, setProfile] = useState({
    name: 'Tech Academy Institute of Software Engineering',
    logo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    issuerName: 'Dr. Robert Vance',
    issuerDesignation: 'Director of Education',
    signature: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/John_Hancock_signature.svg'
  });
  const [signaturesList, setSignaturesList] = useState([
    { id: 1, name: 'Dr. Robert Vance', designation: 'Director of Education', signature: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/John_Hancock_signature.svg' },
    { id: 2, name: 'Prof. Sarah Jenkins', designation: 'Vice Chancellor', signature: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/John_Hancock_signature.svg' }
  ]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showAddSigModal, setShowAddSigModal] = useState(false);
  const [newSigForm, setNewSigForm] = useState({ name: '', designation: '' });

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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateOrgProfile(profile);
      if (res.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleAddSignature = (e) => {
    e.preventDefault();
    if (!newSigForm.name || !newSigForm.designation) return;
    setSignaturesList([
      ...signaturesList,
      {
        id: Date.now(),
        name: newSigForm.name,
        designation: newSigForm.designation,
        signature: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/John_Hancock_signature.svg'
      }
    ]);
    setNewSigForm({ name: '', designation: '' });
    setShowAddSigModal(false);
  };

  if (loading) return <LoadingSpinner label="Loading signatures & branding assets..." />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Signatures & Branding Management</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Upload and save official signatures, institutional logos, and seals for automatic placement inside certificates.
          </p>
        </div>
      </div>

      {/* Main Branding Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Official Institution Logo</span>
          </h3>

          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-2xl border-2 border-slate-200 p-2 bg-slate-50 flex items-center justify-center shrink-0">
              <img src={profile.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
            </div>

            <div className="flex-1 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Logo Image URL or Asset Path</label>
              <input
                type="text"
                value={profile.logo}
                onChange={(e) => setProfile({ ...profile, logo: e.target.value })}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
              />
              <p className="text-[10px] text-slate-400">PNG or SVG with transparent background recommended.</p>
            </div>
          </div>
        </div>

        {/* Authorized Signatures Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <PenTool className="w-4 h-4 text-orange-500" />
              <span>Saved Authorized Signatures ({signaturesList.length})</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddSigModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Signature</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {signaturesList.map((sig) => (
              <div key={sig.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{sig.name}</p>
                  <p className="text-[10px] font-semibold text-blue-600">{sig.designation}</p>
                  <div className="h-10 mt-2 border-t border-slate-200 pt-1 flex items-center">
                    <img src={sig.signature} alt="Signature" className="h-8 object-contain" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSignaturesList(signaturesList.filter(s => s.id !== sig.id))}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Branding assets updated successfully!</span>
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all"
            >
              Save Branding Changes
            </button>
          </div>
        </div>
      </form>

      {/* Add Signature Modal */}
      {showAddSigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Authorized Signature</h3>
            <form onSubmit={handleAddSignature} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Signatory Full Name *</label>
                <input
                  type="text"
                  required
                  value={newSigForm.name}
                  onChange={(e) => setNewSigForm({ ...newSigForm, name: e.target.value })}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Prof. Sarah Jenkins"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Designation *</label>
                <input
                  type="text"
                  required
                  value={newSigForm.designation}
                  onChange={(e) => setNewSigForm({ ...newSigForm, designation: e.target.value })}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Vice Chancellor"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSigModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
                >
                  Add Signature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
