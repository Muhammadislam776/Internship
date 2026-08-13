const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Allowed mime types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Validates if the file format is supported
 * @param {Object} file - Multer file object
 * @returns {Object} { isValid: boolean, message?: string }
 */
function validateFileType(file) {
  if (!file) {
    return { isValid: false, message: 'No file provided' };
  }

  const mimeType = file.mimetype ? file.mimetype.toLowerCase() : '';
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_MIME_TYPES.includes(mimeType) || !ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      message: 'Only JPG, PNG and WEBP images are allowed.'
    };
  }

  return { isValid: true };
}

/**
 * Generates a unique, safe filename for storage
 * @param {string} userId - User ID (default 'user-1')
 * @param {string} originalName - Original file name
 * @returns {string} Relative path in storage bucket e.g. "users/user-1/profile-17123456-uuid.webp"
 */
function generateUniqueFilename(userId = 'user-1', originalName) {
  const ext = path.extname(originalName).toLowerCase() || '.webp';
  const cleanExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : '.webp';
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  
  // Clean user ID to prevent path traversal
  const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');
  
  return `users/${safeUserId}/profile-${timestamp}-${uniqueId}${cleanExt}`;
}

module.exports = {
  validateFileType,
  generateUniqueFilename,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS
};
