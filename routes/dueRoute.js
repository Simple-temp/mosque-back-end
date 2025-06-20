import express from "express";
import Collection from "../models/Collection.js"

const dueRoute = express.Router();

dueRoute.get("/", async (req, res) => {
  try {
    const allUsers = await Collection.find({ isDeleted: false });
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// backend/routes/dueRoute.js
dueRoute.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await Collection.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error during delete" });
  }
});



export default dueRoute;