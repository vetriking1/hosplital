const express = require("express");
const staff = require("../models/Staff");
const router = express.Router();
const multer = require("multer");
const patient = require("../models/Patient");
const medicalRecords = require("../models/MedicalRecords");
const testReport = require("../models/TestReport");

// Configure multer for PDF file uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Get all lab assistants
router.get("/", async (req, res) => {
  try {
    const labAssistant = await staff.find();
    res.json(labAssistant.filter((staff) => staff.Role === "Lab Assistant"));
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

// Get patient's medical records
router.get("/medical-records/:patientId", async (req, res) => {
  try {
    const records = await medicalRecords
      .find({ Patient_ID: req.params.patientId })
      .populate('Test_Reports');
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Upload test report PDF
router.post("/upload-report", upload.single('pdfFile'), async (req, res) => {
  try {
    const { patientId, doctorId, medicalRecordId, testName, testResult } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    // Create new test report
    const newReport = new testReport({
      Report_ID: Date.now(), // Generate a unique ID
      Patient_ID: patientId,
      Doctor_ID: doctorId,
      Test_Name: testName,
      Test_Result: testResult,
      Test_Date: new Date(),
      PDF_File: {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer
      }
    });

    // Save the test report
    const savedReport = await newReport.save();

    // Add report to medical record
    await medicalRecords.findByIdAndUpdate(
      medicalRecordId,
      { $push: { Test_Reports: savedReport._id } }
    );

    res.json({ message: "Test report uploaded successfully", report: savedReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload test report" });
  }
});

// Get test report PDF
router.get("/report-pdf/:reportId", async (req, res) => {
  try {
    const report = await testReport.findById(req.params.reportId);
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
