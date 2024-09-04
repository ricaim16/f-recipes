import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { UserModel } from "../models/Users.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const JWT_SECRET = "Aimee"; // Use environment variable in production

// Configure nodemailer
const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "emuats0@gmail.com", // Replace with your email
    pass: "ovbgycwhnzcqojgm", // Replace with your email password
  },
});

// Send mail function
function sendMail(email) {
  const mailDetails = {
    from: {
      name: "emu",
      address: "no-reply@emuats0.com",
    },
    to: email,
    subject: "Welcome to the food recipes application",
    text: "Thank you for registering with us!",
  };

  mailTransporter.sendMail(mailDetails, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Email sent successfully to", email);
    }
  });
}

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../profilePicture");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const userId = req.params.id;
    const ext = path.extname(file.originalname);
    cb(null, `${userId}${ext}`);
  },
});

// Set file filter for multer
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Set up multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Middleware to verify the token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }
      req.user = user;
      next();
    });
  } else {
    res
      .status(401)
      .json({ message: "No token provided or incorrect token format" });
  }
};

// Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });

    await newUser.save();
    sendMail(email);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users (for testing purposes, consider securing this endpoint)
router.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    console.error("Fetching users error:", err);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });
    res.json({
      token,
      userID: user._id,
      name: user.name,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user by ID
router.get("/getuser/:id", async (req, res) => {
  const userId = req.params.id.trim();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await UserModel.findById(userId);
    if (user) {
      res.status(200).json({
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update profile image
router.post("/upload/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `${file.filename}`;
    await UserModel.findByIdAndUpdate(id, { profileImage: filePath });

    res
      .status(200)
      .json({ message: "Profile image updated", profileImage: filePath });
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).json({ message: "Error updating profile image" });
  }
});

export { router as userRouter };
