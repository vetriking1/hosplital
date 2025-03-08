import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const NurseDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_BASE_URL = "http://192.168.109.73:3000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [patientsRes, doctorsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/nurse/patients`),
        axios.get(`${API_BASE_URL}/nurse/doctors`),
      ]);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setSuccess(null);
    setError(null);
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    setSuccess(null);
    setError(null);
  };

  const handleAssignPatient = async () => {
    if (!selectedPatient || !selectedDoctor) {
      setError("Please select both a patient and a doctor");
      return;
    }

    try {
      setError(null);
      await axios.post(`${API_BASE_URL}/nurse/assign-patient`, {
        doctorId: selectedDoctor,
        patientId: selectedPatient._id,
      });
      setSuccess("Patient successfully assigned to doctor");
      setSelectedPatient(null);
      setSelectedDoctor("");
    } catch (error) {
      console.error("Error assigning patient:", error);
      setError(error.response?.data?.error || "Failed to assign patient");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <Grid container spacing={3}>
        {/* Patient List */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: "70vh", overflow: "auto" }}>
            <Typography variant="h6" gutterBottom>
              Patients
            </Typography>
            <List>
              {patients.map((patient) => (
                <React.Fragment key={patient._id}>
                  <ListItem
                    button
                    onClick={() => handlePatientClick(patient)}
                    selected={selectedPatient?._id === patient._id}
                  >
                    <ListItemText
                      primary={patient.Name}
                      secondary={`ID: ${patient.Patient_ID}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Doctor Assignment */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, minHeight: "70vh" }}>
            {selectedPatient ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Assign Patient to Doctor
                </Typography>
                <Typography gutterBottom>
                  Selected Patient: {selectedPatient.Name} (ID: {selectedPatient.Patient_ID})
                </Typography>
                <Box sx={{ my: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Doctor</InputLabel>
                    <Select
                      value={selectedDoctor}
                      onChange={handleDoctorChange}
                      label="Select Doctor"
                    >
                      {doctors.map((doctor) => (
                        <MenuItem key={doctor._id} value={doctor._id}>
                          {doctor.Name} - {doctor.Specialization}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAssignPatient}
                  disabled={!selectedDoctor}
                >
                  Assign Patient to Doctor
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  Select a patient to assign to a doctor
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NurseDashboard;
