const mongoose = require("mongoose");

const TestReportSchema = new mongoose.Schema(
  {
    Report_ID: { type: Number, required: true, unique: true },
    Patient_ID: { type: Number, required: true, ref: "Patient" }, // Foreign key reference
    Doctor_ID: { type: Number, required: true, ref: "Doctor" }, // Foreign key reference
    Test_Name: { type: String, required: true },
    Test_Result: { type: String, required: true },
    Test_Date: { type: Date, required: true },
    PDF_File: {
      filename: { type: String, required: true },
      contentType: { type: String, required: true },
      data: { type: Buffer, required: true }
    }
  },
  { collection: "test_reports" }
);

const TestReport = mongoose.model("TestReport", TestReportSchema);

module.exports = TestReport;
