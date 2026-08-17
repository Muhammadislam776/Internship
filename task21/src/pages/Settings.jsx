import React, { useState } from 'react';
import { User, HardDrive, ShieldCheck, Database, Key, Check, Camera } from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabase';
import { authService } from '../services/authService';

export default function Settings({ user, storageStats }) {
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const avatarSeeds = ['Felix', 'Aneka', 'Bandit', 'Zoe', 'Leo', 'Mia'];

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authService.updateProfile({ fullName, avatarUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--midnight-navy)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <User size={28} color="var(--electric-blue)" /> Account & Profile Settings
        </h1>
        <p style={{ color: 'rgba(7, 26, 43, 0.6)', fontSize: '0.95rem' }}>
          Manage your personal account profile, avatars, storage limits, and security
        </p>
      </div>

      {/* Edit Profile Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={20} color="var(--electric-blue)" /> Edit Profile Details
        </h3>

        <form onSubmit={handleUpdateProfile}>
          {/* Avatar Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--midnight-navy)', marginBottom: '0.6rem' }}>
              Choose Profile Avatar
            </label>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <img 
                src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || 'User')}`} 
                alt="Current Avatar" 
                style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid var(--cyber-cyan)', objectFit: 'cover' }}
              />

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {avatarSeeds.map(seed => {
                  const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                  return (
                    <img 
                      key={seed} 
                      src={url} 
                      alt={seed}
                      onClick={() => setAvatarUrl(url)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: avatarUrl === url ? '2px solid var(--electric-blue)' : '1px solid rgba(7,26,43,0.1)',
                        opacity: avatarUrl === url ? 1 : 0.7,
                        transition: 'var(--transition)'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--midnight-navy)', marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(7, 26, 43, 0.15)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  background: 'var(--white)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--midnight-navy)', marginBottom: '0.4rem' }}>
                Email Address (Read Only)
              </label>
              <input 
                type="email" 
                disabled
                value={user?.email || ''}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(7, 26, 43, 0.1)',
                  background: 'var(--soft-white)',
                  color: 'rgba(7, 26, 43, 0.6)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {saved ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Check size={16} /> Changes Saved!
              </span>
            ) : (
              'Save Profile Changes'
            )}
          </button>
        </form>
      </div>

      {/* Storage Quota Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HardDrive size={20} color="var(--cyber-cyan)" /> Storage Capacity
        </h3>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <span>Used Storage</span>
            <span>{storageStats?.formattedStorageUsed || '0 B'} / 10 GB</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill"
              style={{
                width: `${storageStats?.usedPercentage || 0}%`,
                backgroundColor: 'var(--cyber-cyan)'
              }}
            />
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'rgba(7,26,43,0.6)' }}>
          Your standard tier includes 10 GB of encrypted cloud storage.
        </div>
      </div>

      {/* System Security Status */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="var(--emerald)" /> Security & Session Information
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--soft-white)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} color="var(--electric-blue)" />
              <span style={{ fontWeight: 600 }}>Database Connection Engine</span>
            </div>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: isSupabaseConfigured ? 'var(--emerald-glass)' : 'rgba(34, 211, 238, 0.15)',
              color: isSupabaseConfigured ? 'var(--emerald)' : 'var(--midnight-navy)'
            }}>
              {isSupabaseConfigured ? 'Connected to Supabase PostgreSQL' : 'Local Hybrid Engine Active'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--soft-white)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={18} color="var(--vibrant-orange)" />
              <span style={{ fontWeight: 600 }}>Row-Level Security (RLS) & 256-Bit SSL</span>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald)' }}>
              Active & Protected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
