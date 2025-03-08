const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    Bill_ID: { type: Number, required: true, unique: true },
    Patient_ID: { type: Number, required: true, ref: "Patient" }, // Foreign key reference
    Doctor_ID: { type: Number, required: true, ref: "Doctor" }, // Foreign key reference
    Total_Amount: { type: Number, required: true },
    Payment_Status: { type: String, required: true },
    Payment_Method: { type: String, required: true },
    Billing_Date: { type: Date, required: true },
  },
  { collection: "bills" }
);

const Bill = mongoose.model("Bill", BillSchema);

module.exports = Bill;
