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
  IconButton,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Navbar from "../components/Navbar";

// Custom styled components for a professional look
const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: "#E8F6FC", // Alice Blue for a clean background
  padding: theme.spacing(4),
  minHeight: "100vh",
  fontFamily: "'Roboto', sans-serif", // Professional font
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#FFFFFF", // White for a crisp, professional card
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // Subtle shadow for depth
  border: "1px solid #D0EAF4", // Columbia Blue border for a soft outline
  height: "100%",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)", // Slight lift on hover
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#404E7C", // YInMn Blue for primary actions
  color: "#FFFFFF",
  padding: theme.spacing(1, 3),
  borderRadius: 8,
  textTransform: "none", // Avoid uppercase for a modern look
  fontWeight: 600,
  "&:hover": {
    backgroundColor: alpha("#404E7C", 0.85), // Slightly lighter on hover
    boxShadow: "0 2px 8px rgba(64, 78, 124, 0.2)",
  },
  "&:disabled": {
    backgroundColor: "#D0EAF4", // Columbia Blue for disabled state
    color: "#666",
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  borderColor: "#A5D8F3", // Uranian Blue for secondary buttons
  color: "#404E7C", // YInMn Blue for text
  padding: theme.spacing(1, 3),
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#A5D8F3", // Uranian Blue on hover
    borderColor: "#404E7C",
    color: "#404E7C",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    backgroundColor: "#F9FBFD", // Very light background for inputs
    "& fieldset": {
      borderColor: "#D0EAF4", // Columbia Blue for input borders
    },
    "&:hover fieldset": {
      borderColor: "#A5D8F3", // Uranian Blue on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#404E7C", // YInMn Blue when focused
    },
  },
  "& .MuiInputLabel-root": {
    color: "#404E7C", // YInMn Blue for labels
    fontWeight: 500,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#404E7C",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: "#F9FBFD",
  "& .MuiSelect-select": {
    color: "#404E7C",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#D0EAF4",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#A5D8F3",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#404E7C",
  },
}));

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

  const API_BASE_URL = "http://localhost:3000";

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
      setError("Failed to fetch patients. Please try again.");
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
      setError("Failed to fetch medical records. Please try again.");
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
      setError("Please select a valid PDF file.");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !testName || !testResult || !selectedRecord) {
      setError("Please fill in all fields and select a PDF file.");
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

      setSuccess("Test report uploaded successfully.");
      setTestName("");
      setTestResult("");
      setSelectedFile(null);
      await fetchMedicalRecords(selectedPatient.Patient_ID);
    } catch (error) {
      console.error("Error uploading report:", error);
      setError("Failed to upload test report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const viewPDF = async (reportId) => {
    if (!reportId) {
      setError("Report ID is missing.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/user-dashboard/report-pdf/${reportId}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("Error viewing PDF:", error);
      setError("Failed to view PDF. Please try again.");
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

        <Grid container spacing={4}>
          {/* Patient List */}
          <Grid item xs={12} md={4}>
            <StyledPaper sx={{ height: "70vh", overflow: "auto" }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: "#404E7C", // YInMn Blue for headers
                  fontWeight: 600,
                  borderBottom: "2px solid #D0EAF4", // Columbia Blue underline
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
                          backgroundColor: "#A5D8F3", // Uranian Blue for selected
                          "&:hover": { backgroundColor: "#A5D8F3" },
                        },
                        "&:hover": {
                          backgroundColor: "#D0EAF4", // Columbia Blue on hover
                        },
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <ListItemText
                        primary={patient.Name}
                        secondary={`ID: ${patient.Patient_ID}`}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          color: "#404E7C",
                        }}
                        secondaryTypographyProps={{
                          color: "#666",
                          fontSize: "0.85rem",
                        }}
                      />
                    </ListItem>
                    <Divider sx={{ backgroundColor: "#D0EAF4" }} />
                  </React.Fragment>
                ))}
              </List>
            </StyledPaper>
          </Grid>

          {/* Medical Records and Test Upload */}
          <Grid item xs={12} md={8}>
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
                    Medical Records for {selectedPatient.Name}
                  </Typography>

                  {/* Medical Records Selection */}
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel sx={{ color: "#404E7C", fontWeight: 500 }}>
                      Select Medical Record
                    </InputLabel>
                    <StyledSelect
                      value={selectedRecord?._id || ""}
                      onChange={(e) =>
                        handleRecordSelect(
                          medicalRecords.find((r) => r._id === e.target.value)
                        )
                      }
                      label="Select Medical Record"
                    >
                      {medicalRecords.map((record) => (
                        <MenuItem
                          key={record._id}
                          value={record._id}
                          sx={{ color: "#404E7C", fontWeight: 500 }}
                        >
                          Record ID: {record.Record_ID}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>

                  {selectedRecord && (
                    <Box>
                      {/* Test Reports List */}
                      {selectedRecord.Test_Reports &&
                        selectedRecord.Test_Reports.length > 0 && (
                          <Box sx={{ mb: 4 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{
                                color: "#404E7C",
                                fontWeight: 600,
                                borderBottom: "1px solid #D0EAF4",
                                pb: 1,
                              }}
                            >
                              Existing Test Reports
                            </Typography>
                            <List>
                              {selectedRecord.Test_Reports.map((report) => (
                                <ListItem
                                  key={report._id}
                                  secondaryAction={
                                    <IconButton
                                      onClick={() => viewPDF(report._id)}
                                      sx={{
                                        color: "#404E7C",
                                        "&:hover": { color: "#A5D8F3" },
                                      }}
                                    >
                                      <VisibilityIcon />
                                    </IconButton>
                                  }
                                  sx={{
                                    borderBottom: "1px solid #E8F6FC",
                                    py: 1.5,
                                  }}
                                >
                                  <ListItemText
                                    primary={report.Test_Name}
                                    secondary={`Result: ${
                                      report.Test_Result
                                    } | Date: ${new Date(
                                      report.Test_Date
                                    ).toLocaleDateString()}`}
                                    primaryTypographyProps={{
                                      fontWeight: 500,
                                      color: "#404E7C",
                                    }}
                                    secondaryTypographyProps={{
                                      color: "#666",
                                      fontSize: "0.85rem",
                                    }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}

                      {/* Upload New Test Report */}
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: "#404E7C",
                          fontWeight: 600,
                          borderBottom: "1px solid #D0EAF4",
                          pb: 1,
                        }}
                      >
                        Upload New Test Report
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <StyledTextField
                            fullWidth
                            label="Test Name"
                            value={testName}
                            onChange={(e) => setTestName(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StyledTextField
                            fullWidth
                            label="Test Result"
                            value={testResult}
                            onChange={(e) => setTestResult(e.target.value)}
                            multiline
                            rows={4}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <label htmlFor="pdf-file">
                            <input
                              accept="application/pdf"
                              id="pdf-file"
                              type="file"
                              style={{ display: "none" }}
                              onChange={handleFileSelect}
                            />
                            <SecondaryButton
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              component="span"
                            >
                              Select PDF File
                            </SecondaryButton>
                          </label>
                          {selectedFile && (
                            <Typography
                              variant="body2"
                              sx={{ mt: 1, color: "#404E7C", fontWeight: 500 }}
                            >
                              Selected: {selectedFile.name}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <StyledButton
                            onClick={handleUpload}
                            disabled={
                              loading ||
                              !selectedFile ||
                              !testName ||
                              !testResult
                            }
                            startIcon={loading ? null : <CloudUploadIcon />}
                          >
                            {loading ? (
                              <CircularProgress
                                size={24}
                                sx={{ color: "#FFF" }}
                              />
                            ) : (
                              "Upload Test Report"
                            )}
                          </StyledButton>
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
                  <Typography
                    variant="h6"
                    sx={{ color: "#404E7C", fontWeight: 500 }}
                  >
                    Select a patient to manage test reports
                  </Typography>
                </Box>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </StyledContainer>
    </div>
  );
};

export default LabDashboard;
