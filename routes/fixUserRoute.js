import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import twilio from "twilio";
import FixedUser from "../models/FixedUser.js"
import { verifyToken } from "../utils/verifyToken.js";

const fixUserRoute = express.Router();

const JWT_SECRET = "your_jwt_secret"; 

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// ✅ GET fixed user by ID
fixUserRoute.get("/:id", async (req, res) => {
  try {
    const user = await FixedUser.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Fixed user not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE fixed user by ID
fixUserRoute.put("/:id", async (req, res) => {
  try {
    const { name, number, address, email, password } = req.body;
    const updateFields = { name, number, address, email };
    if (password) updateFields.password = password;

    const updated = await FixedUser.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// logged in user
fixUserRoute.post("/login", async (req, res) => {
  try {
    const { number, password } = req.body;

    const user = await FixedUser.findOne({ number });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compareSync(password, user.password);
    console.log(isMatch)

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { name: user.name, email: user.email, number: user.number },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

//Create user
fixUserRoute.post("/", async (req, res) => {
  try {
    const { name, email, number, address, password, role } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ name, email, number, role }, JWT_SECRET, { expiresIn: "7d" });

    const newUser = new FixedUser({
      name,
      email,
      number,
      role,
      address,
      password: hashedPassword,
      token,
    });

    const savedUser = await newUser.save();

    // Send SMS
    // await client.messages.create({
    //   body: `Hi ${name}, your account has been successfully created.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: `+88${number}`
    // });

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get user
fixUserRoute.get("/", async (req, res) => {
  try {
    const users = await FixedUser.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
fixUserRoute.delete("/:id", async (req, res) => {
  try {
    await FixedUser.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


export default fixUserRoute;