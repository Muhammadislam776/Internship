const crypto = require('crypto');

/**
 * Generates a non-duplicating Unique Certificate ID formatted as CERT-YYYY-XXXXX
 * Example: CERT-2026-8F92K7
 */
const generateCertId = () => {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CERT-${year}-${randomHex}`;
};

module.exports = generateCertId;
