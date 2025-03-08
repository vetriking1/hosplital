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
} from "@mui/material";

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                            <Typography variant="h6" color="primary">
                              Visit Date: {formatDate(record.Follow_Up_Date)}
                            </Typography>
                            <Typography>
                              <strong>Diagnosis:</strong> {record.Diagnosis}
                            </Typography>
                            <Typography>
                              <strong>Treatment:</strong> {record.Treatment}
                            </Typography>
                            <Typography>
                              <strong>Medications:</strong> {record.Medications}
                            </Typography>
                            <Typography>
                              <strong>Notes:</strong> {record.Notes}
                            </Typography>
                            {record.Test_Reports &&
                              record.Test_Reports.length > 0 && (
                                <Box mt={1}>
                                  <Typography>
                                    <strong>Test Reports:</strong>
                                  </Typography>
                                  <List dense>
                                    {record.Test_Reports.map((report) => (
                                      <ListItem key={report._id}>
                                        <ListItemText
                                          primary={report.test_name}
                                          secondary={`Date: ${formatDate(
                                            report.date
                                          )}`}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
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
