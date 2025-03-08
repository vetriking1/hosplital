const express = require("express");
const staff = require("../models/Staff");
const router = express.Router();

const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const nurses = await staff.find();
    res.json(nurses.filter((nurse) => nurse.Role === "Nurse"));
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
