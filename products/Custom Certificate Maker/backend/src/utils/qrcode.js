const QRCode = require('qrcode');

/**
 * Generates Data URL string for QR code pointing to certificate verification URL
 */
const generateQRCodeDataUrl = async (verificationUrl) => {
  try {
    const dataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    });
    return dataUrl;
  } catch (err) {
    console.error('[QR Code Gen Error]', err);
    return '';
  }
};

module.exports = { generateQRCodeDataUrl };
