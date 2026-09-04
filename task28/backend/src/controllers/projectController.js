const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects
// @route   GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('members', 'name email avatar role').sort({ createdAt: -1 });

    // Calculate completion progress dynamically for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({ project_id: project._id });
        const completedTasks = await Task.countDocuments({ project_id: project._id, status: 'DONE' });
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        return {
          ...project.toObject(),
          totalTasks,
          completedTasks,
          progress
        };
      })
    );

    res.json({ success: true, projects: projectsWithProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email avatar role');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const totalTasks = await Task.countDocuments({ project_id: project._id });
    const completedTasks = await Task.countDocuments({ project_id: project._id, status: 'DONE' });
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      project: {
        ...project.toObject(),
        totalTasks,
        completedTasks,
        progress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, description, cover_image, status, dueDate, members } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    const project = await Project.create({
      name,
      description: description || '',
      cover_image: cover_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      status: status || 'ACTIVE',
      dueDate: dueDate || null,
      members: members || []
    });

    const populatedProject = await Project.findById(project._id).populate('members', 'name email avatar role');

    res.status(201).json({ success: true, project: populatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('members', 'name email avatar role');
    res.json({ success: true, project: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Delete associated tasks
    await Task.deleteMany({ project_id: req.params.id });
    await project.deleteOne();

    res.json({ success: true, message: 'Project and associated tasks removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
