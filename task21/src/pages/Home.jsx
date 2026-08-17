import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Cloud, 
  UploadCloud, 
  Lock, 
  DownloadCloud, 
  ShieldCheck, 
  Play, 
  ArrowRight, 
  Zap, 
  Share2, 
  HardDrive 
} from 'lucide-react';
import HowItWorksModal from '../components/HowItWorksModal';

export default function Home({ user }) {
  const navigate = useNavigate();
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem 4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(34, 211, 238, 0.12)',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          color: 'var(--midnight-navy)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.5rem'
        }}>
          <Zap size={16} color="var(--vibrant-orange)" />
          <span>Upload. Share. Access. Anywhere.</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          color: 'var(--midnight-navy)',
          lineHeight: 1.15,
          marginBottom: '1.25rem',
          letterSpacing: '-0.02em'
        }}>
          Your Files. Secure. Organized. Accessible.
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(7, 26, 43, 0.7)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6
        }}>
          A simple and secure way to upload, manage and download your files from anywhere with real cloud storage & access control.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary" 
            style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}
            onClick={() => navigate(user ? '/dashboard' : '/register')}
          >
            Get Started <ArrowRight size={18} />
          </button>
          
          <button 
            className="btn btn-orange" 
            style={{ padding: '0.9rem 2rem', fontSize: '1rem', gap: '0.6rem' }}
            onClick={() => setShowWorkflowModal(true)}
          >
            <Play size={18} fill="white" /> Explore How It Works
          </button>
        </div>

        {/* Hero Illustration Graphic */}
        <div style={{
          marginTop: '4rem',
          padding: '2.5rem',
          background: 'var(--midnight-navy)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid rgba(34, 211, 238, 0.2)',
          color: 'var(--white)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--cyber-cyan)', textTransform: 'uppercase', tracking: '0.1em', marginBottom: '2rem' }}>
            REAL-TIME CLOUD FILE SHARING ARCHITECTURE
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Step 1 */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <UploadCloud size={36} color="var(--cyber-cyan)" style={{ marginBottom: '0.6rem' }} />
              <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Upload</h4>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}>Drag & drop multi-files up to 50MB</p>
            </div>

            <div style={{ fontSize: '1.5rem', color: 'var(--cyber-cyan)' }}>➔</div>

            {/* Step 2 */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Cloud size={36} color="var(--electric-blue)" style={{ marginBottom: '0.6rem' }} />
              <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Cloud Storage</h4>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}>Supabase Storage & Node backend</p>
            </div>

            <div style={{ fontSize: '1.5rem', color: 'var(--cyber-cyan)' }}>➔</div>

            {/* Step 3 */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Lock size={36} color="var(--vibrant-orange)" style={{ marginBottom: '0.6rem' }} />
              <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Secure File</h4>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}>Encrypted access & RLS policies</p>
            </div>

            <div style={{ fontSize: '1.5rem', color: 'var(--cyber-cyan)' }}>➔</div>

            {/* Step 4 */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <DownloadCloud size={36} color="var(--emerald)" style={{ marginBottom: '0.6rem' }} />
              <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Download</h4>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}>Retrieve actual binary payload anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ maxWidth: '1200px', margin: '2rem auto 0 auto', padding: '0 2rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem', color: 'var(--midnight-navy)' }}>
          Built for Speed, Security and Ease
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <ShieldCheck size={32} color="var(--electric-blue)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>User Isolation & Security</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(7, 26, 43, 0.7)' }}>
              Row Level Security ensures only authenticated owners or explicitly shared users can view or download files.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <Share2 size={32} color="var(--cyber-cyan)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Smart Expiring Links</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(7, 26, 43, 0.7)' }}>
              Generate temporary signed share links with 1-hour, 24-hour, or 7-day expiration duration options.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <HardDrive size={32} color="var(--vibrant-orange)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Visual Storage Analytics</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(7, 26, 43, 0.7)' }}>
              Interactive 3D storage cards flip to reveal file category breakdowns, downloads stats, and capacity bars.
            </p>
          </div>
        </div>
      </section>

      {/* How it works modal trigger */}
      {showWorkflowModal && <HowItWorksModal onClose={() => setShowWorkflowModal(false)} />}
    </div>
  );
}
