const express = require("express");
const staff = require("../models/Staff");
const router = express.Router();

const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const bill = await staff.find();
    res.json(bill.filter((nurse) => nurse.Role === "Biller"));
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
