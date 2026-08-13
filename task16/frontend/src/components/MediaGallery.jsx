import React, { useState } from 'react';
import { Image as ImageIcon, ExternalLink, Calendar, Check, Eye } from 'lucide-react';

export const MediaGallery = ({ uploads = [], currentAvatar }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={18} color="#22D3EE" /> Profile Media & Uploads
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>History of stored profile avatars</p>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF7A18', background: 'rgba(255, 122, 24, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
          {uploads.length} Saved
        </span>
      </div>

      {uploads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B', fontSize: '0.875rem' }}>
          No previous upload history available.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '1rem'
        }}>
          {uploads.map((item, idx) => {
            const isCurrent = item.url === currentAvatar;
            return (
              <div
                key={item.id || idx}
                onClick={() => setSelectedMedia(item)}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isCurrent ? '2px solid #FF7A18' : '1px solid rgba(34, 211, 238, 0.2)',
                  boxShadow: isCurrent ? '0 0 15px rgba(255, 122, 24, 0.4)' : 'none',
                  transition: 'all 0.3s ease'
                }}
                className="media-card-item"
              >
                <img
                  src={item.url}
                  alt={item.fileName || 'Upload'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />

                {isCurrent && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: '#FF7A18',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={12} />
                  </div>
                )}

                {/* Hover Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(7, 26, 43, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.25s ease'
                }} className="hover-overlay">
                  <Eye size={20} color="#22D3EE" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Preview Modal for Selected Media */}
      {selectedMedia && (
        <div className="modal-overlay" onClick={() => setSelectedMedia(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '1.5rem', textAlign: 'center', maxWidth: '420px' }}>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '1rem' }}>Media Details</h4>
            <div style={{ width: '180px', height: '180px', margin: '0 auto 1.25rem auto', borderRadius: '50%', overflow: 'hidden', border: '3px solid #22D3EE', boxShadow: '0 0 25px rgba(34, 211, 238, 0.4)' }}>
              <img src={selectedMedia.url} alt="Detail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
              File: <strong style={{ color: '#FFFFFF' }}>{selectedMedia.fileName}</strong>
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Uploaded: {new Date(selectedMedia.uploadedAt).toLocaleDateString()}
            </p>
            <button onClick={() => setSelectedMedia(null)} className="btn-primary" style={{ width: '100%' }}>
              Close Preview
            </button>
          </div>
        </div>
      )}

      <style>{`
        .media-card-item:hover img {
          transform: scale(1.12);
        }
        .media-card-item:hover .hover-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};
