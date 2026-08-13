const multer = require('multer');
const { validateFileType } = require('../utils/fileUtils');

// Configure multer memory storage
const storage = multer.memoryStorage();

// File filter check
const fileFilter = (req, file, cb) => {
  const validation = validateFileType(file);
  if (!validation.isValid) {
    const error = new Error(validation.message);
    error.code = 'INVALID_FILE_TYPE';
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

// Middleware wrapper to handle Multer errors cleanly
const uploadProfileSingle = (req, res, next) => {
  const uploadHandler = upload.single('profile');

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'LIMIT_FILE_SIZE',
          message: 'Image size must be less than 5MB.'
        });
      }
      return res.status(400).json({
        success: false,
        error: err.code,
        message: err.message
      });
    } else if (err) {
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          success: false,
          error: 'INVALID_FILE_TYPE',
          message: err.message || 'Only JPG, PNG and WEBP images are allowed.'
        });
      }
      return res.status(400).json({
        success: false,
        error: 'UPLOAD_ERROR',
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'NO_FILE',
        message: 'Please select an image file to upload.'
      });
    }

    next();
  });
};

module.exports = {
  uploadProfileSingle
};
