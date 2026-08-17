const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide full name, email, and password."
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match."
      });
    }

    // 2. Check if user exists
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists."
      });
    }

    // 3. Create user
    const newUser = await User.create({ name, email, password });
    const safeUser = User.toSafeUser(newUser);

    // 4. Generate JWT
    const token = generateToken(safeUser.id, safeUser.email);

    // 5. Response (NEVER return password)
    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: safeUser
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration."
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password."
      });
    }

    // 2. Find user
    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // 3. Verify password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Update last login timestamp
    User.updateLastLogin(user.id);

    // 4. Generate JWT
    const token = generateToken(user.id, user.email);

    // 5. Safe user info (NEVER return password)
    const safeUser = User.toSafeUser(user);

    return res.status(200).json({
      success: true,
      message: "Authentication successful.",
      token,
      user: safeUser
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication."
    });
  }
};

const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error("getMe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching user."
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
