import express from "express";
import Collection from "../models/Collection.js"

const SearchRoute = express.Router();


// GET /api/search - Return all users
SearchRoute.get("/search", async (req, res) => {
  try {
    const users = await Collection.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(users);
  } catch (error) {
    console.error("Search fetch error:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
});

// DELETE /api/users/:id - Delete a user permanently
SearchRoute.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await Collection.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error while deleting user" });
  }
});

// PUT /api/users/:id - Update amount or paidAmount based on userType
SearchRoute.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await Collection.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSpecial = user.userType === "special";
    const fieldToUpdate = isSpecial ? "paidAmount" : "amount";

    if (typeof updates[fieldToUpdate] !== "number") {
      return res.status(400).json({
        message: `Invalid update value for ${fieldToUpdate}`,
      });
    }

    user[fieldToUpdate] = updates[fieldToUpdate];
    await user.save();

    console.log(`User ${id} updated: ${fieldToUpdate} = ${updates[fieldToUpdate]}`);

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error while updating user" });
  }
});



export default SearchRoute;