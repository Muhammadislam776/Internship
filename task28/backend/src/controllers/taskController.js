const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all tasks (with filters & search)
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { project_id, status, priority, search, assignee_id } = req.query;
    let query = {};

    if (project_id) query.project_id = project_id;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee_id) query.assignee_id = assignee_id;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const tasks = await Task.find(query)
      .populate('assignee_id', 'name email avatar role')
      .populate('comments.user_id', 'name email avatar role')
      .sort({ position: 1, createdAt: -1 });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee_id', 'name email avatar role')
      .populate('comments.user_id', 'name email avatar role');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { project_id, title, description, status, priority, assignee_id, due_date, cover_image, tags, subtasks } = req.body;

    if (!project_id || !title) {
      return res.status(400).json({ success: false, message: 'project_id and title are required' });
    }

    const taskStatus = status || 'TODO';

    // Find highest position in current column for this project
    const lastTaskInCol = await Task.findOne({ project_id, status: taskStatus }).sort({ position: -1 });
    const nextPosition = lastTaskInCol ? lastTaskInCol.position + 1 : 0;

    const task = await Task.create({
      project_id,
      title,
      description: description || '',
      status: taskStatus,
      priority: priority || 'MEDIUM',
      position: nextPosition,
      assignee_id: assignee_id || null,
      due_date: due_date || null,
      cover_image: cover_image || '',
      tags: tags || [],
      subtasks: subtasks || []
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignee_id', 'name email avatar role')
      .populate('comments.user_id', 'name email avatar role');

    res.status(201).json({ success: true, task: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task details (full update)
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignee_id', 'name email avatar role')
      .populate('comments.user_id', 'name email avatar role');

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task status and/or position (PATCH drag & drop update)
// @route   PATCH /api/tasks/:id
const patchTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus, position: newPosition, ...otherFields } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const oldStatus = task.status;
    const oldPosition = task.position;
    const projectId = task.project_id;

    let targetStatus = newStatus !== undefined ? newStatus : oldStatus;
    let targetPosition = newPosition !== undefined ? parseInt(newPosition, 10) : oldPosition;

    // Check if status or position changed
    const statusChanged = oldStatus !== targetStatus;
    const positionChanged = oldPosition !== targetPosition;

    if (statusChanged || positionChanged) {
      if (statusChanged) {
        // Shift remaining tasks in old column down to fill gap
        await Task.updateMany(
          { project_id: projectId, status: oldStatus, position: { $gt: oldPosition } },
          { $inc: { position: -1 } }
        );

        // Shift tasks in new column up to make room at targetPosition
        await Task.updateMany(
          { project_id: projectId, status: targetStatus, position: { $gte: targetPosition } },
          { $inc: { position: 1 } }
        );
      } else {
        // Moving within same column
        if (targetPosition > oldPosition) {
          // Moved down
          await Task.updateMany(
            { project_id: projectId, status: oldStatus, position: { $gt: oldPosition, $lte: targetPosition } },
            { $inc: { position: -1 } }
          );
        } else if (targetPosition < oldPosition) {
          // Moved up
          await Task.updateMany(
            { project_id: projectId, status: oldStatus, position: { $gte: targetPosition, $lt: oldPosition } },
            { $inc: { position: 1 } }
          );
        }
      }

      task.status = targetStatus;
      task.position = targetPosition;
    }

    // Apply any additional field updates (e.g. priority, title)
    Object.assign(task, otherFields);

    await task.save();

    const updatedTask = await Task.findById(id)
      .populate('assignee_id', 'name email avatar role')
      .populate('comments.user_id', 'name email avatar role');

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Shift positions of remaining tasks in column
    await Task.updateMany(
      { project_id: task.project_id, status: task.status, position: { $gt: task.position } },
      { $inc: { position: -1 } }
    );

    await task.deleteOne();

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
const addComment = async (req, res) => {
  try {
    const { content, user_id } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const commentUserId = user_id || (req.user ? req.user._id : null);
    if (!commentUserId) {
      return res.status(400).json({ success: false, message: 'User ID is required for comment' });
    }

    task.comments.push({
      user_id: commentUserId,
      content
    });

    await task.save();

    const updatedTask = await Task.findById(req.params.id)
      .populate('assignee_id', 'name email avatar role')
      .populate('comments.user_id', 'name email avatar role');

    res.status(201).json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add subtask to task
// @route   POST /api/tasks/:id/subtasks
const addSubtask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Subtask title is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.subtasks.push({ title, completed: false });
    await task.save();

    const updatedTask = await Task.findById(req.params.id)
      .populate('assignee_id', 'name email avatar role')
      .populate('comments.user_id', 'name email avatar role');

    res.status(201).json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle subtask completed
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
const toggleSubtask = async (req, res) => {
  try {
    const { id, subtaskId } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({ success: false, message: 'Subtask not found' });
    }

    subtask.completed = !subtask.completed;
    await task.save();

    const updatedTask = await Task.findById(id)
      .populate('assignee_id', 'name email avatar role')
      .populate('comments.user_id', 'name email avatar role');

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete subtask
// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
const deleteSubtask = async (req, res) => {
  try {
    const { id, subtaskId } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.subtasks.pull({ _id: subtaskId });
    await task.save();

    const updatedTask = await Task.findById(id)
      .populate('assignee_id', 'name email avatar role')
      .populate('comments.user_id', 'name email avatar role');

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  addComment,
  addSubtask,
  toggleSubtask,
  deleteSubtask
};
