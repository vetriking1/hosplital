const express = require("express");
const Patient = require("../models/Patient"); // Ensure correct model import
const router = express.Router();

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
    } = req.body;

    const newPatient = await Patient.create({
      Patient_ID,
      Name,
      Age,
      Gender,
      Contact_Number,
      Address,
      Blood_Group,
      Admission_Status,
    });

    res.status(201).json(newPatient);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Route to get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get a patient by ID
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({ Patient_ID: req.params.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
