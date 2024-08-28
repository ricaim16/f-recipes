import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { UserModel } from "../models/Users.js";

const router = express.Router();
const JWT_SECRET = "Aimee"; // Hardcoded JWT secret

// Configure nodemailer
const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "emuats0@gmail.com",
    pass: "ovbgycwhnzcqojgm",
  },
});

// Send mail function
function sendMail(email) {
  const mailDetails = {
    from: {
      name: "emu",
      address: "no-reply@emuats0.com", // Fixed the email address format
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

// Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Validate password
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });

    // Save the new user
    await newUser.save();

    // Send welcome email
    sendMail(email);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users (for testing purposes, consider securing this endpoint)
router.get("/register", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    console.error("Fetching users error:", err);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
});

// Log in and generate a token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, userID: user._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export { router as userRouter };

// Middleware to verify the token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Get the token part from "Bearer <token>"

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }

      req.user = user; // Attach user info to request object
      next();
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};
