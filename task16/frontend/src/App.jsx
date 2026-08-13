import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ImagePreview } from './components/ImagePreview';
import { ProfileForm } from './components/ProfileForm';
import { Toast } from './components/Toast';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Activity } from './pages/Activity';
import { Help } from './pages/Help';
import { 
  getProfile, 
  updateProfile, 
  uploadProfilePicture, 
  deleteProfilePicture 
} from './services/api';
import { AlertTriangle } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch initial profile
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      if (res.success) {
        setProfile(res.profile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      addToast('error', 'Fetch Failed', 'Could not retrieve profile from backend.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection from UploadZone
  const handleFileSelected = (file) => {
    setUploadError(null);

    // Client-side format & size check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only JPG, PNG and WEBP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Execute Upload to Backend (POST /api/profile/upload -> Supabase Storage)
  const handlePerformUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);
      setUploadError(null);

      const formData = new FormData();
      formData.append('profile', selectedFile);

      const res = await uploadProfilePicture(formData, (progress) => {
        setUploadProgress(progress);
      });

      if (res.success) {
        setProfile(res.profile);
        addToast('success', 'Upload Successful', '✓ Profile picture uploaded successfully to Supabase!');
        closeUploadModal();
      } else {
        setUploadError(res.message || 'Upload failed.');
        addToast('error', 'Upload Error', res.message || 'Failed to upload profile picture.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      const msg = err.response?.data?.message || err.message || 'Upload failed.';
      setUploadError(msg);
      addToast('error', 'Upload Failed', msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Close upload modal
  const closeUploadModal = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    setIsUploading(false);
    setUploadProgress(0);
    setShowUploadModal(false);
  };

  // Handle Edit Profile Save
  const handleSaveProfile = async (updatedData) => {
    try {
      const res = await updateProfile(updatedData);
      if (res.success) {
        setProfile(res.profile);
        addToast('success', 'Profile Updated', 'Profile details saved successfully.');
        setShowEditModal(false);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      addToast('error', 'Update Error', 'Could not save profile details.');
    }
  };

  // Execute Delete Picture
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteProfilePicture();
      if (res.success) {
        setProfile(res.profile);
        addToast('info', 'Picture Removed', 'Profile picture deleted and reset to default.');
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error('Error deleting picture:', err);
      addToast('error', 'Delete Error', 'Failed to remove profile picture.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#071A2B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '3px solid rgba(34, 211, 238, 0.2)',
          borderTopColor: '#FF7A18',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p style={{ color: '#22D3EE', fontWeight: 600 }}>Loading ProfileHub...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Fixed Transparent Glassmorphism Header */}
        <Header profile={profile} />

        {/* Main Content Area */}
        <main style={{ flex: 1, marginTop: '80px', padding: '0 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <>
                    <Home profile={profile} onOpenUpload={() => setShowUploadModal(true)} />
                    <Profile 
                      profile={profile}
                      onOpenUpload={() => setShowUploadModal(true)}
                      onOpenEdit={() => setShowEditModal(true)}
                      onConfirmDelete={() => setShowDeleteModal(true)}
                    />
                  </>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <Profile 
                    profile={profile}
                    onOpenUpload={() => setShowUploadModal(true)}
                    onOpenEdit={() => setShowEditModal(true)}
                    onConfirmDelete={() => setShowDeleteModal(true)}
                  />
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <Dashboard 
                    profile={profile} 
                    onOpenUpload={() => setShowUploadModal(true)} 
                  />
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <Settings 
                    profile={profile}
                    onSaveProfile={handleSaveProfile}
                    onOpenUpload={() => setShowUploadModal(true)}
                  />
                } 
              />
              <Route 
                path="/activity" 
                element={
                  <Activity profile={profile} />
                } 
              />
              <Route 
                path="/help" 
                element={
                  <Help />
                } 
              />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(34, 211, 238, 0.1)',
          padding: '1.5rem 2rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#64748B',
          background: 'rgba(7, 26, 43, 0.9)'
        }}>
          ProfileHub — Secured Express.js & Supabase Storage Integration • {new Date().getFullYear()}
        </footer>

        {/* UPLOAD MODAL */}
        {showUploadModal && (
          <div className="modal-overlay" onClick={closeUploadModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>
              {!selectedFile ? (
                <UploadZone
                  onFileSelected={handleFileSelected}
                  errorMessage={uploadError}
                />
              ) : (
                <ImagePreview
                  file={selectedFile}
                  previewUrl={previewUrl}
                  onUpload={handlePerformUpload}
                  onChangeImage={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  onCancel={closeUploadModal}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />
              )}
            </div>
          </div>
        )}

        {/* EDIT PROFILE MODAL */}
        {showEditModal && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '650px' }}>
              <ProfileForm
                profile={profile}
                onSave={handleSaveProfile}
                onCancel={() => setShowEditModal(false)}
              />
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '420px', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <AlertTriangle size={32} />
              </div>

              <h3 style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Remove profile picture?
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                This will delete your current avatar from Supabase Storage and reset your profile picture to default.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button onClick={() => setShowDeleteModal(false)} className="btn-ghost" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDelete} 
                  disabled={isDeleting}
                  className="btn-danger" 
                  style={{ flex: 1 }}
                >
                  {isDeleting ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST SYSTEM */}
        <Toast toasts={toasts} removeToast={removeToast} />

      </div>
    </Router>
  );
}
