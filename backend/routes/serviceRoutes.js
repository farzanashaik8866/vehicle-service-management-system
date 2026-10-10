const express = require("express");

const {
  createService,
  getMyServices,
  getAllServices,
  updateServiceStatus,
} = require("../controllers/serviceController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Customer routes

// Create a service booking
router.post("/", protect, createService);

// Get logged-in customer's services
router.get("/", protect, getMyServices);

// Admin routes

// Get all service bookings
router.get("/admin/all", protect, adminOnly, getAllServices);

// Update service status
router.put("/:id/status", protect, adminOnly, updateServiceStatus);

module.exports = router;
