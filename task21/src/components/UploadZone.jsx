import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';
import { fileService } from '../services/fileService';

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.txt', '.csv'];
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export default function UploadZone({ onUploadComplete, showToast }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `File type "${ext}" is not allowed. Supported types: PDF, DOC, XLS, PPT, JPG, PNG, GIF, ZIP, TXT, CSV.`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File size exceeds the 50MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`;
    }
    return null;
  };

  const handleFiles = async (files) => {
    setErrorMessage('');
    const validFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);
      if (error) {
        setErrorMessage(error);
        if (showToast) showToast(error, 'error');
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Build upload queue state
    const queueItems = validFiles.map((file, idx) => ({
      id: `${Date.now()}_${idx}`,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading', // uploading, complete, error
      error: null,
    }));

    setUploadQueue(prev => [...prev, ...queueItems]);

    // Process uploads sequentially
    for (const item of queueItems) {
      try {
        // Simulate smooth progress animation
        const interval = setInterval(() => {
          setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: Math.min(q.progress + 25, 90) } : q));
        }, 150);

        await fileService.uploadFile(item.file);
        clearInterval(interval);

        setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: 100, status: 'complete' } : q));
        if (showToast) showToast(`✓ Upload Complete: ${item.name}`, 'success');
      } catch (err) {
        setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'error', error: err.message } : q));
        if (showToast) showToast(`Failed to upload ${item.name}: ${err.message}`, 'error');
      }
    }

    if (onUploadComplete) onUploadComplete();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <div 
        className={`dropzone-container ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          multiple 
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--electric-blue)', marginBottom: '1rem' }}>
          <UploadCloud size={42} color="var(--cyber-cyan)" />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--midnight-navy)' }}>
          Drop your files here
        </h3>
        <p style={{ color: 'rgba(7, 26, 43, 0.6)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
          or <span style={{ color: 'var(--electric-blue)', fontWeight: 600, textDecoration: 'underline' }}>Browse Files</span> from your computer
        </p>
        <div style={{ fontSize: '0.8rem', color: 'rgba(7, 26, 43, 0.5)' }}>
          Supports: PDF, DOCX, XLSX, PPTX, JPG, PNG, GIF, ZIP, TXT (Max 50MB per file)
        </div>
      </div>

      {/* Validation Error Message */}
      {errorMessage && (
        <div style={{
          marginTop: '1rem',
          padding: '0.8rem 1rem',
          background: 'var(--red-glass)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--red)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Queue & Progress List */}
      {uploadQueue.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--midnight-navy)', marginBottom: '0.8rem' }}>
            Uploading Files ({uploadQueue.filter(q => q.status === 'complete').length}/{uploadQueue.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {uploadQueue.map((item) => (
              <div key={item.id} style={{
                background: 'var(--soft-white)',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(7, 26, 43, 0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <FileText size={18} color="var(--electric-blue)" />
                    <span>{item.name}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                    {item.status === 'complete' ? (
                      <span style={{ color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={16} /> Complete
                      </span>
                    ) : item.status === 'error' ? (
                      <span style={{ color: 'var(--red)' }}>Error</span>
                    ) : (
                      <span style={{ color: 'var(--electric-blue)' }}>{item.progress}%</span>
                    )}
                  </div>
                </div>

                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${item.progress}%`,
                      backgroundColor: item.status === 'complete' ? 'var(--emerald)' : item.status === 'error' ? 'var(--red)' : 'var(--cyber-cyan)'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
