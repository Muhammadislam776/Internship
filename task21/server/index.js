import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Storage directory for uploaded files
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve production static assets from dist
const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// Multer storage engine configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File validation filter
const fileFilter = (req, file, cb) => {
  const forbiddenExtensions = ['.exe', '.bat', '.cmd', '.sh', '.msi', '.com', '.scr', '.vbs', '.js', '.jar'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (forbiddenExtensions.includes(ext)) {
    return cb(new Error('Executable and script files are not allowed for security reasons.'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter,
});

// In-memory signed share links store for security & expiration
const shareLinksStore = new Map();

// Helper to determine file category
function getFileCategory(mimeType, fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.rtf'].includes(ext)) return 'document';
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return 'archive';
  if (['.js', '.html', '.css', '.json', '.py', '.cpp', '.java', '.ts'].includes(ext)) return 'code';
  return 'other';
}

// Health check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ShareVault Server Operating Normally', timestamp: new Date() });
});

// File Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or file validation failed.' });
    }

    const { originalname, filename, size, mimetype } = req.file;
    const category = getFileCategory(mimetype, originalname);
    
    const fileMetadata = {
      id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      file_name: originalname,
      original_name: originalname,
      storage_path: filename,
      file_size: size,
      mime_type: mimetype,
      file_type: category,
      download_count: 0,
      is_favorite: false,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      preview_url: mimetype.startsWith('image/') ? `/api/files/preview/${filename}` : null,
    };

    res.status(201).json({
      message: 'File uploaded successfully',
      file: fileMetadata,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message || 'File upload failed' });
  }
});

// File Preview / Serve Image Endpoint
app.get('/api/files/preview/:filename', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }
  res.sendFile(filePath);
});

// Download File Endpoint (Streams REAL binary payload)
app.get('/api/files/download/:filename', (req, res) => {
  const { filename } = req.params;
  const originalName = req.query.name || filename;
  const filePath = path.join(UPLOADS_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found on server storage.' });
  }

  // Set real attachment download headers
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(originalName)}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Generate Temporary Share Link Endpoint
app.post('/api/files/share-link', (req, res) => {
  const { fileName, filename, durationHours = 24 } = req.body;
  const token = 'sv_share_' + Math.random().toString(36).substr(2, 16);
  const expiresAt = new Date(Date.now() + durationHours * 3600 * 1000).toISOString();

  shareLinksStore.set(token, {
    fileName,
    filename,
    expiresAt,
  });

  res.json({
    token,
    shareUrl: `${req.protocol}://${req.get('host')}/api/share/${token}`,
    expiresAt,
  });
});

// Access Shared Link Endpoint
app.get('/api/share/:token', (req, res) => {
  const { token } = req.params;
  const shareData = shareLinksStore.get(token);

  if (!shareData) {
    return res.status(404).json({ error: 'Invalid or expired share link.' });
  }

  if (new Date() > new Date(shareData.expiresAt)) {
    shareLinksStore.delete(token);
    return res.status(410).json({ error: 'This share link has expired.' });
  }

  const filePath = path.join(UPLOADS_DIR, shareData.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File missing from storage.' });
  }

  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(shareData.fileName)}"`);
  res.setHeader('Content-Type', 'application/octet-stream');

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Catch-all route for Single Page Application (SPA) frontend navigation
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  } else {
    res.status(404).send('ShareVault Application Building...');
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds the 50MB limit.' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`ShareVault Unified Full-Stack Application running on http://localhost:${PORT}`);
});
