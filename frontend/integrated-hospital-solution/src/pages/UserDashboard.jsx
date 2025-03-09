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
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

const UserDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = "http://192.168.109.73:3000";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // First fetch patient data using user ID
    const fetchPatientData = async () => {
      try {
        console.log("Fetching patient data for user:", user._id);
        const response = await axios.get(
          `${API_BASE_URL}/patients/user/${user._id}`
        );

        if (response.data) {
          console.log("Patient data received:", response.data);
          setPatientData(response.data);
          console.log("Medical records:", response.data.Medical_History);
          // Check if Medical_History has TestReport field
          if (response.data.Medical_History) {
            response.data.Medical_History.forEach(record => {
              console.log("Record's test reports:", record.TestReport);
            });
          }
          setMedicalRecords(response.data.Medical_History || []);
          setBills(response.data.Bills || []);
        } else {
          setError("User is not a patient. Access denied.");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        if (error.response?.status === 404) {
          setError(
            "No patient record found for this user. Please contact the administrator."
          );
        } else {
          setError("Failed to fetch patient data. Please try again later.");
        }
      }
    };

    fetchPatientData();
  }, [user, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url);
    } catch (error) {
      console.error("Error viewing PDF:", error);
      setError(
        "Failed to view PDF: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Improved date formatting function that handles various date formats
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      // Handle ISO strings with timezone information
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "N/A";
      }

      // Format as DD/MM/YYYY
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase() || "") {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Medical Records" />
            <Tab label="Test Reports" />
            <Tab label="Bills" />
          </Tabs>
        </Box>

        {/* Medical Records Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            {medicalRecords && medicalRecords.length > 0 ? (
              medicalRecords.map((record) => (
                <Grid item xs={12} key={record._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Record ID: {record.Record_ID || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Doctor:</strong> Dr.{" "}
                        {typeof record.Doctor_ID === "object"
                          ? record.Doctor_ID.name
                          : record.Doctor_ID || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Date:</strong> {formatDate(record.createdAt)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography align="center">No medical records found</Typography>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Test Reports Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            {medicalRecords && medicalRecords.length > 0 ? (
              medicalRecords.map((record) => (
                record.TestReport && record.TestReport.map((report) => (
                  <Grid item xs={12} key={report._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Test Name: {report.Test_Name}
                        </Typography>
                        <Typography>
                          <strong>Test Date:</strong> {formatDate(report.Test_Date)}
                        </Typography>
                        <Typography>
                          <strong>Test Result:</strong> {report.Test_Result}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => viewPDF(report._id)}
                          sx={{ mt: 2 }}
                        >
                          View Report PDF
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ))
            ) : (
              <Grid item xs={12}>
                <Typography align="center">No test reports found</Typography>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Bills Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={2}>
            {bills && bills.length > 0 ? (
              bills.map((bill) => (
                <Grid item xs={12} key={bill._id}>
                  <Card>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="h6">
                          Bill #{bill.Bill_ID || "N/A"}
                        </Typography>
                        <Chip
                          label={bill.Payment_Status || "Unknown"}
                          color={getPaymentStatusColor(bill.Payment_Status)}
                        />
                      </Box>
                      <Typography color="textSecondary" gutterBottom>
                        Date: {formatDate(bill.Payment_Date)}
                      </Typography>
                      <Typography variant="h5" component="div">
                        ₹{bill.Amount || "0"}
                      </Typography>
                      <Typography color="textSecondary">
                        {bill.Description || "No description"}
                      </Typography>
                      {(!bill.Payment_Status ||
                        bill.Payment_Status.toLowerCase() !== "paid") && (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2 }}
                          // TODO: Implement payment gateway integration
                          onClick={() =>
                            alert("Payment gateway integration pending")
                          }
                        >
                          Pay Now
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography align="center">No bills found</Typography>
              </Grid>
            )}
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default UserDashboard;
