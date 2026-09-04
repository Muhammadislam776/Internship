const Certificate = require('../models/Certificate');
const Organization = require('../models/Organization');
const User = require('../models/User');
const generateCertId = require('../utils/generateCertId');
const { generateQRCodeDataUrl } = require('../utils/qrcode');

// @desc    Issue or save draft certificate
// @route   POST /api/certificates
// @access  Private (Organization/Admin)
const createCertificate = async (req, res) => {
  try {
    const {
      recipientName,
      recipientEmail,
      title,
      courseName,
      description,
      issueDate,
      expiryDate,
      status,
      designData,
      templateId,
      customFields
    } = req.body;

    let org;
    if (req.user.role === 'organization') {
      org = await Organization.findOne({ owner: req.user._id });
    } else if (req.body.organizationId) {
      org = await Organization.findById(req.body.organizationId);
    }

    if (!org) {
      return res.status(400).json({ success: false, message: 'Valid organization profile is required to issue certificates' });
    }

    // Check if recipient is a registered user
    let recipientUser = null;
    if (recipientEmail) {
      recipientUser = await User.findOne({ email: recipientEmail.toLowerCase() });
    }

    // Auto-generate Unique Certificate ID
    let certId = generateCertId();
    let isUnique = false;
    while (!isUnique) {
      const existing = await Certificate.findOne({ certificateId: certId });
      if (!existing) {
        isUnique = true;
      } else {
        certId = generateCertId();
      }
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyUrl = `${clientUrl}/verify/${certId}`;
    const qrCodeUrl = await generateQRCodeDataUrl(verifyUrl);

    const certStatus = status || 'Issued';

    const certificate = await Certificate.create({
      certificateId: certId,
      organization: org._id,
      recipient: recipientUser ? recipientUser._id : null,
      recipientName,
      recipientEmail: recipientEmail ? recipientEmail.toLowerCase() : '',
      template: templateId || null,
      title: title || 'Certificate of Achievement',
      courseName,
      description: description || 'For successfully completing the program.',
      issueDate: issueDate || Date.now(),
      expiryDate: expiryDate || null,
      status: certStatus,
      designData,
      qrCodeUrl,
      customFields: customFields || {}
    });

    res.status(201).json({
      success: true,
      certificate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get certificates for organization or recipient
// @route   GET /api/certificates
// @access  Private
const getCertificates = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (req.user.role === 'organization') {
      const org = await Organization.findOne({ owner: req.user._id });
      if (!org) {
        return res.json({ success: true, certificates: [], total: 0 });
      }
      query.organization = org._id;
    } else if (req.user.role === 'recipient') {
      query.$or = [
        { recipient: req.user._id },
        { recipientEmail: req.user.email.toLowerCase() }
      ];
      // Recipients should only see Issued / Valid / Revoked (not drafts)
      query.status = { $ne: 'Draft' };
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { certificateId: { $regex: search, $options: 'i' } },
          { recipientName: { $regex: search, $options: 'i' } },
          { courseName: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Certificate.countDocuments(query);
    const certificates = await Certificate.find(query)
      .populate('organization', 'name logo website signature issuerName issuerDesignation')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      certificates,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single certificate by MongoDB ID or Certificate ID string
// @route   GET /api/certificates/:id
// @access  Private / Public
const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;
    let cert = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      cert = await Certificate.findById(id).populate('organization', 'name logo website signature issuerName issuerDesignation');
    }

    if (!cert) {
      cert = await Certificate.findOne({ certificateId: id.toUpperCase() }).populate('organization', 'name logo website signature issuerName issuerDesignation');
    }

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.json({ success: true, certificate: cert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update certificate (e.g. edit draft or details)
// @route   PUT /api/certificates/:id
// @access  Private (Organization/Admin)
const updateCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    const fieldsToUpdate = [
      'recipientName', 'recipientEmail', 'title', 'courseName',
      'description', 'issueDate', 'expiryDate', 'status', 'designData', 'customFields'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        cert[field] = req.body[field];
      }
    });

    const updatedCert = await cert.save();
    res.json({ success: true, certificate: updatedCert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Revoke a certificate
// @route   PUT /api/certificates/:id/revoke
// @access  Private (Organization/Admin)
const revokeCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    cert.status = 'Revoked';
    cert.revocationReason = req.body.reason || 'Revoked by authorized administrator/issuer.';
    await cert.save();

    res.json({ success: true, message: 'Certificate revoked successfully', certificate: cert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Restore a revoked certificate
// @route   PUT /api/certificates/:id/restore
// @access  Private (Admin/Organization)
const restoreCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    cert.status = 'Valid';
    cert.revocationReason = '';
    await cert.save();

    res.json({ success: true, message: 'Certificate restored to Valid status', certificate: cert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private (Organization/Admin)
const deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    await cert.deleteOne();
    res.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCertificate,
  getCertificates,
  getCertificateById,
  updateCertificate,
  revokeCertificate,
  restoreCertificate,
  deleteCertificate
};
