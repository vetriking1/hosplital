import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Avatar,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  AttachMoney,
  Person,
  MedicalServices,
  Payment,
  Receipt,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
const BASE_URL = "http://localhost:3000";

// Color palette
const colors = {
  primary: "#404E7C", // YinMn Blue
  secondary: "#A5D8F3", // Uranian Blue
  background: "#E8F6FC", // Alice Blue
  accent: "#D0EAF4", // Columbia Blue
};

const Billing = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    Patient_ID: "",
    Doctor_ID: "",
    Total_Amount: "",
    Payment_Status: "Pending",
    Payment_Method: "Cash",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          axios.get(`${BASE_URL}/patients`),
          axios.get(`${BASE_URL}/doctors`),
        ]);
        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/bill/create`, formData);
      alert("Bill created successfully!");
      setFormData({
        Patient_ID: "",
        Doctor_ID: "",
        Total_Amount: "",
        Payment_Status: "Pending",
        Payment_Method: "Cash",
      });
    } catch (error) {
      console.error("Error creating bill:", error);
      alert("Error creating bill. Please try again.");
    }
  };

  return (
    <Box sx={{ backgroundColor: colors.background, minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              color: colors.primary,
            }}
          >
            <Receipt sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Create New Bill
            </Typography>
          </Box>
          <Divider sx={{ mb: 4, borderColor: colors.accent }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Patient Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: colors.primary }}>
                    Select Patient
                  </InputLabel>
                  <Select
                    name="Patient_ID"
                    value={formData.Patient_ID}
                    onChange={handleChange}
                    required
                    sx={{
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                      },
                    }}
                  >
                    {patients.map((patient) => (
                      <MenuItem
                        key={patient.Patient_ID}
                        value={patient.Patient_ID}
                      >
                        <Avatar
                          sx={{
                            bgcolor: colors.primary,
                            mr: 2,
                            width: 32,
                            height: 32,
                          }}
                        >
                          {patient.Name.charAt(0)}
                        </Avatar>
                        {patient.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Doctor Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: colors.primary }}>
                    Select Doctor
                  </InputLabel>
                  <Select
                    name="Doctor_ID"
                    value={formData.Doctor_ID}
                    onChange={handleChange}
                    required
                    sx={{
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                      },
                    }}
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.Doctor_ID} value={doctor.Doctor_ID}>
                        <Avatar
                          sx={{
                            bgcolor: colors.primary,
                            mr: 2,
                            width: 32,
                            height: 32,
                          }}
                        >
                          {doctor.Name.charAt(0)}
                        </Avatar>
                        {doctor.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Amount Input */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Amount"
                  name="Total_Amount"
                  type="number"
                  value={formData.Total_Amount}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney sx={{ color: colors.primary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: colors.primary,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primary,
                      },
                    },
                  }}
                />
              </Grid>

              {/* Payment Status */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: colors.primary }}>
                    Payment Status
                  </InputLabel>
                  <Select
                    name="Payment_Status"
                    value={formData.Payment_Status}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Pending">
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          bgcolor: "#FFC107",
                          borderRadius: "50%",
                          mr: 1,
                        }}
                      />
                      Pending
                    </MenuItem>
                    <MenuItem value="Paid">
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          bgcolor: "#4CAF50",
                          borderRadius: "50%",
                          mr: 1,
                        }}
                      />
                      Paid
                    </MenuItem>
                    <MenuItem value="Partially Paid">
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          bgcolor: "#2196F3",
                          borderRadius: "50%",
                          mr: 1,
                        }}
                      />
                      Partially Paid
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Payment Method */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: colors.primary }}>
                    Payment Method
                  </InputLabel>
                  <Select
                    name="Payment_Method"
                    value={formData.Payment_Method}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Cash">
                      <Payment sx={{ color: colors.primary, mr: 1 }} />
                      Cash
                    </MenuItem>
                    <MenuItem value="Card">
                      <Payment sx={{ color: colors.primary, mr: 1 }} />
                      Card
                    </MenuItem>
                    <MenuItem value="UPI">
                      <Payment sx={{ color: colors.primary, mr: 1 }} />
                      UPI
                    </MenuItem>
                    <MenuItem value="Insurance">
                      <MedicalServices sx={{ color: colors.primary, mr: 1 }} />
                      Insurance
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 2,
                    backgroundColor: colors.primary,
                    "&:hover": {
                      backgroundColor: colors.primary + "CC",
                    },
                  }}
                  startIcon={<Receipt />}
                >
                  Generate Bill
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Billing;
