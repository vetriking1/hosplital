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
  Tab,
  Tabs,
} from "@mui/material";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const NurseDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tabValue, setTabValue] = useState(0);

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedPatient(null);
    setSelectedDoctor("");
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

  const handleCreateMedicalRecord = async () => {
    if (!selectedPatient || !selectedDoctor) {
      setError("Please select both a patient and a doctor");
      return;
    }

    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/nurse/create-medical-record`, {
        patientId: selectedPatient.Patient_ID,
        doctorId: selectedDoctor
      });
      
      setSuccess(response.data.message);
      setSelectedPatient(null);
      setSelectedDoctor("");
    } catch (error) {
      console.error("Error creating medical record:", error);
      const errorMessage = error.response?.data?.error || "Failed to create medical record. Please try again.";
      setError(errorMessage);
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

      <Paper elevation={3} sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Assign Patient to Doctor" />
            <Tab label="Create Medical Record" />
          </Tabs>
        </Box>

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
                      onClick={() => handlePatientClick(patient)}
                      selected={selectedPatient?._id === patient._id}
                      sx={{ cursor: 'pointer' }}
                    >
                      <ListItemText
                        primary={patient.Name}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Doctor Assignment/Medical Record Creation */}
          <Grid item xs={12} md={8}>
            <TabPanel value={tabValue} index={0}>
              <Paper elevation={3} sx={{ p: 2, minHeight: "70vh" }}>
                {selectedPatient ? (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Assign Patient to Doctor
                    </Typography>
                    <Typography gutterBottom>
                      Selected Patient: {selectedPatient.Name}
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
                              Dr. {doctor.Name} - {doctor.Specialization} (ID: {doctor.Doctor_ID})
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
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Paper elevation={3} sx={{ p: 2, minHeight: "70vh" }}>
                {selectedPatient ? (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Create Medical Record
                    </Typography>
                    <Typography gutterBottom>
                      Selected Patient: {selectedPatient.Name}
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
                              Dr. {doctor.Name} - {doctor.Specialization} (ID: {doctor.Doctor_ID})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCreateMedicalRecord}
                      disabled={!selectedDoctor}
                    >
                      Create Medical Record
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
                      Select a patient to create a medical record
                    </Typography>
                  </Box>
                )}
              </Paper>
            </TabPanel>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default NurseDashboard;
