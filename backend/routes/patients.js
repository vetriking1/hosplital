const express = require("express");
const Patient = require("../models/Patient");
const User = require("../models/Users");
const router = express.Router();

// Get patient by user ID - Make sure this route is before /:id to avoid conflicts
router.get("/user/:userId", async (req, res) => {
  try {
    // First find the user
    const user = await User.findById(req.params.userId);
    console.log("Backend call");
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Then find the patient with this user reference
    const patient = await Patient.findOne({ _id: user.userId })
      .populate("Medical_History")
      .populate("Bills");

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Patient not found for this user" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("Error finding patient:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("Medical_History")
      .populate("Bills");
    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get a patient by ID
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({ Patient_ID: req.params.id })
      .populate("Medical_History")
      .populate("Bills");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to add a new patient
router.post("/", async (req, res) => {
  try {
    const {
      Patient_ID,
      Name,
      Age,
      Gender,
      Contact_Number,
      Address,
      Blood_Group,
      Admission_Status,
      userId, // User ID from the Users collection
    } = req.body;

    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPatient = await Patient.create({
      Patient_ID,
      Name,
      Age,
      Gender,
      Contact_Number,
      Address,
      Blood_Group,
      Admission_Status,
      user: userId, // Store the user reference
    });

    res.status(201).json(newPatient);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
