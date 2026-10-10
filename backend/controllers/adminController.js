const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    if (!name || !email || !password || !adminSecret) {
      return res.status(400).json({
        message: "Please provide name, email, password and admin secret",
      });
    }

    // Check admin registration secret
    if (adminSecret !== process.env.ADMIN_REGISTER_SECRET) {
      return res.status(403).json({
        message: "Invalid admin registration secret",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create admin",
      error: error.message,
    });
  }
};

module.exports = {
  createAdmin,
};
