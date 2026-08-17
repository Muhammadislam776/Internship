import React from 'react';
import { DownloadCloud, Share2, HardDrive, FolderCheck } from 'lucide-react';
import Storage3DCard from './Storage3DCard';

export default function StatsCards({ stats }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {/* 3D Flip Card 1: My Files */}
      <Storage3DCard type="files" stats={stats} />

      {/* 3D Flip Card 2: Storage Used */}
      <Storage3DCard type="storage" stats={stats} />

      {/* Stat Card 3: Downloads */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '170px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(7, 26, 43, 0.6)', textTransform: 'uppercase' }}>
            DOWNLOADS
          </span>
          <div style={{ padding: '0.4rem', borderRadius: '50%', background: 'rgba(255, 122, 24, 0.15)', color: 'var(--vibrant-orange)' }}>
            <DownloadCloud size={20} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--midnight-navy)' }}>
            {stats?.totalDownloads || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(7, 26, 43, 0.5)', marginTop: '0.2rem' }}>
            Total downloads across files
          </div>
        </div>
      </div>

      {/* Stat Card 4: Shared Files */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '170px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(7, 26, 43, 0.6)', textTransform: 'uppercase' }}>
            SHARED FILES
          </span>
          <div style={{ padding: '0.4rem', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', color: 'var(--emerald)' }}>
            <Share2 size={20} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--midnight-navy)' }}>
            {stats?.totalShared || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(7, 26, 43, 0.5)', marginTop: '0.2rem' }}>
            Active shared collaborations
          </div>
        </div>
      </div>
    </div>
  );
}
