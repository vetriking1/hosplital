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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Input = styled("input")({
  display: "none",
});

const LabDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [testName, setTestName] = useState("");
  const [testResult, setTestResult] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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
      setError("Failed to fetch patients");
    }
  };

  const fetchMedicalRecords = async (patientId) => {
    try {
      setError(null);
      const response = await axios.get(
        `${API_BASE_URL}/lab/medical-records/${patientId}`
      );
      setMedicalRecords(response.data);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      setError("Failed to fetch medical records");
    }
  };

  const handlePatientClick = async (patient) => {
    setSelectedPatient(patient);
    setSelectedRecord(null);
    setSelectedFile(null);
    setTestName("");
    setTestResult("");
    await fetchMedicalRecords(patient.Patient_ID);
  };

  const handleRecordSelect = (record) => {
    setSelectedRecord(record);
    setSuccess(null);
    setError(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("Please select a PDF file");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !testName || !testResult || !selectedRecord) {
      setError("Please fill in all fields and select a PDF file");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("pdfFile", selectedFile);
    formData.append("patientId", selectedPatient.Patient_ID);
    formData.append("doctorId", selectedRecord.Doctor_ID);
    formData.append("medicalRecordId", selectedRecord._id);
    formData.append("testName", testName);
    formData.append("testResult", testResult);

    try {
      await axios.post(`${API_BASE_URL}/lab/upload-report`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Test report uploaded successfully");
      setTestName("");
      setTestResult("");
      setSelectedFile(null);
      await fetchMedicalRecords(selectedPatient.Patient_ID);
    } catch (error) {
      console.error("Error uploading report:", error);
      setError("Failed to upload test report");
    } finally {
      setLoading(false);
    }
  };

  const viewPDF = async (reportId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/lab/report-pdf/${reportId}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url);
    } catch (error) {
      console.error("Error viewing PDF:", error);
      setError("Failed to view PDF");
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

        {/* Medical Records and Test Upload */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, minHeight: "70vh" }}>
            {selectedPatient ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Medical Records for {selectedPatient.Name}
                </Typography>

                {/* Medical Records Selection */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Select Medical Record</InputLabel>
                  <Select
                    value={selectedRecord?._id || ""}
                    onChange={(e) =>
                      handleRecordSelect(
                        medicalRecords.find((r) => r._id === e.target.value)
                      )
                    }
                    label="Select Medical Record"
                  >
                    {medicalRecords.map((record) => (
                      <MenuItem key={record._id} value={record._id}>
                        Record ID: {record.Record_ID}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedRecord && (
                  <Box>
                    {/* Test Reports List */}
                    {selectedRecord.Test_Reports &&
                      selectedRecord.Test_Reports.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            Existing Test Reports
                          </Typography>
                          <List>
                            {selectedRecord.Test_Reports.map((report) => (
                              <ListItem
                                key={report._id}
                                secondaryAction={
                                  <Button
                                    variant="outlined"
                                    onClick={() => viewPDF(report._id)}
                                  >
                                    View PDF
                                  </Button>
                                }
                              >
                                <ListItemText
                                  primary={report.Test_Name}
                                  secondary={`Result: ${
                                    report.Test_Result
                                  } - Date: ${new Date(
                                    report.Test_Date
                                  ).toLocaleDateString()}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                    {/* Upload New Test Report */}
                    <Typography variant="h6" gutterBottom>
                      Upload New Test Report
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Test Name"
                          value={testName}
                          onChange={(e) => setTestName(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Test Result"
                          value={testResult}
                          onChange={(e) => setTestResult(e.target.value)}
                          multiline
                          rows={3}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <label htmlFor="pdf-file">
                          <Input
                            accept="application/pdf"
                            id="pdf-file"
                            type="file"
                            onChange={handleFileSelect}
                          />
                          <Button variant="outlined" component="span">
                            Select PDF File
                          </Button>
                        </label>
                        {selectedFile && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Selected file: {selectedFile.name}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={handleUpload}
                          disabled={
                            loading || !selectedFile || !testName || !testResult
                          }
                        >
                          {loading ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Upload Test Report"
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
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
                  Select a patient to manage test reports
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LabDashboard;
