const Template = require('../models/Template');

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public / Private
const getTemplates = async (req, res) => {
  try {
    const { category, isFeatured } = req.query;
    let query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    const templates = await Template.find(query).sort({ createdAt: -1 });
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Public / Private
const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create template
// @route   POST /api/templates
// @access  Private (Admin / Organization)
const createTemplate = async (req, res) => {
  try {
    const { name, category, thumbnail, designData, stylePreset, orientation, isFeatured } = req.body;

    const template = await Template.create({
      name,
      category: category || 'Modern',
      thumbnail: thumbnail || '',
      designData,
      stylePreset: stylePreset || 'classic-gold',
      orientation: orientation || 'landscape',
      createdBy: req.user._id,
      isFeatured: isFeatured || false
    });

    res.status(201).json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private (Admin)
const updateTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    const { name, category, thumbnail, designData, stylePreset, orientation, isPublished, isFeatured } = req.body;

    if (name !== undefined) template.name = name;
    if (category !== undefined) template.category = category;
    if (thumbnail !== undefined) template.thumbnail = thumbnail;
    if (designData !== undefined) template.designData = designData;
    if (stylePreset !== undefined) template.stylePreset = stylePreset;
    if (orientation !== undefined) template.orientation = orientation;
    if (isPublished !== undefined) template.isPublished = isPublished;
    if (isFeatured !== undefined) template.isFeatured = isFeatured;

    const updated = await template.save();
    res.json({ success: true, template: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private (Admin)
const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    await template.deleteOne();
    res.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
};
