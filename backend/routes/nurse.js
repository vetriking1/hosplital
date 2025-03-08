const express = require("express");
const staff = require("../models/Staff");
const router = express.Router();
const doctor = require("../models/Doctor");
const patient = require("../models/Patient");

const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const nurses = await staff.find();
    res.json(nurses.filter((nurse) => nurse.Role === "Nurse"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await doctor.find().select('Doctor_ID Name Specialization');
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all patients
router.get("/patients", async (req, res) => {
  try {
    const patients = await patient.find().select('Patient_ID Name');
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Assign patient to doctor
router.post("/assign-patient", async (req, res) => {
  try {
    const { doctorId, patientId } = req.body;

    // Find doctor and patient
    const doctorDoc = await doctor.findById(doctorId);
    const patientDoc = await patient.findById(patientId);

    if (!doctorDoc || !patientDoc) {
      return res.status(404).json({ error: "Doctor or patient not found" });
    }

    // Check if patient is already assigned to this doctor
    if (doctorDoc.Patient_List.includes(patientId)) {
      return res.status(400).json({ error: "Patient already assigned to this doctor" });
    }

    // Add patient to doctor's list
    doctorDoc.Patient_List.push(patientId);
    await doctorDoc.save();

    res.json({ message: "Patient successfully assigned to doctor" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
