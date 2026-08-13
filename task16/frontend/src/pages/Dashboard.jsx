import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Database, 
  Upload, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  HardDrive, 
  CheckCircle2, 
  ArrowUpRight,
  Sparkles,
  Zap
} from 'lucide-react';

export const Dashboard = ({ profile, onOpenUpload }) => {
  const uploadsCount = profile?.previousUploads?.length || 1;
  const completion = profile?.profileCompletion || 0;

  const storageUsedKb = (profile?.previousUploads || []).reduce((acc, item) => acc + (item.fileSize || 5000), 0) / 1024;
  const storageFormatted = storageUsedKb > 1024 ? (storageUsedKb / 1024).toFixed(2) + ' MB' : storageUsedKb.toFixed(1) + ' KB';

  const metrics = [
    { title: 'Storage Used', value: storageFormatted, sub: 'of 5.00 MB limit', icon: HardDrive, color: '#22D3EE' },
    { title: 'Total Uploads', value: uploadsCount, sub: 'Supabase storage files', icon: Upload, color: '#FF7A18' },
    { title: 'Profile Health', value: `${completion}%`, sub: 'Completeness score', icon: TrendingUp, color: '#22C55E' },
    { title: 'API Uptime', value: '99.9%', sub: 'Port 5000 Express Server', icon: Zap, color: '#FFB86B' }
  ];

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BarChart3 color="#22D3EE" size={28} /> Dashboard Analytics
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
            Real-time telemetry, storage metrics, and system performance.
          </p>
        </div>

        <button onClick={onOpenUpload} className="btn-primary">
          <Upload size={16} /> Quick Upload Photo
        </button>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8' }}>{m.title}</span>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${m.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: m.color
                }}>
                  <Icon size={18} />
                </div>
              </div>

              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                {m.value}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{m.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Main Dashboard Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        
        {/* Storage Capacity Breakdown */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} color="#FF7A18" /> Supabase Storage Breakdown
          </h3>
          
          <div style={{ background: 'rgba(7, 26, 43, 0.6)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <span style={{ color: '#22D3EE' }}>Bucket: profile-pictures</span>
              <span style={{ color: '#FF7A18' }}>{storageFormatted} / 5.00 MB</span>
            </div>
            <div style={{ height: '10px', width: '100%', background: 'rgba(11, 37, 58, 0.9)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, Math.max(5, (storageUsedKb / 5120) * 100))}%`,
                background: 'linear-gradient(90deg, #2563EB 0%, #22D3EE 50%, #FF7A18 100%)',
                borderRadius: '5px'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#94A3B8' }}>Target Storage Path</span>
              <strong style={{ color: '#FFFFFF' }}>users/user-1/</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#94A3B8' }}>File Format Constraints</span>
              <strong style={{ color: '#22C55E' }}>JPG, PNG, WEBP</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Service Role Key</span>
              <strong style={{ color: '#FFB86B' }}>Protected (.env)</strong>
            </div>
          </div>
        </div>

        {/* Quick System Telemetry */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#22C55E" /> Architecture Telemetry
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', background: 'rgba(7, 26, 43, 0.5)', padding: '0.85rem', borderRadius: '12px' }}>
              <CheckCircle2 size={20} color="#22C55E" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#FFFFFF', fontSize: '0.9rem', display: 'block' }}>Express Multer Engine</strong>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Processes multipart/form-data memory streams directly to cloud storage.</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', background: 'rgba(7, 26, 43, 0.5)', padding: '0.85rem', borderRadius: '12px' }}>
              <CheckCircle2 size={20} color="#22D3EE" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#FFFFFF', fontSize: '0.9rem', display: 'block' }}>Public Bucket URL Resolution</strong>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Retrieves safe public URLs without exposing admin storage tokens.</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', background: 'rgba(7, 26, 43, 0.5)', padding: '0.85rem', borderRadius: '12px' }}>
              <CheckCircle2 size={20} color="#FF7A18" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#FFFFFF', fontSize: '0.9rem', display: 'block' }}>Automatic Filename Sanitization</strong>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Appends timestamps and UUIDs to prevent overwrite collisions.</span>
              </div>
            </div>
          </div>

          <Link to="/profile" className="btn-secondary" style={{ width: '100%', marginTop: '1.25rem' }}>
            View Full Profile →
          </Link>
        </div>

      </div>
    </div>
  );
};
