import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, RotateCcw } from 'lucide-react';
import FileGrid from '../components/FileGrid';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { fileService } from '../services/fileService';

export default function Trash({ showToast, onStorageUpdate }) {
  const [trashFiles, setTrashFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileToDeletePermanently, setFileToDeletePermanently] = useState(null);

  const loadTrash = async () => {
    try {
      setLoading(true);
      const data = await fileService.getFiles({ isTrash: true });
      setTrashFiles(data);
    } catch (err) {
      console.error('Failed to load trash:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (fileId) => {
    await fileService.restoreFile(fileId);
    loadTrash();
    if (showToast) showToast('File restored successfully!', 'success');
  };

  const handlePermanentDeleteConfirm = async () => {
    if (!fileToDeletePermanently) return;
    await fileService.deletePermanently(fileToDeletePermanently);
    setFileToDeletePermanently(null);
    loadTrash();
    if (showToast) showToast('File permanently deleted from storage.', 'info');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--midnight-navy)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Trash2 size={28} color="var(--red)" /> Trash Bin
          </h1>
          <p style={{ color: 'rgba(7, 26, 43, 0.6)', fontSize: '0.95rem' }}>
            Files in trash can be restored or permanently removed
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : (
        <FileGrid 
          files={trashFiles}
          onPreview={() => {}}
          onDownload={() => {}}
          onFavoriteToggle={() => {}}
          onDelete={(id) => setFileToDeletePermanently(id)}
          onRestore={handleRestore}
          onShare={() => {}}
          isTrash={true}
        />
      )}

      {fileToDeletePermanently && (
        <ConfirmModal 
          title="Delete Permanently?"
          message="WARNING: This action cannot be undone. The actual file payload will be permanently deleted from storage."
          confirmText="Delete Permanently"
          isDanger={true}
          onConfirm={handlePermanentDeleteConfirm}
          onClose={() => setFileToDeletePermanently(null)}
        />
      )}
    </div>
  );
}
