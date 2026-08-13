import React, { useState } from 'react';
import { RotateCw, ShieldCheck, Mail, MapPin, Calendar, Sparkles, Award } from 'lucide-react';

export const FlipProfileCard = ({ profile }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flip-card-perspective" style={{ minHeight: '340px' }}>
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        
        {/* FRONT OF CARD */}
        <div className="flip-card-front glass-card" style={{ padding: '1.75rem', position: 'relative', height: '100%', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF7A18', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Identity Card
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                <ShieldCheck size={13} /> Active Status
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                padding: '2px',
                background: 'linear-gradient(135deg, #22D3EE 0%, #FF7A18 100%)',
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
                flexShrink: 0
              }}>
                <img
                  src={profile?.avatar_url}
                  alt={profile?.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>{profile?.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#22D3EE', fontWeight: 600 }}>{profile?.jobTitle}</p>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>ID: 884-PRO-HUB</p>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5', background: 'rgba(7, 26, 43, 0.5)', padding: '0.75rem', borderRadius: '10px' }}>
              "{profile?.bio || 'Product specialist crafting modern full-stack web applications.'}"
            </p>
          </div>

          <button
            onClick={() => setIsFlipped(true)}
            className="btn-secondary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.65rem' }}
          >
            <RotateCw size={15} /> Flip Card for Details
          </button>
        </div>

        {/* BACK OF CARD */}
        <div className="flip-card-back glass-card" style={{ padding: '1.75rem', height: '100%', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(13, 42, 66, 0.95)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22D3EE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Extended Metadata
              </span>
              <Award size={18} color="#FFB86B" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#F8FAFC' }}>
                <Mail size={16} color="#FF7A18" />
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Verified Email</span>
                  <strong>{profile?.email}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#F8FAFC' }}>
                <MapPin size={16} color="#22D3EE" />
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Primary Location</span>
                  <strong>{profile?.location}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#F8FAFC' }}>
                <Calendar size={16} color="#FFB86B" />
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Member Since</span>
                  <strong>{profile?.memberSince || 'March 2024'}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#F8FAFC' }}>
                <Sparkles size={16} color="#22C55E" />
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Profile Completeness</span>
                  <strong style={{ color: '#22C55E' }}>{profile?.profileCompletion}% Score</strong>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsFlipped(false)}
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.65rem' }}
          >
            <RotateCw size={15} /> Back to Overview
          </button>
        </div>

      </div>
    </div>
  );
};
