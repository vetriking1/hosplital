const express = require("express");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  try {
    const { loginId, password } = req.body;

    // Find user
    const user = await User.findOne({ loginId });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        loginId: user.loginId,
        role: user.role,
        userId: user.userId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// test route

router.get("/test", async (req, res) => {
  res.send("Hello World!");
});

// Verify token
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
