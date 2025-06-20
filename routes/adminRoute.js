import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AdminUser from "../models/AdminUser.js";
import { verifyToken } from "../utils/verifyToken.js";

const adminRoute = express.Router();

// Secret key for JWT
const JWT_SECRET = "your_secret_key"; // Use env var in production

// ✅ GET admin by ID
adminRoute.get("/:id", async (req, res) => {
  try {
    const admin = await AdminUser.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE admin by ID
adminRoute.put("/:id", async (req, res) => {
  try {
    const { name, number, address, email, password } = req.body;
    const updateFields = { name, number, address, email };
    if (password) updateFields.password = password;

    const updated = await AdminUser.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Create Admin
adminRoute.post("/create", async (req, res) => {
  try {
    const { name, number, address, role, email, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await AdminUser.findOne({ number });
    if (existingUser) {
      return res.status(409).json({ message: "Admin with this number already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate token
    const token = jwt.sign({ name, role, email }, JWT_SECRET, { expiresIn: "1d" });

    const newAdmin = new AdminUser({
      name,
      number,
      address,
      role,
      email,
      password: hashedPassword,
      token,
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: "Failed to create admin", error: error.message });
  }
});

// Login with number and password
adminRoute.post("/login", async (req, res) => {
  try {
    const { number, password } = req.body;

    if (!number || !password) {
      return res.status(400).json({ message: "Number and password are required" });
    }

    const user = await AdminUser.findOne({ number });

    if (!user) {
      return res.status(401).json({ message: "Invalid number or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid number or password" });
    }

    // Generate new token (optional, or use existing one)
    const token = jwt.sign({ name: user.name, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Optionally update token in DB
    user.token = token;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        number: user.number,
        role: user.role,
        email: user.email,
        address: user.address,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Get all admins
adminRoute.get("/", async (req, res) => {
  try {
    const admins = await AdminUser.find();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admins", err });
  }
});

// Update admin
adminRoute.put("/:id",verifyToken, async (req, res) => {
  try {
    const updated = await AdminUser.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", err });
  }
});

// Delete admin
adminRoute.delete("/:id", verifyToken, async (req, res) => {
  try {
    await AdminUser.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", err });
  }
});

export default adminRoute;
