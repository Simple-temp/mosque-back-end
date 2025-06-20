import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js"
import SearchRoute from "./routes/searchRoute.js";
import fixUserRoute from "./routes/fixUserRoute.js";
import adminRoute from  "./routes/adminRoute.js";
import dueRoute from "./routes/dueRoute.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000; // Fallback if PORT is not set

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DB_URL)
.then(() => console.log("Connected to MongoDB successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoute);
app.use("/api", SearchRoute);
app.use("/api/fixed-users", fixUserRoute);
app.use("/api/admin", adminRoute);
app.use("/api/due", dueRoute);

// Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
