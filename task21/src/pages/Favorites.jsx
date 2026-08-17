import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import FileGrid from '../components/FileGrid';
import FilePreviewModal from '../components/FilePreviewModal';
import ShareModal from '../components/ShareModal';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { fileService } from '../services/fileService';

export default function Favorites({ showToast }) {
  const [favoriteFiles, setFavoriteFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToShare, setFileToShare] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await fileService.getFiles({ isFavorite: true, isTrash: false });
      setFavoriteFiles(data);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleFavoriteToggle = async (fileId) => {
    await fileService.toggleFavorite(fileId);
    loadFavorites();
    if (showToast) showToast('Removed from favorites', 'info');
  };

  const handleDownload = async (file) => {
    await fileService.downloadFile(file);
    if (showToast) showToast(`Downloading ${file.file_name}...`, 'success');
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    await fileService.moveToTrash(fileToDelete);
    setFileToDelete(null);
    loadFavorites();
    if (showToast) showToast('File moved to Trash', 'info');
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--midnight-navy)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Star size={28} color="var(--vibrant-orange)" fill="var(--vibrant-orange)" /> Favorites
        </h1>
        <p style={{ color: 'rgba(7, 26, 43, 0.6)', fontSize: '0.95rem' }}>
          Quick access to all your starred and important files
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : (
        <FileGrid 
          files={favoriteFiles}
          onPreview={setSelectedFile}
          onDownload={handleDownload}
          onFavoriteToggle={handleFavoriteToggle}
          onDelete={(id) => setFileToDelete(id)}
          onShare={setFileToShare}
        />
      )}

      {selectedFile && (
        <FilePreviewModal 
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDownload={handleDownload}
          onFavoriteToggle={handleFavoriteToggle}
          onDelete={(id) => setFileToDelete(id)}
          onShare={setFileToShare}
        />
      )}

      {fileToShare && (
        <ShareModal 
          file={fileToShare}
          onClose={() => setFileToShare(null)}
          showToast={showToast}
        />
      )}

      {fileToDelete && (
        <ConfirmModal 
          title="Move to Trash?"
          message="This file will be moved to Trash."
          confirmText="Move to Trash"
          isDanger={false}
          onConfirm={handleDeleteConfirm}
          onClose={() => setFileToDelete(null)}
        />
      )}
    </div>
  );
}
