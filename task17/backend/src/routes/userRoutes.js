import { Router } from 'express';
import { validateUser } from '../middleware/validateUser.js';
import { userSchema } from '../schemas/userSchema.js';
import { 
  createUser, 
  getUsers, 
  getStats, 
  getLogs, 
  clearLogs 
} from '../controllers/userController.js';

const router = Router();

/**
 * @route   POST /api/users
 * @desc    Validate incoming user data via validateUser middleware & create user
 * @access  Public
 */
router.post('/users', validateUser(userSchema), createUser);

/**
 * @route   GET /api/users
 * @desc    Get list of validated users
 */
router.get('/users', getUsers);

/**
 * @route   GET /api/stats
 * @desc    Get live validation analytics & metrics
 */
router.get('/stats', getStats);

/**
 * @route   GET /api/logs
 * @desc    Get real-time validation logs
 */
router.get('/logs', getLogs);

/**
 * @route   DELETE /api/logs
 * @desc    Clear activity logs
 */
router.delete('/logs', clearLogs);

export default router;
