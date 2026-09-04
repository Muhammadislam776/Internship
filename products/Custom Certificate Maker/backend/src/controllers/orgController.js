const Organization = require('../models/Organization');
const Certificate = require('../models/Certificate');
const User = require('../models/User');

// @desc    Get organization profile
// @route   GET /api/org/profile
// @access  Private (Organization/Admin)
const getOrgProfile = async (req, res) => {
  try {
    let org;
    if (req.user.role === 'admin' && req.query.orgId) {
      org = await Organization.findById(req.query.orgId).populate('owner', 'name email');
    } else {
      org = await Organization.findOne({ owner: req.user._id }).populate('owner', 'name email');
    }

    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    res.json({ success: true, organization: org });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update organization profile
// @route   PUT /api/org/profile
// @access  Private (Organization)
const updateOrgProfile = async (req, res) => {
  try {
    let org = await Organization.findOne({ owner: req.user._id });
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    const { name, website, address, contactEmail, contactPhone, issuerName, issuerDesignation, logo, signature } = req.body;

    if (name) org.name = name;
    if (website !== undefined) org.website = website;
    if (address !== undefined) org.address = address;
    if (contactEmail !== undefined) org.contactEmail = contactEmail;
    if (contactPhone !== undefined) org.contactPhone = contactPhone;
    if (issuerName !== undefined) org.issuerName = issuerName;
    if (issuerDesignation !== undefined) org.issuerDesignation = issuerDesignation;
    if (logo !== undefined) org.logo = logo;
    if (signature !== undefined) org.signature = signature;

    const updatedOrg = await org.save();
    res.json({ success: true, organization: updatedOrg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload logo or signature image file
// @route   POST /api/org/upload
// @access  Private (Organization/Admin)
const uploadOrgAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Organization Analytics & Stats
// @route   GET /api/org/stats
// @access  Private (Organization)
const getOrgStats = async (req, res) => {
  try {
    const org = await Organization.findOne({ owner: req.user._id });
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    const totalCertificates = await Certificate.countDocuments({ organization: org._id });
    const activeCertificates = await Certificate.countDocuments({ organization: org._id, status: { $in: ['Issued', 'Valid'] } });
    const draftCertificates = await Certificate.countDocuments({ organization: org._id, status: 'Draft' });
    const revokedCertificates = await Certificate.countDocuments({ organization: org._id, status: 'Revoked' });

    // Recent recipient list count
    const recipientsCount = await Certificate.distinct('recipientEmail', { organization: org._id });

    res.json({
      success: true,
      stats: {
        totalCertificates,
        activeCertificates,
        draftCertificates,
        revokedCertificates,
        totalRecipients: recipientsCount.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getOrgProfile, updateOrgProfile, uploadOrgAsset, getOrgStats };
