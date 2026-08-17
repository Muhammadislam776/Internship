const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found."
      });
    }

    const safeUser = User.toSafeUser(user);

    return res.status(200).json({
      success: true,
      profile: {
        ...safeUser,
        role: "Authenticated User",
        tokenScheme: "Bearer",
        securityVerifiedAt: new Date().toISOString(),
        jwtVerified: true
      }
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving profile."
    });
  }
};

const getActivity = async (req, res) => {
  try {
    const activityLogs = [
      {
        id: "act_1",
        type: "SUCCESS",
        event: "Successful Login & JWT Generation",
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        ip: "127.0.0.1",
        status: "200 OK"
      },
      {
        id: "act_2",
        type: "SUCCESS",
        event: "JWT Verified via authMiddleware",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        ip: "127.0.0.1",
        status: "200 OK"
      },
      {
        id: "act_3",
        type: "SUCCESS",
        event: "Protected API Access /api/auth/me",
        timestamp: new Date().toISOString(),
        ip: "127.0.0.1",
        status: "200 OK"
      }
    ];

    return res.status(200).json({
      success: true,
      activity: activityLogs
    });
  } catch (error) {
    console.error("Get Activity Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving activity."
    });
  }
};

module.exports = {
  getProfile,
  getActivity
};
