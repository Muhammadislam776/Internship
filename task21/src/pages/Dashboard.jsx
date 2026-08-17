import React, { useState, useEffect } from 'react';
import { Play, UploadCloud, Folder, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCards from '../components/StatsCards';
import UploadZone from '../components/UploadZone';
import FileGrid from '../components/FileGrid';
import FilePreviewModal from '../components/FilePreviewModal';
import ShareModal from '../components/ShareModal';
import ConfirmModal from '../components/ConfirmModal';
import HowItWorksModal from '../components/HowItWorksModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { analyticsService } from '../services/analyticsService';
import { fileService } from '../services/fileService';

export default function Dashboard({ user, showToast, onStorageUpdate }) {
  const [stats, setStats] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToShare, setFileToShare] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await analyticsService.getDashboardStats();
      const files = await fileService.getFiles({ isTrash: false, sortBy: 'newest' });
      setStats(dashboardStats);
      setRecentFiles(files.slice(0, 6)); // top 6 recent
      if (onStorageUpdate) onStorageUpdate(dashboardStats);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleFavoriteToggle = async (fileId) => {
    await fileService.toggleFavorite(fileId);
    loadDashboardData();
    if (showToast) showToast('Updated favorite status', 'info');
  };

  const handleDownload = async (file) => {
    await fileService.downloadFile(file);
    if (showToast) showToast(`Downloading ${file.file_name}...`, 'success');
    loadDashboardData();
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    await fileService.moveToTrash(fileToDelete);
    setFileToDelete(null);
    loadDashboardData();
    if (showToast) showToast('File moved to Trash', 'info');
  };

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--midnight-navy)' }}>
            Welcome back, {user?.fullName || 'User'} 👋
          </h1>
          <p style={{ color: 'rgba(7, 26, 43, 0.6)', fontSize: '0.95rem' }}>
            Manage your personal files and real-time cloud storage
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-orange" 
            onClick={() => setShowWorkflowModal(true)}
            style={{ gap: '0.5rem' }}
          >
            <Play size={16} fill="white" /> How ShareVault Works
          </button>

          <button 
            className="btn btn-primary"
            onClick={() => setShowUpload(!showUpload)}
            style={{ gap: '0.5rem' }}
          >
            <UploadCloud size={18} /> {showUpload ? 'Close Upload' : 'Upload Files'}
          </button>
        </div>
      </div>

      {/* Analytics & 3D Cards */}
      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : (
        <StatsCards stats={stats} />
      )}

      {/* Upload Zone Drawer */}
      {showUpload && (
        <UploadZone 
          onUploadComplete={() => {
            loadDashboardData();
            setShowUpload(false);
          }} 
          showToast={showToast} 
        />
      )}

      {/* Recent Activity Section */}
      <div style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--midnight-navy)' }}>
            Recent Files
          </h2>
          <Link to="/files" style={{ color: 'var(--electric-blue)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View All Files <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="card" count={4} />
        ) : (
          <FileGrid 
            files={recentFiles}
            onPreview={setSelectedFile}
            onDownload={handleDownload}
            onFavoriteToggle={handleFavoriteToggle}
            onDelete={(id) => setFileToDelete(id)}
            onShare={setFileToShare}
          />
        )}
      </div>

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
          message="This file will be moved to the Trash bin. You can restore it anytime from the Trash section."
          confirmText="Move to Trash"
          isDanger={false}
          onConfirm={handleDeleteConfirm}
          onClose={() => setFileToDelete(null)}
        />
      )}

      {showWorkflowModal && (
        <HowItWorksModal onClose={() => setShowWorkflowModal(false)} />
      )}
    </div>
  );
}
