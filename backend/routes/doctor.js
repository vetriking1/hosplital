const express = require("express");
const doctor = require("../models/Doctor");
const router = express.Router();
const mdeicalRecords = require("../models/MedicalRecords");
const patient = require("../models/Patient");

const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const doctors = await doctor.find();
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doctor = await doctor.findById(req.params.id);
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get patient details and medical records
router.get("/patient/:patientId", async (req, res) => {
  try {
    const patientData = await patient
      .findOne({ _id: req.params.patientId })
      .populate({
        path: "Medical_History",
        model: "MedicalRecord",
        populate: {
          path: "Test_Reports",
          model: "TestReport",
        },
      });

    if (!patientData) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(patientData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
