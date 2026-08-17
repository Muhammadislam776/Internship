import React, { useState } from 'react';
import { Folder, HardDrive, RotateCw } from 'lucide-react';

export default function Storage3DCard({ type = 'files', stats }) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (type === 'files') {
    const total = stats?.totalFiles || 0;
    const docs = stats?.counts?.documents || 0;
    const imgs = stats?.counts?.images || 0;
    const others = (stats?.counts?.videos || 0) + (stats?.counts?.archives || 0) + (stats?.counts?.other || 0);

    return (
      <div 
        className="perspective-container" 
        style={{ height: '170px' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Card Front */}
          <div className="glass-card flip-card-front" style={{ height: '170px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(7, 26, 43, 0.6)', textTransform: 'uppercase' }}>
                MY FILES
              </span>
              <div style={{ padding: '0.4rem', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--electric-blue)' }}>
                <Folder size={20} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--midnight-navy)' }}>{total}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--electric-blue)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                <RotateCw size={12} /> Hover or tap to flip breakdown
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div className="flip-card-back" style={{ height: '170px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--cyber-cyan)', fontWeight: 700, marginBottom: '0.6rem' }}>
              FILE CATEGORY BREAKDOWN
            </div>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' }}>
              <div>📄 <strong>{docs}</strong> documents</div>
              <div>🖼️ <strong>{imgs}</strong> images</div>
              <div>📦 <strong>{others}</strong> other files</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Storage Used Card
  const formattedUsed = stats?.formattedStorageUsed || '0 B';
  const percentage = stats?.usedPercentage || 0;

  return (
    <div 
      className="perspective-container" 
      style={{ height: '170px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Card Front */}
        <div className="glass-card flip-card-front" style={{ height: '170px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(7, 26, 43, 0.6)', textTransform: 'uppercase' }}>
              STORAGE USED
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '50%', background: 'rgba(34, 211, 238, 0.15)', color: 'var(--cyber-cyan)' }}>
              <HardDrive size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--midnight-navy)' }}>{formattedUsed}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--electric-blue)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
              <RotateCw size={12} /> Hover or tap to flip details
            </div>
          </div>
        </div>

        {/* Card Back */}
        <div className="flip-card-back" style={{ height: '170px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--cyber-cyan)', fontWeight: 700, marginBottom: '0.4rem' }}>
            STORAGE CAPACITY
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--white)', marginBottom: '0.2rem' }}>
            {percentage}%
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
            of 10 GB available storage capacity allocated.
          </div>
        </div>
      </div>
    </div>
  );
}
