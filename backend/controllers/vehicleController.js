const Vehicle = require("../models/Vehicle");
const Activity = require("../models/Activity");

// Add a vehicle
const addVehicle = async (req, res) => {
  try {
    const { vehicleNumber, brand, model, vehicleType, year } = req.body;

    if (!vehicleNumber || !brand || !model || !vehicleType || !year) {
      return res.status(400).json({
        message: "Please provide all vehicle details",
      });
    }

    const vehicle = await Vehicle.create({
      user: req.user.id,
      vehicleNumber,
      brand,
      model,
      vehicleType,
      year,
    });

    // Create activity for vehicle addition
    await Activity.create({
      type: "Vehicle Added",
      message: `${vehicleNumber} vehicle was added`,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add vehicle",
      error: error.message,
    });
  }
};

// Get customer's vehicles
const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      user: req.user.id,
    });

    res.json({
      vehicles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vehicles",
      error: error.message,
    });
  }
};

module.exports = {
  addVehicle,
  getMyVehicles,
};
