const express = require("express");

const { getRevenue } = require("../controllers/revenueController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get revenue analytics - Admin only
router.get("/", protect, adminOnly, getRevenue);

module.exports = router;
