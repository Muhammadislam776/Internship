import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Edit3, 
  MapPin, 
  Mail, 
  Shield, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const ProfileCard = ({ 
  profile, 
  onOpenUpload, 
  onOpenEdit, 
  onConfirmDelete 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const completion = profile?.profileCompletion || 0;

  return (
    <div className="glass-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}></div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        {/* Interactive Profile Image Container */}
        <div 
          onClick={onOpenUpload}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'relative',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            padding: '4px',
            background: 'linear-gradient(135deg, #2563EB 0%, #22D3EE 50%, #FF7A18 100%)',
            boxShadow: '0 0 30px rgba(37, 99, 235, 0.4)',
            cursor: 'pointer',
            marginBottom: '1.25rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Profile Image */}
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            position: 'relative',
            background: '#071A2B'
          }}>
            <img
              src={profile?.avatar_url}
              alt={profile?.name || 'Profile'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}
            />

            {/* Hover Dark Overlay & Camera Icon */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(7, 26, 43, 0.75)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.25s ease'
            }}>
              <Camera size={26} color="#22D3EE" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF' }}>
                Change Photo
              </span>
            </div>
          </div>

          {/* Quick Upload Badge */}
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            background: '#FF7A18',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(255, 122, 24, 0.6)',
            border: '2px solid #071A2B'
          }}>
            <Camera size={16} color="#FFFFFF" />
          </div>
        </div>

        {/* User Info */}
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>
          {profile?.name || 'User Name'}
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#22D3EE', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          <Briefcase size={15} />
          <span>{profile?.jobTitle || 'Product Specialist'}</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.85rem', color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Mail size={14} color="#FFB86B" /> {profile?.email}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={14} color="#22D3EE" /> {profile?.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', padding: '0.15rem 0.6rem', borderRadius: '20px', fontWeight: 600 }}>
            <Shield size={12} /> {profile?.role || 'Admin'}
          </span>
        </div>

        {/* Profile Completion Bar */}
        <div style={{ width: '100%', marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <span style={{ color: '#94A3B8' }}>Profile Strength</span>
            <span style={{ color: completion >= 80 ? '#22C55E' : '#FF7A18' }}>{completion}% Complete</span>
          </div>
          <div style={{ height: '8px', width: '100%', background: 'rgba(7, 26, 43, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${completion}%`,
              background: 'linear-gradient(90deg, #2563EB 0%, #22D3EE 50%, #FF7A18 100%)',
              borderRadius: '4px',
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', width: '100%', justifyContent: 'center' }}>
          <button 
            onClick={onOpenEdit}
            className="btn-secondary"
            style={{ flex: 1, minWidth: '120px' }}
          >
            <Edit3 size={16} /> Edit Profile
          </button>
          
          <button 
            onClick={onOpenUpload}
            className="btn-primary"
            style={{ flex: 1, minWidth: '130px' }}
          >
            <Upload size={16} /> Upload Photo
          </button>

          <button 
            onClick={onConfirmDelete}
            className="btn-danger"
            title="Remove Profile Picture"
            style={{ padding: '0.75rem' }}
          >
            <Trash2 size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
