const Service = require("../models/Service");
const Activity = require("../models/Activity");

/*
=========================================================
SERVICE PRICES
=========================================================
*/

const SERVICE_PRICES = {
  "Oil Change": 1500,
  "General Service": 2500,
  "Brake Service": 3000,
  "Engine Repair": 5000,
  "AC Service": 2500,
  "Battery Service": 3500,
  "Tyre Service": 2000,
  "Car Wash": 500,
  Other: 1500,
};

/*
=========================================================
CREATE SERVICE
=========================================================
*/

const createService = async (req, res) => {
  try {
    const { vehicle, serviceType, description, appointmentDate } = req.body;

    /*
        Validate required fields
        */

    if (!vehicle || !serviceType || !appointmentDate) {
      return res.status(400).json({
        message: "Please provide vehicle, service type and appointment date",
      });
    }

    /*
        Check whether the selected service
        has a configured price
        */

    const amount = SERVICE_PRICES[serviceType];

    if (amount === undefined) {
      return res.status(400).json({
        message: "Invalid service type",
      });
    }

    /*
        Create service

        IMPORTANT:
        The amount comes from the backend.
        The customer cannot choose the amount.
        */

    const service = await Service.create({
      customer: req.user.id,
      vehicle,
      serviceType,
      description,
      appointmentDate,
      amount,
    });

    /*
        Create activity
        */

    await Activity.create({
      type: "Service Booked",

      message: `${serviceType} service was booked for ₹${amount}`,

      user: req.user.id,

      service: service._id,
    });

    /*
        Send response
        */

    res.status(201).json({
      message: "Service booked successfully",

      service,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to book service",

      error: error.message,
    });
  }
};

/*
=========================================================
GET CUSTOMER SERVICES
=========================================================
*/

const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({
      customer: req.user.id,
    })
      .populate("vehicle")
      .sort({
        createdAt: -1,
      });

    res.json({
      services,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch services",

      error: error.message,
    });
  }
};

/*
=========================================================
GET ALL SERVICES - ADMIN
=========================================================
*/

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("customer", "name email")
      .populate("vehicle")
      .sort({
        createdAt: -1,
      });

    res.json({
      services,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all services",

      error: error.message,
    });
  }
};

/*
=========================================================
UPDATE SERVICE STATUS - ADMIN
=========================================================
*/

const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "In Progress",
      "Completed",
      "Cancelled",
    ];

    if (!status) {
      return res.status(400).json({
        message: "Please provide service status",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid service status",
      });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    service.status = status;

    await service.save();

    await Activity.create({
      type: "Service Status Updated",

      message: `${service.serviceType} service status changed to ${status}`,

      user: req.user.id,

      service: service._id,
    });

    res.json({
      message: "Service status updated successfully",

      service,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update service status",

      error: error.message,
    });
  }
};

/*
=========================================================
EXPORT
=========================================================
*/

module.exports = {
  createService,

  getMyServices,

  getAllServices,

  updateServiceStatus,
};
