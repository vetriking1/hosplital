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
  Card,
  CardContent,
  Alert,
  Button,
  Avatar,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { MedicalInformation, Person, Description } from "@mui/icons-material";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:3000";

  // Professional color palette
  const colors = {
    primary: "#2C3E50", // Dark Blue Gray
    secondary: "#1ABC9C", // Emerald
    background: "#ECF0F1", // Light Gray
    card: "#FFFFFF", // White for contrast
    text: "#2C3E50", // Dark text for readability
    highlight: "#16A085", // Slightly darker Emerald for accents
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/patients`);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("Failed to fetch patients. Please try again later.");
    }
  };

  const handlePatientClick = async (patientId) => {
    try {
      setError(null);
      const response = await axios.get(
        `${API_BASE_URL}/doctors/patient/${patientId}`
      );
      setSelectedPatient(response.data);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setError("Failed to fetch patient details. Please try again later.");
    }
  };

  return (
    <div className="bg-[#E8F6FC] text-gray-800 font-sans">
      <Navbar />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3}>
          {/* Patient List */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                p: 2,
                height: "70vh",
                overflow: "auto",
                backgroundColor: colors.card,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: colors.primary, fontWeight: "bold" }}
              >
                <MedicalInformation sx={{ mr: 1, verticalAlign: "middle" }} />
                Patient List
              </Typography>
              <List>
                {patients.map((patient) => (
                  <React.Fragment key={patient._id}>
                    <ListItem
                      button
                      onClick={() => handlePatientClick(patient._id)}
                      selected={selectedPatient?._id === patient._id}
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: colors.secondary,
                          color: "#fff",
                        },
                        "&:hover": {
                          backgroundColor: colors.highlight,
                          color: "#fff",
                        },
                        borderRadius: "8px",
                        my: 1,
                      }}
                    >
                      <Avatar sx={{ bgcolor: colors.primary, mr: 2 }}>
                        {patient.Name.charAt(0)}
                      </Avatar>
                      <ListItemText
                        primary={patient.Name}
                        primaryTypographyProps={{ fontWeight: "medium" }}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Patient Details and Medical Records */}
          <Grid item xs={12} md={8}>
            {selectedPatient ? (
              <Box>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: colors.card,
                    borderLeft: `5px solid ${colors.primary}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: colors.primary, fontWeight: "bold" }}
                  >
                    <Person sx={{ mr: 1, verticalAlign: "middle" }} />
                    Patient Information
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Name:</strong> {selectedPatient.Name}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Age:</strong> {selectedPatient.Age}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Gender:</strong> {selectedPatient.Gender}
                  </Typography>
                </Paper>
              </Box>
            ) : (
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  height: "70vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  backgroundColor: colors.card,
                }}
              >
                <MedicalInformation
                  sx={{
                    fontSize: 60,
                    color: colors.primary,
                    mb: 2,
                  }}
                />
                <Typography variant="h6" color="textSecondary">
                  Select a patient from the list to view their medical details.
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default DoctorDashboard;
