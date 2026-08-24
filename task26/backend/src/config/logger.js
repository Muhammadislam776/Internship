import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base logs directory: backend/logs/
const LOGS_DIR = path.resolve(__dirname, '../../logs');

// Define log levels and custom colors for console formatting
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
  }
};

winston.addColors(customLevels.colors);

// JSON log format for machine-readable file output
const fileJsonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Human-readable console log format
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level}: ${message} ${metaStr}`.trim();
  })
);

// Daily Rotate Transports for combined & error logs
const dailyCombinedRotate = new DailyRotateFile({
  filename: path.join(LOGS_DIR, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d',
  format: fileJsonFormat,
  level: 'info'
});

const dailyErrorRotate = new DailyRotateFile({
  filename: path.join(LOGS_DIR, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '30d',
  format: fileJsonFormat,
  level: 'error'
});

// Standard File Transports to guarantee physical files combined.log & error.log
const standardCombinedFile = new winston.transports.File({
  filename: path.join(LOGS_DIR, 'combined.log'),
  format: fileJsonFormat,
  level: 'info'
});

const standardErrorFile = new winston.transports.File({
  filename: path.join(LOGS_DIR, 'error.log'),
  format: fileJsonFormat,
  level: 'error'
});

export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.LOG_LEVEL || 'info',
  format: fileJsonFormat,
  defaultMeta: { service: 'devpulse-api' },
  transports: [
    new winston.transports.Console({
      format: consoleFormat
    }),
    standardCombinedFile,
    standardErrorFile,
    dailyCombinedRotate,
    dailyErrorRotate
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(LOGS_DIR, 'exceptions.log'),
      format: fileJsonFormat
    }),
    new winston.transports.Console({
      format: consoleFormat
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(LOGS_DIR, 'rejections.log'),
      format: fileJsonFormat
    }),
    new winston.transports.Console({
      format: consoleFormat
    })
  ],
  exitOnError: false
});

export default logger;
