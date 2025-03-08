const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");


const router = express.Router();

// Add a new patient user
router.post("/addPatient", async (req, res) => {
  try {
    const {
      loginId,
      password,
      name,
      age,
      gender,
      contact_number,
      address,
      blood_group,
      admission_status,
    } = req.body;

    // Create a new Patient document with proper field names
    const newPatient = new Patient({
      Name: name,
      Age: age,
      Gender: gender,
      Contact_Number: contact_number,
      Address: address,
      Blood_Group: blood_group,
      Admission_Status: admission_status,
      // Add Patient_ID if needed
    });

    const savedPatient = await newPatient.save();

    // Create a User linked to this Patient, let middleware hash the password
    const newUser = new User({
      loginId,
      password, // Original password, will be hashed by middleware
      role: "Patient",
      userId: savedPatient._id,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "Patient user created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Add a new doctor user
router.post("/addDoctor", async (req, res) => {
  try {
    const {
      loginId,
      password,
      name,
      Doctor_ID,
      Specialization,
      Contact_Number,
      Department,
      Availability_Status,
    } = req.body;

    // Create a new Doctor document
    const newDoctor = new Doctor({
      Doctor_ID,
      Name: name,
      Specialization,
      Contact_Number,
      Department,
      Availability_Status,
    });

    const savedDoctor = await newDoctor.save();

    // Create a User linked to this Doctor
    const newUser = new User({
      loginId,
      password, // Will be hashed by middleware
      role: "Doctor",
      userId: savedDoctor._id,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "Doctor user created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
