import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLogsFromFile } from '../utils/logReader.js';
import logger from '../config/logger.js';
import AppError from '../utils/AppError.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOGS_DIR = path.resolve(__dirname, '../../logs');

/**
 * @route   GET /api/logs
 * @desc    Get structured log entries from Winston combined.log with pagination and filtering
 */
router.get('/', (req, res) => {
  const result = getLogsFromFile('combined.log', req.query);
  res.status(200).json({
    success: true,
    data: result.logs,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

/**
 * @route   GET /api/logs/errors
 * @desc    Get error-level logs with stack traces from error.log
 */
router.get('/errors', (req, res) => {
  const result = getLogsFromFile('error.log', req.query);
  res.status(200).json({
    success: true,
    data: result.logs,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

/**
 * @route   GET /api/logs/raw
 * @desc    Get raw log file text content for physical files
 */
router.get('/raw', (req, res, next) => {
  const fileName = req.query.file || 'combined.log';
  const allowedFiles = ['combined.log', 'error.log', 'exceptions.log', 'rejections.log'];

  if (!allowedFiles.includes(fileName)) {
    return next(new AppError(`Invalid log file requested: ${fileName}`, 400));
  }

  const filePath = path.join(LOGS_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(200).json({
      success: true,
      filename: fileName,
      content: '',
      lines: 0,
      sizeBytes: 0
    });
  }

  try {
    const stats = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);

    res.status(200).json({
      success: true,
      filename: fileName,
      sizeBytes: stats.size,
      linesCount: lines.length,
      content: lines.slice(-200).reverse().join('\n') // Last 200 lines
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/logs/download/:file
 * @desc    Download physical Winston log file directly
 */
router.get('/download/:file', (req, res, next) => {
  const fileName = req.params.file;
  const allowedFiles = ['combined.log', 'error.log', 'exceptions.log', 'rejections.log'];

  if (!allowedFiles.includes(fileName)) {
    return next(new AppError(`Access denied to file: ${fileName}`, 403));
  }

  const filePath = path.join(LOGS_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    return next(new AppError(`Log file ${fileName} does not exist yet.`, 404));
  }

  res.download(filePath, fileName);
});

/**
 * @route   DELETE /api/logs
 * @desc    Clear log files for fresh simulation testing
 */
router.delete('/', (req, res) => {
  try {
    ['combined.log', 'error.log', 'exceptions.log', 'rejections.log'].forEach(file => {
      const p = path.join(LOGS_DIR, file);
      if (fs.existsSync(p)) {
        fs.writeFileSync(p, '');
      }
    });
    logger.info('Log files cleared by administrator');
    res.status(200).json({ success: true, message: 'Log files successfully truncated' });
  } catch (err) {
    logger.error('Failed to truncate log files', { error: err.message });
    res.status(500).json({ success: false, message: 'Failed to truncate log files' });
  }
});

export default router;
