const Service = require("../models/Service");

// Get revenue analytics
const getRevenue = async (req, res) => {
  try {
    const completedServices = await Service.find({
      status: "Completed",
    });

    const totalRevenue = completedServices.reduce(
      (total, service) => total + service.amount,
      0,
    );

    const totalCompletedServices = completedServices.length;

    res.json({
      totalRevenue,
      totalCompletedServices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch revenue",
      error: error.message,
    });
  }
};

module.exports = {
  getRevenue,
};
