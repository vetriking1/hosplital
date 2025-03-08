const express = require("express");
const staff = require("../models/Staff");
const router = express.Router();
const doctor = require("../models/Doctor");
const patient = require("../models/Patient");
const medicalRecords = require("../models/MedicalRecords");

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

// Create new medical record
router.post("/create-medical-record", async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    // Find doctor by _id to get Doctor_ID
    const doctorDoc = await doctor.findById(doctorId);
    if (!doctorDoc) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Find patient
    const patientDoc = await patient.findOne({ Patient_ID: patientId });
    if (!patientDoc) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Generate a unique Record_ID
    const lastRecord = await medicalRecords.findOne().sort({ Record_ID: -1 });
    const newRecordId = lastRecord ? lastRecord.Record_ID + 1 : 1;

    // Create new medical record using Doctor_ID from doctor document
    const newRecord = new medicalRecords({
      Record_ID: newRecordId,
      Patient_ID: patientId,
      Doctor_ID: doctorDoc.Doctor_ID, // Use the numeric Doctor_ID
      Test_Reports: []
    });

    // Save the record
    const savedRecord = await newRecord.save();

    // Update patient's medical history
    if (patientDoc.Medical_History) {
      patientDoc.Medical_History.push(savedRecord._id);
    } else {
      patientDoc.Medical_History = [savedRecord._id];
    }
    await patientDoc.save();

    res.json({ 
      message: "Medical record created successfully", 
      record: savedRecord 
    });
  } catch (error) {
    console.error("Error creating medical record:", error);
    res.status(500).json({ error: "Failed to create medical record: " + error.message });
  }
});

module.exports = router;
