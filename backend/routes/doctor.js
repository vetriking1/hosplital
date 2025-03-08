const express = require("express");
const doctor = require("../models/Doctor");
const router = express.Router();

const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const doctors = await doctor.find();
    res.json(doctors);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
