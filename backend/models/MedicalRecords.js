const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema(
  {
    Record_ID: { type: Number, required: true, unique: true },
    Patient_ID: { type: Number, required: true, ref: "Patient" }, // Foreign key reference
    Diagnosis: { type: String, required: true },
    Treatment: { type: String, required: true },
    Medications: { type: String, required: true },
    Follow_Up_Date: { type: Date, required: true },
    Notes: { type: String },
  },
  { collection: "medical_records" }
);

const MedicalRecord = mongoose.model("MedicalRecord", MedicalRecordSchema);

module.exports = MedicalRecord;
