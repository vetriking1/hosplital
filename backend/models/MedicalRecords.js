const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema(
  {
    Record_ID: { type: Number, unique: true },
    Patient_ID: { type: Number, ref: "Patient" },
    Doctor_ID: { type: Number, ref: "Doctor" }, // Foreign key reference
    Test_Reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "TestReport" }],
  },
  { collection: "medical_records" }
);

const MedicalRecord = mongoose.model("MedicalRecord", MedicalRecordSchema);

module.exports = MedicalRecord;
