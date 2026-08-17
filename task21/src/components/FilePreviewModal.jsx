import React from 'react';
import { X, Download, Share2, Trash2, Star, Calendar, HardDrive, DownloadCloud, UserCheck } from 'lucide-react';
import { getFileIcon } from '../utils/fileIcons';
import { formatBytes } from '../services/analyticsService';

export default function FilePreviewModal({ 
  file, 
  onClose, 
  onDownload, 
  onFavoriteToggle, 
  onDelete, 
  onShare 
}) {
  if (!file) return null;

  const isImage = file.file_type === 'image' || (file.mime_type && file.mime_type.startsWith('image/'));
  const formattedDate = new Date(file.created_at || Date.now()).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(7, 26, 43, 0.1)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(7, 26, 43, 0.05)', borderRadius: 'var(--radius-md)' }}>
              {getFileIcon(file.file_type, file.mime_type, file.file_name)}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--midnight-navy)' }}>{file.file_name}</h3>
              <span style={{ fontSize: '0.8rem', color: 'rgba(7, 26, 43, 0.5)', textTransform: 'uppercase' }}>{file.file_type || 'File Details'}</span>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Visual Preview Container */}
        {isImage && file.preview_url ? (
          <div style={{
            width: '100%',
            maxHeight: '260px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '1.5rem',
            background: 'rgba(7, 26, 43, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={file.preview_url} 
              alt={file.file_name} 
              style={{ maxWidth: '100%', maxHeight: '260px', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div style={{
            padding: '2.5rem',
            background: 'rgba(37, 99, 235, 0.04)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            gap: '0.75rem'
          }}>
            {getFileIcon(file.file_type, file.mime_type, file.file_name)}
            <span style={{ fontSize: '0.9rem', color: 'rgba(7, 26, 43, 0.6)' }}>Preview not available for this file type</span>
          </div>
        )}

        {/* Metadata Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1.5rem',
          background: 'var(--soft-white)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HardDrive size={18} color="var(--electric-blue)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(7, 26, 43, 0.5)' }}>File Size</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatBytes(file.file_size)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar size={18} color="var(--cyber-cyan)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(7, 26, 43, 0.5)' }}>Upload Date</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{formattedDate}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <DownloadCloud size={18} color="var(--vibrant-orange)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(7, 26, 43, 0.5)' }}>Total Downloads</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{file.download_count || 0} times</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <UserCheck size={18} color="var(--emerald)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(7, 26, 43, 0.5)' }}>Owner</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Authenticated User</div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => onFavoriteToggle(file.id)}
            style={{ color: file.is_favorite ? 'var(--vibrant-orange)' : 'inherit' }}
          >
            <Star size={16} fill={file.is_favorite ? 'var(--vibrant-orange)' : 'none'} />
            {file.is_favorite ? 'Favorited' : 'Favorite'}
          </button>

          <button className="btn btn-secondary" onClick={() => { onClose(); onShare(file); }}>
            <Share2 size={16} /> Share
          </button>

          <button className="btn btn-orange" onClick={() => onDownload(file)}>
            <Download size={16} /> Download File
          </button>
        </div>
      </div>
    </div>
  );
}
