import React from 'react';
import FileCard from './FileCard';

export default function FileGrid({ 
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {files.map(file => (
        <FileCard 
          key={file.id} 
          file={file} 
          onPreview={onPreview}
          onDownload={onDownload}
          onFavoriteToggle={onFavoriteToggle}
          onDelete={onDelete}
          onRestore={onRestore}
          onShare={onShare}
          isTrash={isTrash}
        />
      ))}
    </div>
  );
}
