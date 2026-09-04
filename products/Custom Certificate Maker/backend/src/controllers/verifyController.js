const Certificate = require('../models/Certificate');
const VerificationLog = require('../models/VerificationLog');

// @desc    Verify certificate publicly by Certificate ID
// @route   GET /api/verify/:certificateId
// @access  Public
const verifyCertificate = async (req, res) => {
  try {
    const certId = req.params.certificateId.trim().toUpperCase();
    const cert = await Certificate.findOne({ certificateId: certId })
      .populate('organization', 'name logo website address contactEmail signature issuerName issuerDesignation');

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Browser';

    if (!cert) {
      // Log failed verification attempt
      await VerificationLog.create({
        certificateId: certId,
        ipAddress,
        userAgent,
        result: 'NOT_FOUND'
      });

      return res.status(404).json({
        success: false,
        verified: false,
        status: 'NOT_FOUND',
        message: 'Certificate not found. Please check the Certificate ID and try again.'
      });
    }

    const isValid = cert.status === 'Issued' || cert.status === 'Valid';
    const logResult = cert.status === 'Revoked' ? 'REVOKED' : 'VALID';

    // Log verification attempt
    await VerificationLog.create({
      certificateId: cert.certificateId,
      ipAddress,
      userAgent,
      result: logResult
    });

    res.json({
      success: true,
      verified: isValid,
      status: cert.status.toUpperCase(),
      revocationReason: cert.revocationReason || '',
      certificate: {
        certificateId: cert.certificateId,
        recipientName: cert.recipientName,
        courseName: cert.courseName,
        title: cert.title,
        description: cert.description,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        status: cert.status,
        designData: cert.designData,
        qrCodeUrl: cert.qrCodeUrl,
        organization: cert.organization ? {
          name: cert.organization.name,
          logo: cert.organization.logo,
          website: cert.organization.website,
          address: cert.organization.address,
          issuerName: cert.organization.issuerName,
          issuerDesignation: cert.organization.issuerDesignation
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { verifyCertificate };
