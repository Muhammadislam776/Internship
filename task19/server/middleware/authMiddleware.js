const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Express authMiddleware to verify JWT from Authorization header
 * Header expected format: "Authorization: Bearer <JWT>"
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required."
      });
    }

    // 2. Check Bearer scheme format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format."
      });
    }

    // 3. Extract Token
    const token = parts[1];
    if (!token || token.trim() === '') {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format."
      });
    }

    // 4. Verify JWT using process.env.JWT_SECRET
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is missing from environment variables!");
      return res.status(500).json({
        success: false,
        message: "Server configuration error."
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      // Handles JsonWebTokenError, TokenExpiredError, NotBeforeError, etc.
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token."
      });
    }

    // 5. Decode user & find user in DB
    const user = User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token."
      });
    }

    // 6. Attach authenticated safe user to req.user
    req.user = User.toSafeUser(user);

    // 7. Allow request to continue
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
};

module.exports = authMiddleware;
