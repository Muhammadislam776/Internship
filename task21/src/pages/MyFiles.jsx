import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UploadCloud, Folder } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import FileGrid from '../components/FileGrid';
import FileList from '../components/FileList';
import UploadZone from '../components/UploadZone';
import FilePreviewModal from '../components/FilePreviewModal';
import ShareModal from '../components/ShareModal';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { fileService } from '../services/fileService';
import { analyticsService } from '../services/analyticsService';

export default function MyFiles({ showToast, onStorageUpdate }) {
  const location = useLocation();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showUploadZone, setShowUploadZone] = useState(location.search.includes('upload'));

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToShare, setFileToShare] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);

  const loadFilesData = async () => {
    try {
      setLoading(true);
      const data = await fileService.getFiles({
        category: selectedCategory,
        isTrash: false,
        searchQuery,
        sortBy
      });
      setFiles(data);
      if (onStorageUpdate) {
        const stats = await analyticsService.getDashboardStats();
        onStorageUpdate(stats);
      }
    } catch (err) {
      console.error('Failed to load files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilesData();
  }, [selectedCategory, searchQuery, sortBy]);

  const handleFavoriteToggle = async (fileId) => {
    await fileService.toggleFavorite(fileId);
    loadFilesData();
    if (showToast) showToast('Updated favorite status', 'info');
  };

  const handleDownload = async (file) => {
    await fileService.downloadFile(file);
    if (showToast) showToast(`Downloading ${file.file_name}...`, 'success');
    loadFilesData();
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    await fileService.moveToTrash(fileToDelete);
    setFileToDelete(null);
    loadFilesData();
    if (showToast) showToast('File moved to Trash', 'info');
  };

  return (
    <div>
      {/* Title + Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--midnight-navy)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Folder size={28} color="var(--electric-blue)" /> My Files
          </h1>
          <p style={{ color: 'rgba(7, 26, 43, 0.6)', fontSize: '0.95rem' }}>
            All your uploaded documents, images, and archives in one place
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowUploadZone(!showUploadZone)}
          style={{ gap: '0.5rem' }}
        >
          <UploadCloud size={18} /> {showUploadZone ? 'Close Upload' : 'Upload New File'}
        </button>
      </div>

      {/* Upload Zone */}
      {showUploadZone && (
        <UploadZone 
          onUploadComplete={() => {
            loadFilesData();
            setShowUploadZone(false);
          }}
          showToast={showToast}
        />
      )}

      {/* Global Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Category Pills & Controls */}
      <FilterBar 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Main Files Display */}
      {loading ? (
        <LoadingSkeleton type="card" count={8} />
      ) : viewMode === 'grid' ? (
        <FileGrid 
          files={files}
          onPreview={setSelectedFile}
          onDownload={handleDownload}
          onFavoriteToggle={handleFavoriteToggle}
          onDelete={(id) => setFileToDelete(id)}
          onShare={setFileToShare}
        />
      ) : (
        <FileList 
          files={files}
          onPreview={setSelectedFile}
          onDownload={handleDownload}
          onFavoriteToggle={handleFavoriteToggle}
          onDelete={(id) => setFileToDelete(id)}
          onShare={setFileToShare}
        />
      )}

      {/* Modals */}
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
          message="This file will be moved to the Trash bin. You can restore it anytime."
          confirmText="Move to Trash"
          isDanger={false}
          onConfirm={handleDeleteConfirm}
          onClose={() => setFileToDelete(null)}
        />
      )}
    </div>
  );
}
