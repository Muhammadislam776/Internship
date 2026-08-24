import express from 'express';
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';

const router = express.Router();

// Mock database of users
const mockUsers = [
  { id: 1, name: 'Sarah Connor', email: 'sarah@cyberdyne.io', role: 'DevOps Engineer', status: 'Active' },
  { id: 2, name: 'Alex Rivera', email: 'alex@devpulse.dev', role: 'Backend Lead', status: 'Active' },
  { id: 3, name: 'Elena Rostova', email: 'elena@techlabs.com', role: 'Full Stack Developer', status: 'Inactive' },
  { id: 4, name: 'Marcus Chen', email: 'marcus@cloudops.org', role: 'SRE Specialist', status: 'Active' },
  { id: 5, name: 'David Kim', email: 'david@security.net', role: 'Security Architect', status: 'Active' }
];

/**
 * @route   GET /api/users
 * @desc    Get list of users
 */
router.get('/', (req, res) => {
  logger.info('Retrieved user list', { count: mockUsers.length });
  res.status(200).json({
    success: true,
    count: mockUsers.length,
    data: mockUsers
  });
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 */
router.get('/:id', (req, res, next) => {
  const userId = parseInt(req.params.id, 10);
  
  if (isNaN(userId)) {
    return next(new AppError('Invalid User ID parameter. ID must be a number.', 400));
  }

  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    // Triggers 404 AppError to demonstrate global error middleware and error log saving
    return next(new AppError(`User with ID ${userId} was not found in the database.`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @route   POST /api/users
 * @desc    Create a new user
 */
router.post('/', (req, res, next) => {
  const { name, email, role } = req.body || {};

  // Validation
  const errors = {};
  if (!name || name.trim() === '') errors.name = 'Name field is required';
  if (!email || !email.includes('@')) errors.email = 'Valid email address is required';

  if (Object.keys(errors).length > 0) {
    // Triggers 422 Validation Error
    return next(new AppError('User validation failed', 422, errors));
  }

  const newUser = {
    id: mockUsers.length + 1,
    name: name.trim(),
    email: email.trim(),
    role: role || 'Developer',
    status: 'Active'
  };

  mockUsers.push(newUser);
  logger.info(`User created successfully: ${newUser.email}`, { userId: newUser.id });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

export default router;
