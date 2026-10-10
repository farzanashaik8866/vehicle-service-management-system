const express = require("express");

const {
  addVehicle,
  getMyVehicles,
} = require("../controllers/vehicleController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Add a vehicle
router.post("/", protect, addVehicle);

// Get logged-in customer's vehicles
router.get("/", protect, getMyVehicles);

module.exports = router;
