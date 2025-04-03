const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const MedicalRecord = require("../models/MedicalRecords");
const Bill = require("../models/Bills");
const TestReport = require("../models/TestReport"); // Add this import

// Get user's medical records with test reports
router.get("/medical-records/:patientId", async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      Patient_ID: req.params.patientId,
    })
      .populate("TestReport")
      .populate("Doctor_ID", "name");

    if (!records || records.length === 0) {
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

    if (!bills || bills.length === 0) {
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
    if (!req.params.reportId) {
      return res.status(400).json({ message: "Report ID is required" });
    }

    console.log("Fetching PDF for report ID:", req.params.reportId);

    const report = await TestReport.findById(req.params.reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (!report.PDF_File || !report.PDF_File.data) {
      return res
        .status(404)
        .json({ message: "No PDF available for this report" });
    }

    console.log("PDF found, sending response");

    res.set({
      "Content-Type": report.PDF_File.contentType || "application/pdf",
      "Content-Disposition": `inline; filename="${
        report.PDF_File.filename || "report.pdf"
      }"`,
    });

    res.send(report.PDF_File.data);
  } catch (error) {
    console.error("Error fetching PDF:", error);
    res.status(500).json({
      message: "Failed to retrieve PDF",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

router.get("/data/:idData", async (req, res) => {
  try {
    const data = await TestReport.findById(req.params.idData);

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new endpoint to get a specific test report's details
router.get("/report/:reportId", async (req, res) => {
  try {
    if (!req.params.reportId) {
      return res.status(400).json({ message: "Report ID is required" });
    }

    const report = await TestReport.findById(req.params.reportId, {
      "PDF_File.data": 0, // Exclude the binary data to make response smaller
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    console.error("Error fetching report details:", error);
    res.status(500).json({ message: "Failed to retrieve report details" });
  }
});

module.exports = router;
