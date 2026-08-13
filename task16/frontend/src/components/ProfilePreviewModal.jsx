import React, { useState } from 'react';
import { Play, X, Sparkles, CheckCircle2, Shield, Share2 } from 'lucide-react';

export const ProfilePreviewModal = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* PLAY / PREVIEW CARD */}
      <div className="glass-card glass-card-orange" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>Interactive Profile Preview</h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Live demonstration of your public badge</p>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#22D3EE', background: 'rgba(34, 211, 238, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '8px' }}>
            Live Preview
          </span>
        </div>

        {/* Cover Preview Container */}
        <div style={{
          height: '130px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #0B253A 0%, #2563EB 50%, #22D3EE 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 122, 24, 0.3) 0%, transparent 60%)'
          }} />

          {/* Circular Play Button */}
          <button
            onClick={() => setIsOpen(true)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#FF7A18',
              color: '#FFFFFF',
              border: '3px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(255, 122, 24, 0.8)',
              zIndex: 2,
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            className="play-pulse-btn"
          >
            <Play size={24} style={{ marginLeft: '4px' }} />
          </button>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.85rem', textAlign: 'center' }}>
          Click to launch full-screen interactive badge preview
        </p>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles color="#22D3EE" size={20} /> Identity Badge Simulation
              </h3>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            {/* Simulated Live Badge Render */}
            <div style={{
              background: 'linear-gradient(135deg, #071A2B 0%, #0B253A 100%)',
              border: '2px solid rgba(34, 211, 238, 0.4)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 0 35px rgba(37, 99, 235, 0.35)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22C55E',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <CheckCircle2 size={12} /> Verified Member
              </div>

              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                margin: '0 auto 1rem auto',
                padding: '3px',
                background: 'linear-gradient(135deg, #FF7A18 0%, #22D3EE 100%)',
                boxShadow: '0 0 20px rgba(255, 122, 24, 0.4)'
              }}>
                <img
                  src={profile?.avatar_url}
                  alt={profile?.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>

              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                {profile?.name}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#22D3EE', fontWeight: 600, marginBottom: '0.75rem' }}>
                {profile?.jobTitle}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: '1.4', marginBottom: '1.25rem' }}>
                {profile?.bio}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                fontSize: '0.8rem',
                color: '#FFB86B',
                background: 'rgba(255,255,255,0.04)',
                padding: '0.6rem',
                borderRadius: '10px'
              }}>
                <span>📍 {profile?.location}</span>
                <span>•</span>
                <span>🛡️ {profile?.role}</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              Done Viewing
            </button>
          </div>
        </div>
      )}

      <style>{`
        .play-pulse-btn:hover {
          transform: scale(1.15) !important;
        }
      `}</style>
    </>
  );
};
