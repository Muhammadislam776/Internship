import { supabase, isSupabaseConfigured } from './supabase';
import { authService } from './authService';

const LOCAL_FILES_KEY = 'sharevault_files';
const LOCAL_SHARES_KEY = 'sharevault_shares';

// Helper to retrieve local files array
function getLocalFiles() {
  const data = localStorage.getItem(LOCAL_FILES_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveLocalFiles(files) {
  localStorage.setItem(LOCAL_FILES_KEY, JSON.stringify(files));
}

function getLocalShares() {
  const data = localStorage.getItem(LOCAL_SHARES_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveLocalShares(shares) {
  localStorage.setItem(LOCAL_SHARES_KEY, JSON.stringify(shares));
}

export const fileService = {
  // Upload file
  async uploadFile(fileObj, onProgress) {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User is not authenticated.');

    // 1. Send file payload to backend express server to store actual file binary
    const formData = new FormData();
    formData.append('file', fileObj);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to upload file to storage.');
    }

    const data = await response.json();
    const serverFile = data.file;

    const fileRecord = {
      id: serverFile.id,
      user_id: user.id,
      file_name: serverFile.file_name,
      original_name: serverFile.original_name,
      storage_path: serverFile.storage_path,
      file_size: serverFile.file_size,
      mime_type: serverFile.mime_type,
      file_type: serverFile.file_type,
      is_favorite: false,
      is_deleted: false,
      download_count: 0,
      preview_url: serverFile.preview_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      // Save metadata to Supabase PostgreSQL table
      const { data: dbData, error } = await supabase.from('files').insert([fileRecord]).select().single();
      if (error) {
        console.warn('Supabase DB Insert error, saving locally:', error);
      } else {
        return dbData;
      }
    }

    // Save locally
    const currentFiles = getLocalFiles();
    currentFiles.unshift(fileRecord);
    saveLocalFiles(currentFiles);

    return fileRecord;
  },

  // Get user files with filtering
  async getFiles({ category = 'all', isFavorite = false, isTrash = false, searchQuery = '', sortBy = 'newest' } = {}) {
    const user = authService.getCurrentUser();
    if (!user) return [];

    let filesList = [];

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('files').select('*').eq('user_id', user.id);
        if (isTrash) {
          query = query.eq('is_deleted', true);
        } else {
          query = query.eq('is_deleted', false);
        }

        if (isFavorite) {
          query = query.eq('is_favorite', true);
        }

        if (category && category !== 'all') {
          query = query.eq('file_type', category);
        }

        const { data, error } = await query;
        if (!error && data) {
          filesList = data;
        } else {
          filesList = getLocalFiles().filter(f => f.user_id === user.id);
        }
      } catch (err) {
        filesList = getLocalFiles().filter(f => f.user_id === user.id);
      }
    } else {
      filesList = getLocalFiles().filter(f => f.user_id === user.id);
    }

    // Filter by trash status
    filesList = filesList.filter(f => isTrash ? f.is_deleted : !f.is_deleted);

    // Filter by favorites
    if (isFavorite) {
      filesList = filesList.filter(f => f.is_favorite);
    }

    // Filter by category
    if (category && category !== 'all') {
      filesList = filesList.filter(f => f.file_type === category);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filesList = filesList.filter(f => 
        f.file_name.toLowerCase().includes(q) || 
        f.file_type.toLowerCase().includes(q)
      );
    }

    // Sorting
    filesList.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'name') return a.file_name.localeCompare(b.file_name);
      if (sortBy === 'largest') return b.file_size - a.file_size;
      if (sortBy === 'smallest') return a.file_size - b.file_size;
      return 0;
    });

    return filesList;
  },

  // Toggle favorite
  async toggleFavorite(fileId) {
    const files = getLocalFiles();
    const target = files.find(f => f.id === fileId);
    if (target) {
      target.is_favorite = !target.is_favorite;
      saveLocalFiles(files);
      
      if (isSupabaseConfigured && supabase) {
        await supabase.from('files').update({ is_favorite: target.is_favorite }).eq('id', fileId);
      }
      return target.is_favorite;
    }
    return false;
  },

  // Move to trash
  async moveToTrash(fileId) {
    const files = getLocalFiles();
    const target = files.find(f => f.id === fileId);
    if (target) {
      target.is_deleted = true;
      saveLocalFiles(files);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('files').update({ is_deleted: true }).eq('id', fileId);
      }
    }
  },

  // Restore file from trash
  async restoreFile(fileId) {
    const files = getLocalFiles();
    const target = files.find(f => f.id === fileId);
    if (target) {
      target.is_deleted = false;
      saveLocalFiles(files);

      if (isSupabaseConfigured && supabase) {
        await supabase.from('files').update({ is_deleted: false }).eq('id', fileId);
      }
    }
  },

  // Delete permanently
  async deletePermanently(fileId) {
    let files = getLocalFiles();
    const target = files.find(f => f.id === fileId);
    files = files.filter(f => f.id !== fileId);
    saveLocalFiles(files);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('files').delete().eq('id', fileId);
    }
  },

  // Download actual file
  async downloadFile(file) {
    // 1. Increment download count
    file.download_count = (file.download_count || 0) + 1;
    const files = getLocalFiles();
    const idx = files.findIndex(f => f.id === file.id);
    if (idx !== -1) {
      files[idx].download_count = file.download_count;
      saveLocalFiles(files);
    }

    if (isSupabaseConfigured && supabase) {
      supabase.from('files').update({ download_count: file.download_count }).eq('id', file.id);
    }

    // 2. Fetch actual file binary stream from backend server
    const downloadUrl = `/api/files/download/${file.storage_path}?name=${encodeURIComponent(file.file_name)}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Share file with email
  async shareFile(fileId, recipientEmail) {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const shareRecord = {
      id: 'share_' + Date.now(),
      file_id: fileId,
      owner_id: user.id,
      owner_email: user.email,
      shared_with_email: recipientEmail,
      created_at: new Date().toISOString(),
    };

    const shares = getLocalShares();
    shares.push(shareRecord);
    saveLocalShares(shares);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('file_shares').insert([{
        file_id: fileId,
        owner_id: user.id,
        shared_with_email: recipientEmail
      }]);
    }

    return shareRecord;
  },

  // Get files shared with current user
  async getSharedFiles() {
    const user = authService.getCurrentUser();
    if (!user) return [];

    const shares = getLocalShares().filter(s => s.shared_with_email.toLowerCase() === user.email.toLowerCase());
    const allFiles = getLocalFiles();
    
    const sharedFileIds = shares.map(s => s.file_id);
    return allFiles.filter(f => sharedFileIds.includes(f.id));
  },

  // Generate expiring share link
  async generateShareLink(file, durationHours) {
    const response = await fetch('/api/files/share-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.file_name,
        filename: file.storage_path,
        durationHours: Number(durationHours) || 24,
      }),
    });

    if (!response.ok) throw new Error('Failed to generate share link');
    return await response.json();
  },
};
