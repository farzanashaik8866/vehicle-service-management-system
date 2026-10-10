const Activity = require("../models/Activity");

// Get recent activities
const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("user", "name email")
      .populate("service")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      activities,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch activities",
      error: error.message,
    });
  }
};

module.exports = {
  getRecentActivities,
};
