import React from 'react';
import { ProfileForm } from '../components/ProfileForm';
import { Shield, Key, Database, RefreshCw, Upload } from 'lucide-react';

export const Settings = ({ profile, onSaveProfile, onOpenUpload }) => {
  return (
    <div style={{ paddingBottom: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          Account Settings
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
          Configure your personal details, credentials, and avatar preferences.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Quick Avatar Change Card */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={profile?.avatar_url}
              alt="Avatar Settings"
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #22D3EE' }}
            />
            <div>
              <h4 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.05rem' }}>Profile Avatar</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Public photo stored on Supabase Cloud</p>
            </div>
          </div>
          <button onClick={onOpenUpload} className="btn-primary">
            <Upload size={16} /> Upload New Avatar
          </button>
        </div>

        {/* Profile Edit Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <ProfileForm
            profile={profile}
            onSave={onSaveProfile}
            onCancel={() => {}}
          />
        </div>

        {/* Backend & Supabase Configuration Info */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h4 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} color="#22D3EE" /> Supabase Storage Credentials
          </h4>
          <div style={{ background: 'rgba(7, 26, 43, 0.7)', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Target Bucket:</span>
              <strong style={{ color: '#22D3EE' }}>profile-pictures</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Credential Isolation:</span>
              <strong style={{ color: '#22C55E' }}>Backend Only (.env)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Service Role Status:</span>
              <strong style={{ color: '#FF7A18' }}>Active & Authenticated</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
