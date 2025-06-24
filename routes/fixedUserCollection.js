import express from "express";
import fixedUserCollection from "../models/fixedUserCollection.js";


const fixeduserCollectionRoute = express.Router();

fixeduserCollectionRoute.post("/", async (req, res) => {
  try {
    const newCollection = new fixedUserCollection(req.body);
    await newCollection.save();
    res.status(201).json({ message: "Fixed user collection saved successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// GET all fixed user collections
fixeduserCollectionRoute.get("/", async (req, res) => {
  try {
    const collections = await fixedUserCollection.find().sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch collections" });
  }
});

fixeduserCollectionRoute.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await fixedUserCollection.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete record" });
  }
});

export default fixeduserCollectionRoute;