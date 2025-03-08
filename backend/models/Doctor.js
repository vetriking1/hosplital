const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    Doctor_ID: { type: String, required: true, unique: true },
    Name: { type: String, required: true },
    Specialization: { type: String, required: true },
    Contact_Number: { type: String, required: true },
    Department: { type: String, required: true },
    Availability_Status: { type: String, required: true },
    Patient_List: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
  },
  { collection: "doctors" }
);

const Doctor = mongoose.model("Doctor", DoctorSchema);

module.exports = Doctor;
