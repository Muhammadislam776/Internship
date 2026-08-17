import React from 'react';
import { 
  Star, 
  Download, 
  Share2, 
  Trash2, 
  Eye, 
  RotateCcw
} from 'lucide-react';
import { getFileIcon } from '../utils/fileIcons';
import { formatBytes } from '../services/analyticsService';

export default function FileCard({ 
  file, 
  onPreview, 
  onDownload, 
  onFavoriteToggle, 
  onDelete, 
  onRestore, 
  onShare,
  isTrash = false 
}) {
  const isImage = file.file_type === 'image' || (file.mime_type && file.mime_type.startsWith('image/'));
  const formattedDate = new Date(file.created_at || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="glass-card file-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      {/* Top Bar: Icon + Favorite */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{
            padding: '0.6rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(7, 26, 43, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {getFileIcon(file.file_type, file.mime_type, file.file_name)}
          </div>

          {!isTrash && (
            <button 
              className="btn-icon"
              onClick={() => onFavoriteToggle(file.id)}
              style={{ color: file.is_favorite ? 'var(--vibrant-orange)' : 'rgba(7, 26, 43, 0.3)' }}
              title={file.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star size={18} fill={file.is_favorite ? 'var(--vibrant-orange)' : 'none'} />
            </button>
          )}
        </div>

        {/* Thumbnail Preview for Images */}
        {isImage && file.preview_url ? (
          <div 
            onClick={() => onPreview(file)}
            style={{
              width: '100%',
              height: '120px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '1rem',
              cursor: 'pointer',
              background: 'rgba(7, 26, 43, 0.05)',
              position: 'relative'
            }}
          >
            <img 
              src={file.preview_url} 
              alt={file.file_name} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
        ) : null}

        {/* File Name & Type */}
        <h4 
          onClick={() => onPreview(file)}
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--midnight-navy)',
            marginBottom: '0.4rem',
            cursor: 'pointer',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          title={file.file_name}
        >
          {file.file_name}
        </h4>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: 'rgba(7, 26, 43, 0.6)', marginBottom: '1rem' }}>
          <span>{formatBytes(file.file_size)}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Footer / Actions */}
      <div style={{
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(7, 26, 43, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {isTrash ? (
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <button 
              className="btn btn-secondary" 
              style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}
              onClick={() => onRestore(file.id)}
            >
              <RotateCcw size={14} /> Restore
            </button>
            <button 
              className="btn btn-danger" 
              style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}
              onClick={() => onDelete(file.id, true)}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        ) : (
          <>
            <button 
              className="btn-icon" 
              onClick={() => onPreview(file)}
              title="View Details & Preview"
            >
              <Eye size={16} />
            </button>

            <button 
              className="btn-icon" 
              onClick={() => onShare(file)}
              title="Share File"
            >
              <Share2 size={16} />
            </button>

            <button 
              className="btn btn-orange" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.3rem' }}
              onClick={() => onDownload(file)}
              title="Download File"
            >
              <Download size={14} /> Download
            </button>

            <button 
              className="btn-icon" 
              onClick={() => onDelete(file.id, false)}
              style={{ color: 'var(--red)' }}
              title="Move to Trash"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
