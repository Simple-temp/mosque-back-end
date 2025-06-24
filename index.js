import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js"
import SearchRoute from "./routes/searchRoute.js";
import fixUserRoute from "./routes/fixUserRoute.js";
import adminRoute from  "./routes/adminRoute.js";
import dueRoute from "./routes/dueRoute.js";
import cors from "cors";
import fixeduserCollectionRoute from "./routes/fixedUserCollection.js";

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
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api", userRoute);
app.use("/api", SearchRoute);
app.use("/api/fixed-users", fixUserRoute);
app.use("/api/admin", adminRoute);
app.use("/api/due", dueRoute);
app.use("/api/fixed-user-collections", fixeduserCollectionRoute);

// Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
