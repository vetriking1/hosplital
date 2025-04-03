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
import { styled, alpha } from "@mui/material/styles";
import Navbar from "../components/Navbar";

// Custom TabPanel component
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

// Custom styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: "#E8F6FC", // Alice Blue for a clean background
  padding: theme.spacing(4),
  minHeight: "100vh",
  fontFamily: "'Roboto', sans-serif", // Professional font
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#FFFFFF", // White for crisp cards
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // Subtle shadow
  border: "1px solid #D0EAF4", // Columbia Blue border
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)", // Lift on hover
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: "#404E7C", // YInMn Blue for tab indicator
  },
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 500,
    color: "#404E7C",
    "&.Mui-selected": {
      color: "#404E7C",
      fontWeight: 600,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#404E7C", // YInMn Blue for primary actions
  color: "#FFFFFF",
  padding: theme.spacing(1, 3),
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: alpha("#404E7C", 0.85), // Slightly lighter on hover
    boxShadow: "0 2px 8px rgba(64, 78, 124, 0.2)",
  },
  "&:disabled": {
    backgroundColor: "#D0EAF4", // Columbia Blue for disabled
    color: "#666",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: "#F9FBFD",
  "& .MuiSelect-select": {
    color: "#404E7C",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D0EAF4", // Columbia Blue
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#A5D8F3", // Uranian Blue on hover
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#404E7C", // YInMn Blue when focused
  },
}));

const NurseDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const API_BASE_URL = "http://localhost:3000";

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
      const response = await axios.post(
        `${API_BASE_URL}/nurse/create-medical-record`,
        {
          patientId: selectedPatient.Patient_ID,
          doctorId: selectedDoctor,
        }
      );
      setSuccess(response.data.message);
      setSelectedPatient(null);
      setSelectedDoctor("");
    } catch (error) {
      console.error("Error creating medical record:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to create medical record. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div>
      <Navbar />
      <StyledContainer maxWidth="lg">
        {/* Alerts */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: "#FFF1F1",
              color: "#D32F2F",
            }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: "#E8F5E9",
              color: "#2E7D32",
            }}
          >
            {success}
          </Alert>
        )}

        <StyledPaper sx={{ width: "100%", mb: 4 }}>
          <StyledTabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Assign Patient to Doctor" />
            <Tab label="Create Medical Record" />
          </StyledTabs>

          <Grid container spacing={4}>
            {/* Patient List */}
            <Grid item xs={12} md={4}>
              <StyledPaper sx={{ height: "70vh", overflow: "auto" }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    color: "#404E7C", // YInMn Blue
                    fontWeight: 600,
                    borderBottom: "2px solid #D0EAF4", // Columbia Blue
                    pb: 1,
                  }}
                >
                  Patient List
                </Typography>
                <List>
                  {patients.map((patient) => (
                    <React.Fragment key={patient._id}>
                      <ListItem
                        button
                        onClick={() => handlePatientClick(patient)}
                        selected={selectedPatient?._id === patient._id}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          "&.Mui-selected": {
                            backgroundColor: "#A5D8F3", // Uranian Blue
                            "&:hover": { backgroundColor: "#A5D8F3" },
                          },
                          "&:hover": {
                            backgroundColor: "#D0EAF4", // Columbia Blue
                          },
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <ListItemText
                          primary={patient.Name}
                          primaryTypographyProps={{
                            fontWeight: 500,
                            color: "#404E7C",
                          }}
                        />
                      </ListItem>
                      <Divider sx={{ backgroundColor: "#D0EAF4" }} />
                    </React.Fragment>
                  ))}
                </List>
              </StyledPaper>
            </Grid>

            {/* Doctor Assignment/Medical Record Creation */}
            <Grid item xs={12} md={8}>
              <TabPanel value={tabValue} index={0}>
                <StyledPaper sx={{ minHeight: "70vh" }}>
                  {selectedPatient ? (
                    <Box>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          color: "#404E7C",
                          fontWeight: 600,
                          borderBottom: "2px solid #D0EAF4",
                          pb: 1,
                        }}
                      >
                        Assign Patient to Doctor
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{ color: "#404E7C", fontWeight: 500 }}
                      >
                        Selected Patient: {selectedPatient.Name}
                      </Typography>
                      <Box sx={{ my: 4 }}>
                        <FormControl fullWidth>
                          <InputLabel
                            sx={{ color: "#404E7C", fontWeight: 500 }}
                          >
                            Select Doctor
                          </InputLabel>
                          <StyledSelect
                            value={selectedDoctor}
                            onChange={handleDoctorChange}
                            label="Select Doctor"
                          >
                            {doctors.map((doctor) => (
                              <MenuItem
                                key={doctor._id}
                                value={doctor._id}
                                sx={{ color: "#404E7C", fontWeight: 500 }}
                              >
                                Dr. {doctor.Name} - {doctor.Specialization} (ID:{" "}
                                {doctor.Doctor_ID})
                              </MenuItem>
                            ))}
                          </StyledSelect>
                        </FormControl>
                      </Box>
                      <StyledButton
                        onClick={handleAssignPatient}
                        disabled={!selectedDoctor}
                      >
                        Assign Patient to Doctor
                      </StyledButton>
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
                      <Typography
                        variant="h6"
                        sx={{ color: "#404E7C", fontWeight: 500 }}
                      >
                        Select a patient to assign to a doctor
                      </Typography>
                    </Box>
                  )}
                </StyledPaper>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <StyledPaper sx={{ minHeight: "70vh" }}>
                  {selectedPatient ? (
                    <Box>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          color: "#404E7C",
                          fontWeight: 600,
                          borderBottom: "2px solid #D0EAF4",
                          pb: 1,
                        }}
                      >
                        Create Medical Record
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{ color: "#404E7C", fontWeight: 500 }}
                      >
                        Selected Patient: {selectedPatient.Name}
                      </Typography>
                      <Box sx={{ my: 4 }}>
                        <FormControl fullWidth>
                          <InputLabel
                            sx={{ color: "#404E7C", fontWeight: 500 }}
                          >
                            Select Doctor
                          </InputLabel>
                          <StyledSelect
                            value={selectedDoctor}
                            onChange={handleDoctorChange}
                            label="Select Doctor"
                          >
                            {doctors.map((doctor) => (
                              <MenuItem
                                key={doctor._id}
                                value={doctor._id}
                                sx={{ color: "#404E7C", fontWeight: 500 }}
                              >
                                Dr. {doctor.Name} - {doctor.Specialization} (ID:{" "}
                                {doctor.Doctor_ID})
                              </MenuItem>
                            ))}
                          </StyledSelect>
                        </FormControl>
                      </Box>
                      <StyledButton
                        onClick={handleCreateMedicalRecord}
                        disabled={!selectedDoctor}
                      >
                        Create Medical Record
                      </StyledButton>
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
                      <Typography
                        variant="h6"
                        sx={{ color: "#404E7C", fontWeight: 500 }}
                      >
                        Select a patient to create a medical record
                      </Typography>
                    </Box>
                  )}
                </StyledPaper>
              </TabPanel>
            </Grid>
          </Grid>
        </StyledPaper>
      </StyledContainer>
    </div>
  );
};

export default NurseDashboard;
