import React from 'react';
import { Eye, Download, Share2, Trash2, Star, RotateCcw } from 'lucide-react';
import { getFileIcon } from '../utils/fileIcons';
import { formatBytes } from '../services/analyticsService';

export default function FileList({ 
  files, 
  onPreview, 
  onDownload, 
  onFavoriteToggle, 
  onDelete, 
  onRestore, 
  onShare,
  isTrash = false 
}) {
  if (!files || files.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'rgba(7, 26, 43, 0.5)' }}>
        <h3>No files found</h3>
        <p style={{ fontSize: '0.9rem', marginTop: '0.4rem' }}>Upload files to start managing them here.</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ overflowX: 'auto', marginBottom: '2rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(7, 26, 43, 0.1)', color: 'rgba(7, 26, 43, 0.6)', fontWeight: 600 }}>
            <th style={{ padding: '1rem' }}>File Name</th>
            <th style={{ padding: '1rem' }}>Type</th>
            <th style={{ padding: '1rem' }}>Size</th>
            <th style={{ padding: '1rem' }}>Uploaded</th>
            <th style={{ padding: '1rem' }}>Downloads</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => {
            const formattedDate = new Date(file.created_at || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <tr key={file.id} style={{ borderBottom: '1px solid rgba(7, 26, 43, 0.05)', transition: 'var(--transition)' }}>
                <td style={{ padding: '0.8rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {!isTrash && (
                      <button 
                        onClick={() => onFavoriteToggle(file.id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: file.is_favorite ? 'var(--vibrant-orange)' : 'rgba(7,26,43,0.2)' }}
                      >
                        <Star size={16} fill={file.is_favorite ? 'var(--vibrant-orange)' : 'none'} />
                      </button>
                    )}
                    <div style={{ cursor: 'pointer' }} onClick={() => onPreview(file)}>
                      {getFileIcon(file.file_type, file.mime_type, file.file_name)}
                    </div>
                    <span 
                      onClick={() => onPreview(file)}
                      style={{ fontWeight: 600, color: 'var(--midnight-navy)', cursor: 'pointer' }}
                    >
                      {file.file_name}
                    </span>
                  </div>
                </td>

                <td style={{ padding: '0.8rem 1rem', textTransform: 'capitalize', color: 'rgba(7, 26, 43, 0.7)' }}>
                  {file.file_type || 'document'}
                </td>

                <td style={{ padding: '0.8rem 1rem', color: 'rgba(7, 26, 43, 0.7)' }}>
                  {formatBytes(file.file_size)}
                </td>

                <td style={{ padding: '0.8rem 1rem', color: 'rgba(7, 26, 43, 0.7)' }}>
                  {formattedDate}
                </td>

                <td style={{ padding: '0.8rem 1rem', color: 'rgba(7, 26, 43, 0.7)' }}>
                  {file.download_count || 0}
                </td>

                <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                    {isTrash ? (
                      <>
                        <button className="btn-icon" onClick={() => onRestore(file.id)} title="Restore">
                          <RotateCcw size={16} />
                        </button>
                        <button className="btn-icon" onClick={() => onDelete(file.id, true)} style={{ color: 'var(--red)' }} title="Delete Permanently">
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn-icon" onClick={() => onPreview(file)} title="View Details">
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon" onClick={() => onShare(file)} title="Share File">
                          <Share2 size={16} />
                        </button>
                        <button className="btn-icon" onClick={() => onDownload(file)} style={{ color: 'var(--vibrant-orange)' }} title="Download File">
                          <Download size={16} />
                        </button>
                        <button className="btn-icon" onClick={() => onDelete(file.id, false)} style={{ color: 'var(--red)' }} title="Move to Trash">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
