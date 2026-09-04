const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  platformName: {
    type: String,
    default: 'CertifyCraft SaaS'
  },
  allowRegistration: {
    type: Boolean,
    default: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  supportEmail: {
    type: String,
    default: 'support@certifycraft.com'
  },
  maxCertificatesPerOrg: {
    type: Number,
    default: 1000
  }
}, { timestamps: true });

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
