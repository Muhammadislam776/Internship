const jwt = require('jsonwebtoken');

const generateToken = (userId, email) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }

  return jwt.sign(
    { id: userId, email },
    secret,
    { expiresIn: '24h' }
  );
};

module.exports = generateToken;
