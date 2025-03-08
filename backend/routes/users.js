const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/Users");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Staff = require("../models/Staff");

const router = express.Router();

// Add a new patient user
router.post("/addPatient", async (req, res) => {
  try {
    const {
      name,
      loginId,
      password,
      age,
      gender,
      contact_number,
      address,
      blood_group,
      admission_status,
    } = req.body;

    // Validate required fields
    const requiredFields = {
      name: "Name",
      loginId: "Login ID",
      password: "Password",
      age: "Age",
      gender: "Gender",
      contact_number: "Contact Number",
      address: "Address",
      blood_group: "Blood Group",
      admission_status: "Admission Status"
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields: missingFields
      });
    }

    // Check if loginId already exists
    const existingUser = await User.findOne({ loginId });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
        field: "loginId"
      });
    }

    // Generate unique Patient_ID
    const lastPatient = await Patient.findOne().sort({ Patient_ID: -1 });
    const newPatientId = lastPatient ? lastPatient.Patient_ID + 1 : 1;

    // Create a new Patient document
    const newPatient = new Patient({
      Patient_ID: newPatientId,
      Name: name,
      Age: age,
      Gender: gender,
      Contact_Number: contact_number,
      Address: address,
      Blood_Group: blood_group,
      Admission_Status: admission_status,
      Medical_History: [],
      Bills: [],
    });

    const savedPatient = await newPatient.save();

    // Create a User linked to this Patient
    const newUser = new User({
      loginId,
      password, // Will be hashed by middleware
      role: "Patient",
      userId: savedPatient._id,
    });

    await newUser.save();

    res.status(201).json({ 
      message: "Patient user created successfully",
      patient: {
        id: savedPatient._id,
        patientId: savedPatient.Patient_ID,
        name: savedPatient.Name
      }
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({
      error: "Failed to create patient",
      details: error.message,
      code: error.code
    });
  }
});

// Add a new doctor user
router.post("/addDoctor", async (req, res) => {
  try {
    const {
      name,
      loginId,
      password,
      age,
      gender,
      contact_number,
      address,
      department,
      specialization,
      qualification,
    } = req.body;

    // Validate required fields
    const requiredFields = {
      name: "Name",
      loginId: "Login ID",
      password: "Password",
      age: "Age",
      gender: "Gender",
      contact_number: "Contact Number",
      address: "Address",
      department: "Department",
      specialization: "Specialization",
      qualification: "Qualification"
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields: missingFields
      });
    }

    // Check if loginId already exists
    const existingUser = await User.findOne({ loginId });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
        field: "loginId"
      });
    }

    // Generate unique Doctor_ID
    const lastDoctor = await Doctor.findOne().sort({ Doctor_ID: -1 });
    const newDoctorId = lastDoctor ? lastDoctor.Doctor_ID + 1 : 1;

    // Create a new Doctor document
    const newDoctor = new Doctor({
      Doctor_ID: newDoctorId,
      Name: name,
      Age: age,
      Gender: gender,
      Contact_Number: contact_number,
      Address: address,
      Department: department,
      Specialization: specialization,
      Qualification: qualification,
      Availability_Status: "Available",
      Patients: []
    });

    const savedDoctor = await newDoctor.save();

    // Create a User linked to this Doctor
    const newUser = new User({
      loginId,
      password,
      role: "Doctor",
      userId: savedDoctor._id,
    });

    await newUser.save();

    res.status(201).json({ 
      message: "Doctor created successfully",
      doctor: {
        id: savedDoctor._id,
        doctorId: savedDoctor.Doctor_ID,
        name: savedDoctor.Name
      }
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({
      error: "Failed to create doctor",
      details: error.message,
      code: error.code
    });
  }
});

router.post("/addStaff", async (req, res) => {
  try {
    const {
      name,
      loginId,
      password,
      age,
      gender,
      contact_number,
      address,
      role,
      department
    } = req.body;

    // Validate required fields
    const requiredFields = {
      name: "Name",
      loginId: "Login ID",
      password: "Password",
      age: "Age",
      gender: "Gender",
      contact_number: "Contact Number",
      address: "Address",
      role: "Role",
      department: "Department"
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields: missingFields
      });
    }

    // Check if loginId already exists
    const existingUser = await User.findOne({ loginId });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
        field: "loginId"
      });
    }

    // Generate unique Staff_ID
    const lastStaff = await Staff.findOne().sort({ Staff_ID: -1 });
    const newStaffId = lastStaff ? lastStaff.Staff_ID + 1 : 1;

    // Create a new Staff document with proper field mapping
    const newStaff = new Staff({
      Staff_ID: newStaffId,
      Name: name,
      Age: parseInt(age),
      Gender: gender,
      Contact_Number: contact_number,
      Address: address,
      Role: role,
      Department: department,
      Attendance_Status: "Present"
    });

    const savedStaff = await newStaff.save();

    // Create a User linked to this Staff
    const newUser = new User({
      loginId,
      password,
      role: role,
      userId: savedStaff._id,
    });

    await newUser.save();

    res.status(201).json({ 
      message: "Staff created successfully",
      staff: {
        id: savedStaff._id,
        staffId: savedStaff.Staff_ID,
        name: savedStaff.Name,
        role: savedStaff.Role
      }
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({
      error: "Failed to create staff",
      details: error.message,
      code: error.code
    });
  }
});

// Add a new admin user
router.post("/addAdmin", async (req, res) => {
  try {
    const { loginId, password } = req.body;

    // Validate required fields
    const requiredFields = {
      loginId: "Login ID",
      password: "Password"
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields: missingFields
      });
    }

    // Check if loginId already exists
    const existingUser = await User.findOne({ loginId });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
        field: "loginId"
      });
    }

    const newUser = new User({
      loginId,
      password,
      role: "Admin",
    });

    await newUser.save();

    res.status(201).json({ 
      message: "Admin user created successfully",
      admin: {
        id: newUser._id,
        loginId: newUser.loginId
      }
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({
      error: "Failed to create admin",
      details: error.message,
      code: error.code
    });
  }
});

// Get all patients with filtering
router.get("/patients", async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { Name: { $regex: search, $options: 'i' } },
          { Blood_Group: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (status) {
      query.Admission_Status = status;
    }

    const patients = await Patient.find(query).sort({ Patient_ID: -1 });
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

// Get all doctors with filtering
router.get("/doctors", async (req, res) => {
  try {
    const { search, department } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { Name: { $regex: search, $options: 'i' } },
          { Specialization: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (department) {
      query.Department = department;
    }

    const doctors = await Doctor.find(query).sort({ Doctor_ID: -1 });
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// Get all staff with filtering
router.get("/staff", async (req, res) => {
  try {
    const { search, role, department } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { Name: { $regex: search, $options: 'i' } },
          { Role: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (role) {
      query.Role = role;
    }

    if (department) {
      query.Department = department;
    }

    const staff = await Staff.find(query).sort({ Staff_ID: -1 });
    res.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

module.exports = router;
