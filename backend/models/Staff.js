const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
  {
    Staff_ID: { type: Number, required: true, unique: true },
    Name: { type: String, required: true },
    Role: { type: String, required: true },
    Contact_Number: { type: String, required: true },
    Shift_Timing: { type: String, required: true },
    Assigned_Department: { type: String, required: true },
    Attendance_Status: { type: String, required: true },
  },
  { collection: "staff" }
);

const Staff = mongoose.model("Staff", StaffSchema);

module.exports = Staff;
