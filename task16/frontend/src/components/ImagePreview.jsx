import React from 'react';
import { Upload, RefreshCw, X, FileText, CheckCircle2, Loader2 } from 'lucide-react';

export const ImagePreview = ({ 
  file, 
  previewUrl, 
  onUpload, 
  onChangeImage, 
  onCancel, 
  isUploading, 
  uploadProgress 
}) => {
  // Format file size nicely
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
          Image Preview
        </h3>
        {!isUploading && (
          <button onClick={onCancel} style={{ background: 'transparent', color: '#94A3B8' }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Preview Box */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem',
        background: 'rgba(7, 26, 43, 0.6)',
        borderRadius: '16px',
        border: '1px solid rgba(34, 211, 238, 0.2)',
        gap: '1.25rem'
      }}>
        {/* Preview Thumbnail */}
        <div style={{
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          padding: '3px',
          background: 'linear-gradient(135deg, #22D3EE 0%, #FF7A18 100%)',
          boxShadow: '0 0 25px rgba(34, 211, 238, 0.3)',
          overflow: 'hidden'
        }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* File Metadata Details */}
        <div style={{
          width: '100%',
          background: 'rgba(11, 37, 58, 0.8)',
          borderRadius: '12px',
          padding: '0.85rem 1.1rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.75rem',
          fontSize: '0.825rem'
        }}>
          <div>
            <span style={{ color: '#64748B', display: 'block' }}>File Name</span>
            <strong style={{ color: '#FFFFFF', wordBreak: 'break-all' }}>{file?.name}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B', display: 'block' }}>File Size</span>
            <strong style={{ color: '#FFB86B' }}>{formatSize(file?.size)}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B', display: 'block' }}>File Type</span>
            <strong style={{ color: '#22D3EE' }}>{file?.type}</strong>
          </div>
        </div>

        {/* Animated Progress Indicator */}
        {isUploading && (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              <span style={{ color: '#22D3EE', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Loader2 size={14} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
                Uploading to Supabase Storage...
              </span>
              <span style={{ color: '#FF7A18' }}>{uploadProgress}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(7, 26, 43, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${uploadProgress}%`,
                background: 'linear-gradient(90deg, #2563EB 0%, #22D3EE 50%, #FF7A18 100%)',
                borderRadius: '4px',
                transition: 'width 0.2s ease'
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          onClick={onCancel}
          disabled={isUploading}
          className="btn-ghost"
          style={{ opacity: isUploading ? 0.5 : 1 }}
        >
          Cancel
        </button>

        <button
          onClick={onChangeImage}
          disabled={isUploading}
          className="btn-secondary"
          style={{ opacity: isUploading ? 0.5 : 1 }}
        >
          <RefreshCw size={16} /> Change Image
        </button>

        <button
          onClick={onUpload}
          disabled={isUploading}
          className="btn-primary"
          style={{ opacity: isUploading ? 0.7 : 1, minWidth: '140px' }}
        >
          {isUploading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} /> Upload Image
            </>
          )}
        </button>
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
