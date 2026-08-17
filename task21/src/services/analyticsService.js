import { fileService } from './fileService';

const STORAGE_LIMIT_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB

export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const analyticsService = {
  async getDashboardStats() {
    const allFiles = await fileService.getFiles({ isTrash: false });
    const sharedFiles = await fileService.getSharedFiles();

    const totalFiles = allFiles.length;
    const totalStorageBytes = allFiles.reduce((acc, f) => acc + (f.file_size || 0), 0);
    const totalDownloads = allFiles.reduce((acc, f) => acc + (f.download_count || 0), 0);
    const totalShared = sharedFiles.length;

    const usedPercentage = Math.min(100, (totalStorageBytes / STORAGE_LIMIT_BYTES) * 100);

    // Breakdown counts
    const counts = {
      documents: 0,
      images: 0,
      videos: 0,
      archives: 0,
      other: 0,
    };

    allFiles.forEach(file => {
      const type = file.file_type || 'other';
      if (counts[type] !== undefined) {
        counts[type]++;
      } else {
        counts.other++;
      }
    });

    return {
      totalFiles,
      totalStorageBytes,
      formattedStorageUsed: formatBytes(totalStorageBytes),
      formattedStorageLimit: '10 GB',
      storageLimitBytes: STORAGE_LIMIT_BYTES,
      usedPercentage: Number(usedPercentage.toFixed(1)),
      totalDownloads,
      totalShared,
      counts,
    };
  },
};
