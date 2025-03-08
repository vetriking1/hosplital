const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    Doctor_ID: { type: Number, required: true, unique: true },
    Name: { type: String, required: true },
    Specialization: { type: String, required: true },
    Contact_Number: { type: String, required: true },
    Department: { type: String, required: true },
    Availability_Status: { type: String, required: true },
  },
  { collection: "doctors" }
);

const Doctor = mongoose.model("Doctor", DoctorSchema);

module.exports = Doctor;
