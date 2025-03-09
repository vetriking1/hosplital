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
} from "@mui/material";
import Navbar from "../components/Navbar";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://192.168.109.73:3000";

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

  const viewPDF = async (reportId) => {
    if (!reportId) {
      setError("Report ID is missing");
      return;
    }

    try {
      console.log("Viewing PDF for report ID:", reportId);
      const response = await axios.get(
        `${API_BASE_URL}/user-dashboard/report-pdf/${reportId}`,
        {
          responseType: "blob", // Ensure binary response
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Open in new tab
      window.open(url);

      // Cleanup URL after some time
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 10000);
    } catch (error) {
      console.error("Error viewing PDF:", error);
      setError(
        "Failed to view PDF: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Navbar />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
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
                    onClick={() => handlePatientClick(patient._id)}
                    selected={selectedPatient?._id === patient._id}
                  >
                    <ListItemText primary={patient.Name} />
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
              {/* Patient Information */}
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Patient Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Name:</strong> {selectedPatient.Name}
                    </Typography>
                    <Typography>
                      <strong>Age:</strong> {selectedPatient.Age}
                    </Typography>
                    <Typography>
                      <strong>Gender:</strong> {selectedPatient.Gender}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Blood Group:</strong>{" "}
                      {selectedPatient.Blood_Group}
                    </Typography>
                    <Typography>
                      <strong>Contact:</strong> {selectedPatient.Contact_Number}
                    </Typography>
                    <Typography>
                      <strong>Address:</strong> {selectedPatient.Address}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Medical Records */}
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Medical Records
                </Typography>
                <Grid container spacing={2}>
                  {selectedPatient.Medical_History &&
                  selectedPatient.Medical_History.length > 0 ? (
                    selectedPatient.Medical_History.map((record) => (
                      <Grid item xs={12} key={record._id}>
                        <Card>
                          <CardContent>
                            {record.Test_Reports &&
                              record.Test_Reports.length > 0 && (
                                <Box mt={2}>
                                  <Typography variant="subtitle1" gutterBottom>
                                    <strong>Test Reports:</strong>
                                  </Typography>
                                  <Grid container spacing={2}>
                                    {record.Test_Reports.map((report) => (
                                      <Grid item xs={12} key={report._id}>
                                        <Card variant="outlined">
                                          <CardContent>
                                            <Typography variant="subtitle2">
                                              Test Name: {report.Test_Name}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="textSecondary"
                                            >
                                              Date:{" "}
                                              {formatDate(report.Test_Date)}
                                            </Typography>
                                            <Typography variant="body2">
                                              Result: {report.Test_Result}
                                            </Typography>
                                            <Button
                                              variant="contained"
                                              color="primary"
                                              size="small"
                                              onClick={() =>
                                                viewPDF(report._id)
                                              }
                                              sx={{ mt: 1 }}
                                            >
                                              View Report PDF
                                            </Button>
                                          </CardContent>
                                        </Card>
                                      </Grid>
                                    ))}
                                  </Grid>
                                </Box>
                              )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography color="textSecondary" align="center">
                        No medical records found for this patient
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Box>
          ) : (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                height: "70vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Select a patient to view their details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorDashboard;
