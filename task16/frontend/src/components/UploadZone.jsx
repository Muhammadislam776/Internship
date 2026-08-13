import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, FileCode, CheckCircle2 } from 'lucide-react';

export const UploadZone = ({ onFileSelected, errorMessage }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.35rem' }}>
          Update Profile Picture
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
          Upload a high-resolution JPG, PNG, or WEBP image.
        </p>
      </div>

      {errorMessage && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          color: '#F87171',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: isDragOver ? '2px dashed #FF7A18' : '2px dashed rgba(34, 211, 238, 0.35)',
          borderRadius: '16px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          background: isDragOver ? 'rgba(255, 122, 24, 0.08)' : 'rgba(7, 26, 43, 0.4)',
          boxShadow: isDragOver ? '0 0 25px rgba(255, 122, 24, 0.25)' : 'none',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.85rem'
        }}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/jpeg,image/png,image/webp" 
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(37, 99, 235, 0.2)',
          border: '1px solid rgba(34, 211, 238, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#22D3EE',
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)'
        }}>
          <UploadCloud size={28} />
        </div>

        <div>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>
            Drag & Drop your image here
          </p>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            or <span style={{ color: '#FF7A18', fontWeight: 600, textDecoration: 'underline' }}>Browse Files</span> from your device
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.75rem',
          color: '#64748B',
          marginTop: '0.5rem',
          background: 'rgba(11, 37, 58, 0.6)',
          padding: '0.4rem 0.85rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <span>Formats: <strong>JPG, PNG, WEBP</strong></span>
          <span>•</span>
          <span>Max size: <strong>5MB</strong></span>
        </div>
      </div>
    </div>
  );
};
