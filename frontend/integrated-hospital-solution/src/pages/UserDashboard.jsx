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
  const { user } = useAuth();

  const API_BASE_URL = "http://192.168.109.73:3000";

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setError(null);
      const [recordsRes, billsRes] = await Promise.all([
        axios.get(
          `${API_BASE_URL}/user-dashboard/medical-records/${user.Patient_ID}`
        ),
        axios.get(`${API_BASE_URL}/user-dashboard/bills/${user.Patient_ID}`),
      ]);
      setMedicalRecords(recordsRes.data);
      setBills(billsRes.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch your data. Please try again later.");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const viewPDF = async (reportId) => {
    try {
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
      setError("Failed to view PDF");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
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
            {medicalRecords.map((record) => (
              <Grid item xs={12} key={record._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Record ID: {record.Record_ID}
                    </Typography>
                    <Typography>
                      <strong>Doctor:</strong> Dr. {record.Doctor_ID}
                    </Typography>
                    <Typography>
                      <strong>Date:</strong> {formatDate(record.createdAt)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Test Reports Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            {medicalRecords.map((record) =>
              record.Test_Reports.map((report) => (
                <Grid item xs={12} key={report._id}>
                  <Card>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="h6">{report.Test_Name}</Typography>
                        <Button
                          variant="outlined"
                          onClick={() => viewPDF(report._id)}
                        >
                          View Report
                        </Button>
                      </Box>
                      <Typography color="textSecondary" gutterBottom>
                        Date: {formatDate(report.Test_Date)}
                      </Typography>
                      <Typography>
                        <strong>Result:</strong> {report.Test_Result}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </TabPanel>

        {/* Bills Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={2}>
            {bills.map((bill) => (
              <Grid item xs={12} key={bill._id}>
                <Card>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">Bill #{bill.Bill_ID}</Typography>
                      <Chip
                        label={bill.Payment_Status}
                        color={getPaymentStatusColor(bill.Payment_Status)}
                      />
                    </Box>
                    <Typography color="textSecondary" gutterBottom>
                      Date: {formatDate(bill.Payment_Date)}
                    </Typography>
                    <Typography variant="h5" component="div">
                      ₹{bill.Amount}
                    </Typography>
                    <Typography color="textSecondary">
                      {bill.Description}
                    </Typography>
                    {bill.Payment_Status.toLowerCase() !== "paid" && (
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
            ))}
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default UserDashboard;
