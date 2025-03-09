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
} from "@mui/material";

const BASE_URL = "http://192.168.109.73:3000";

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
        console.log("Patients data:", patientsRes.data);
        console.log("Doctors data:", doctorsRes.data);
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
      const response = await axios.post(`${BASE_URL}/bill/create`, formData);
      alert("Bill created successfully!");
      // Reset form
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
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Bill
        </Typography>
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Patient</InputLabel>
                  <Select
                    name="Patient_ID"
                    value={formData.Patient_ID}
                    onChange={handleChange}
                    required
                  >
                    {patients.map((patient) => (
                      <MenuItem
                        key={patient.Patient_ID}
                        value={patient.Patient_ID}
                      >
                        {patient.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    name="Doctor_ID"
                    value={formData.Doctor_ID}
                    onChange={handleChange}
                    required
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.Doctor_ID} value={doctor.Doctor_ID}>
                        {doctor.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Amount"
                  name="Total_Amount"
                  type="number"
                  value={formData.Total_Amount}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    name="Payment_Status"
                    value={formData.Payment_Status}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Partially Paid">Partially Paid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    name="Payment_Method"
                    value={formData.Payment_Method}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Card">Card</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Insurance">Insurance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Create Bill
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Billing;
