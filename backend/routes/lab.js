const express = require("express");
const staff = require("../models/Staff");
const router = express.Router();

const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const labAssistant = await staff.find();
    res.json(labAssistant.filter((nurse) => nurse.Role === "Lab Assistant"));
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
