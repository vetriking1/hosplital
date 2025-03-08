const express = require("express");
const router = express.Router();
const Bill = require("../models/Bills");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// Get all bills
router.get("/", async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("Patient_ID", "name")
      .populate("Doctor_ID", "name");
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new bill
router.post("/create", async (req, res) => {
  try {
    const { Patient_ID, Doctor_ID, Total_Amount, Payment_Status, Payment_Method } = req.body;

    // Generate a unique Bill_ID (you might want to implement a better system)
    const lastBill = await Bill.findOne().sort({ Bill_ID: -1 });
    const Bill_ID = lastBill ? lastBill.Bill_ID + 1 : 1;

    const newBill = new Bill({
      Bill_ID,
      Patient_ID,
      Doctor_ID,
      Total_Amount,
      Payment_Status,
      Payment_Method,
      Billing_Date: new Date(),
    });

    const savedBill = await newBill.save();
    
    // Update the patient's bills array
    await Patient.findOneAndUpdate(
      { Patient_ID: Patient_ID },
      { $push: { Bills: savedBill._id } }
    );

    res.status(201).json(savedBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get bill by ID
router.get("/:id", async (req, res) => {
  try {
    const bill = await Bill.findOne({ Bill_ID: req.params.id })
      .populate("Patient_ID", "name")
      .populate("Doctor_ID", "name");
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
