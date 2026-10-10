const express = require("express");

const { getRecentActivities } = require("../controllers/activityController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get recent activities - Admin only
router.get("/", protect, adminOnly, getRecentActivities);

module.exports = router;
