import express from "express";
import Collection from "../models/Collection.js"

const router = express.Router();

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await Collection.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// DELETE user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});


router.post("/add-user", async (req, res) => {
  try {
    const {
      name,
      address,
      number,
      amount,
      paidAmount,
      email,
      fixedAmount,
      role,
      userType,
      submittedByAdmin,
      submittedByFixedUser,
    } = req.body;

    if (!name || !number || !email || !userType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for duplicate number/email
    const existing = await Collection.findOne({
      $or: [{ number }, { email }],
    });
    if (existing) {
      return res.status(409).json({ message: "Number or email already exists" });
    }

    // Build user payload
    const userPayload = {
      name,
      address,
      number,
      email,
      userType,
      timestamp: new Date(),
    };

    if (userType === "normal") {
      userPayload.amount = amount;
    } else if (userType === "special") {
      userPayload.paidAmount = paidAmount;
      userPayload.fixedAmount = fixedAmount;
      userPayload.role = role;
    }

    // Set submittedBy references if provided
    if (submittedByAdmin) userPayload.submittedByAdmin = submittedByAdmin;
    if (submittedByFixedUser) userPayload.submittedByFixedUser = submittedByFixedUser;

    const newUser = new Collection(userPayload);

    await newUser.save();
    console.log(newUser)

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// PUT - Update user by ID
router.put("/users/:id", async (req, res) => {
  try {
    const updated = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});



export default router;
