const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    Patient_ID: { type: String },
    Name: { type: String },
    Age: { type: Number },
    Gender: { type: String },
    Contact_Number: { type: String },
    Address: { type: String },
    Blood_Group: { type: String },
    Admission_Status: { type: String },
    Medical_History: [
      { type: mongoose.Schema.Types.ObjectId, ref: "MedicalRecord" },
    ],
    Bills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bill" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { collection: "patients" }
);

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
