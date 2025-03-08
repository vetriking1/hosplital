const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const MedicalRecord = require("../models/MedicalRecords");
const Bill = require("../models/Bill");

// Get user's medical records with test reports
router.get("/medical-records/:patientId", async (req, res) => {
  try {
    const records = await MedicalRecord.find({ Patient_ID: req.params.patientId })
      .populate({
        path: "Test_Reports",
        select: "Test_Name Test_Result Test_Date PDF_File"
      });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user's billing details
router.get("/bills/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findOne({ Patient_ID: req.params.patientId })
      .populate({
        path: "Bills",
        select: "Bill_ID Amount Payment_Status Payment_Date Description"
      });
    
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(patient.Bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get test report PDF
router.get("/report-pdf/:reportId", async (req, res) => {
  try {
    const report = await TestReport.findById(req.params.reportId);
    if (!report || !report.PDF_File) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.set({
      'Content-Type': report.PDF_File.contentType,
      'Content-Disposition': `inline; filename="${report.PDF_File.filename}"`
    });
    res.send(report.PDF_File.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve PDF" });
  }
});

module.exports = router;
