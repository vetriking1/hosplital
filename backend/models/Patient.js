const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    Patient_ID: { type: Number, unique: true },
    Name: { type: String },
    Age: { type: Number },
    Gender: { type: String },
    Contact_Number: { type: String },
    Address: { type: String },
    Blood_Group: { type: String },
    Admission_Status: { type: String },
  },
  { collection: "patients" }
);

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
