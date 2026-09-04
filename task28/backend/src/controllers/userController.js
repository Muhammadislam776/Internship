const User = require('../models/User');
const Task = require('../models/Task');

// @desc    Get all users with workload summary
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ name: 1 });

    const usersWithWorkload = await Promise.all(
      users.map(async (user) => {
        const assignedTasks = await Task.countDocuments({ assignee_id: user._id });
        const completedTasks = await Task.countDocuments({ assignee_id: user._id, status: 'DONE' });
        const pendingTasks = assignedTasks - completedTasks;

        return {
          ...user.toObject(),
          assignedTasks,
          completedTasks,
          pendingTasks
        };
      })
    );

    res.json({ success: true, users: usersWithWorkload });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const assignedTasks = await Task.countDocuments({ assignee_id: user._id });
    const completedTasks = await Task.countDocuments({ assignee_id: user._id, status: 'DONE' });

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        assignedTasks,
        completedTasks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById
};
