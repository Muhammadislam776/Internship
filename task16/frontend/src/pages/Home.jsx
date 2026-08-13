import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Upload, Shield, ArrowRight, CheckCircle, Zap } from 'lucide-react';

export const Home = ({ profile, onOpenUpload }) => {
  return (
    <div style={{ padding: '2rem 0' }}>
      {/* HERO SECTION */}
      <div className="glass-card" style={{
        padding: '3.5rem 2.5rem',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(7, 26, 43, 0.85) 0%, rgba(11, 37, 58, 0.95) 100%)'
      }}>
        {/* Abstract Floating Glass Shapes */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '5%',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'floatAnim 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          left: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 122, 24, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'floatAnim 6s ease-in-out infinite reverse'
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Left Column: Text */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#22D3EE',
              marginBottom: '1.25rem'
            }}>
              <Zap size={14} color="#FF7A18" /> Express.js + Supabase Storage Architecture
            </div>

            <h1 style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              lineHeight: '1.15',
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
              color: '#FFFFFF'
            }}>
              Create Your <span className="gradient-text-orange">Perfect Profile</span>
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: '#94A3B8',
              lineHeight: '1.6',
              marginBottom: '2rem',
              maxWidth: '520px'
            }}>
              Upload a professional profile picture and personalize your digital identity. Powered by secure backend key isolation and cloud file storage.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button onClick={onOpenUpload} className="btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                <Upload size={18} /> Upload Profile Picture
              </button>

              <Link to="/profile" className="btn-secondary" style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}>
                Manage Profile <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Right Column: Abstract Glass Illustration Badge */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              position: 'relative',
              width: '280px',
              height: '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Outer Glowing Rings */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px dashed rgba(34, 211, 238, 0.4)',
                animation: 'spin 20s linear infinite'
              }} />
              <div style={{
                position: 'absolute',
                inset: '15px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 122, 24, 0.3)',
                animation: 'spin 15s linear infinite reverse'
              }} />

              {/* Main Avatar Card */}
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                padding: '4px',
                background: 'linear-gradient(135deg, #2563EB 0%, #22D3EE 50%, #FF7A18 100%)',
                boxShadow: '0 0 40px rgba(37, 99, 235, 0.5)',
                position: 'relative',
                zIndex: 3
              }}>
                <img
                  src={profile?.avatar_url}
                  alt="Hero Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Floating Tech Pill 1 */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '-10px',
                background: 'rgba(11, 37, 58, 0.9)',
                border: '1px solid rgba(34, 211, 238, 0.4)',
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#22D3EE',
                boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Shield size={12} color="#22C55E" /> Express Backend API
              </div>

              {/* Floating Tech Pill 2 */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '-10px',
                background: 'rgba(11, 37, 58, 0.9)',
                border: '1px solid rgba(255, 122, 24, 0.4)',
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#FFB86B',
                boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <CheckCircle size={12} color="#FF7A18" /> Supabase Storage
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
