import React, { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import FileGrid from '../components/FileGrid';
import FilePreviewModal from '../components/FilePreviewModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { fileService } from '../services/fileService';

export default function SharedFiles({ showToast }) {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const loadSharedData = async () => {
    try {
      setLoading(true);
      const data = await fileService.getSharedFiles();
      setSharedFiles(data);
    } catch (err) {
      console.error('Failed to load shared files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSharedData();
  }, []);

  const handleDownload = async (file) => {
    await fileService.downloadFile(file);
    if (showToast) showToast(`Downloading ${file.file_name}...`, 'success');
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--midnight-navy)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Share2 size={28} color="var(--cyber-cyan)" /> Shared Files
        </h1>
        <p style={{ color: 'rgba(7, 26, 43, 0.6)', fontSize: '0.95rem' }}>
          Files that other users have shared explicitly with you
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : (
        <FileGrid 
          files={sharedFiles}
          onPreview={setSelectedFile}
          onDownload={handleDownload}
          onFavoriteToggle={() => {}}
          onDelete={() => {}}
          onShare={() => {}}
        />
      )}

      {selectedFile && (
        <FilePreviewModal 
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDownload={handleDownload}
          onFavoriteToggle={() => {}}
          onDelete={() => {}}
          onShare={() => {}}
        />
      )}
    </div>
  );
}
