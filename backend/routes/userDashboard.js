const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const MedicalRecord = require("../models/MedicalRecords");
const Bill = require("../models/Bills");

// Get user's medical records with test reports
router.get("/medical-records/:patientId", async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      Patient_ID: req.params.patientId,
    })
    .populate("Test_Reports")
    .populate("Doctor_ID", "name");

    if (!records) {
      return res.status(404).json({ message: "No medical records found" });
    }

    res.json(records);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's billing details
router.get("/bills/:patientId", async (req, res) => {
  try {
    const bills = await Bill.find({
      Patient_ID: req.params.patientId,
    })
    .populate("Doctor_ID", "name")
    .sort({ Billing_Date: -1 });

    if (!bills) {
      return res.status(404).json({ message: "No bills found" });
    }

    res.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get test report PDF
router.get("/report-pdf/:reportId", async (req, res) => {
  try {
    const report = await TestReport.findById(req.params.reportId);
    if (!report || !report.PDF_File) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.set({
      "Content-Type": report.PDF_File.contentType,
      "Content-Disposition": `inline; filename="${report.PDF_File.filename}"`,
    });
    res.send(report.PDF_File.data);
  } catch (error) {
    console.error("Error fetching PDF:", error);
    res.status(500).json({ message: "Failed to retrieve PDF" });
  }
});

module.exports = router;
