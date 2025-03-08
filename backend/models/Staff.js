const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
  {
    Staff_ID: { type: Number, required: true, unique: true },
    Name: { type: String, required: true },
    Age: { type: Number, required: true },
    Gender: { type: String, required: true },
    Contact_Number: { type: String, required: true },
    Address: { type: String, required: true },
    Role: { type: String, required: true },
    Department: { type: String, required: true },
    Attendance_Status: { type: String, default: "Present" },
  },
  { collection: "staff" }
);

const Staff = mongoose.model("Staff", StaffSchema);

module.exports = Staff;
