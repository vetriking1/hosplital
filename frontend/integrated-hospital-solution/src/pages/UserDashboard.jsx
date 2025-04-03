import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
  ThemeProvider,
  createTheme,
  Skeleton,
  Avatar,
  Divider,
} from "@mui/material";
import {
  MedicalServices,
  Assignment,
  Receipt,
  Article,
  DateRange,
  Person,
  Paid,
  PictureAsPdf,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Create a custom theme with the color palette
const theme = createTheme({
  palette: {
    primary: {
      main: "#404E7C", // YInMn Blue
      light: "#596694",
      dark: "#2b3866",
      contrastText: "#fff",
    },
    secondary: {
      main: "#A5D8F3", // Uranian Blue
      light: "#D0EAF4", // Columbia Blue
      dark: "#7ab7d1",
      contrastText: "#404E7C",
    },
    background: {
      default: "#E8F6FC", // Alice Blue
      paper: "#fff",
    },
    text: {
      primary: "#333333",
      secondary: "#5a5a5a",
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
      color: "#404E7C",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderRadius: 12,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "1rem",
          minHeight: 48,
          "&.Mui-selected": {
            color: "#404E7C",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#404E7C",
          height: 3,
        },
      },
    },
  },
});

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
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // First fetch patient data using user ID
    const fetchPatientData = async () => {
      try {
        setLoading(true);
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
            response.data.Medical_History.forEach((record) => {
              console.log("Record's test reports:", record.Test_Reports);
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
      } finally {
        setLoading(false);
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
    <ThemeProvider theme={theme}>
      <Box
        sx={{ minHeight: "100vh", bgcolor: "background.default", pt: 2, pb: 6 }}
      >
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              }}
            >
              {error}
            </Alert>
          )}

          {/* Patient Summary Card */}
          {patientData && !loading && (
            <Card sx={{ mb: 4, overflow: "visible" }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: "primary.main",
                        fontSize: "1.5rem",
                      }}
                    >
                      {patientData.name ? patientData.name.charAt(0) : "P"}
                    </Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h4" gutterBottom>
                      {patientData.name || "Patient"}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Typography variant="body1" color="text.secondary">
                        <Person
                          sx={{ verticalAlign: "middle", mr: 0.5 }}
                          fontSize="small"
                        />
                        Patient ID: {patientData._id?.substring(0, 8) || "N/A"}
                      </Typography>
                      {patientData.date_of_birth && (
                        <Typography variant="body1" color="text.secondary">
                          <DateRange
                            sx={{ verticalAlign: "middle", mr: 0.5 }}
                            fontSize="small"
                          />
                          DOB: {formatDate(patientData.date_of_birth)}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {loading ? (
            // Loading skeletons
            <Paper
              elevation={0}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: 2 }}>
                <Skeleton
                  variant="rectangular"
                  height={48}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {[1, 2, 3].map((item) => (
                    <Grid item xs={12} key={item}>
                      <Skeleton
                        variant="rectangular"
                        height={120}
                        sx={{ borderRadius: 2 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          ) : (
            // Actual content
            <Paper
              elevation={0}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  centered
                  sx={{
                    "& .MuiTabs-flexContainer": {
                      justifyContent: { xs: "space-between", md: "center" },
                    },
                  }}
                >
                  <Tab
                    label="Medical Records"
                    icon={<MedicalServices />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Test Reports"
                    icon={<Assignment />}
                    iconPosition="start"
                  />
                  <Tab label="Bills" icon={<Receipt />} iconPosition="start" />
                </Tabs>
              </Box>

              {/* Medical Records Tab */}
              <TabPanel value={tabValue} index={0}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ mb: 3, display: "flex", alignItems: "center" }}
                >
                  <Article sx={{ mr: 1 }} /> Medical History
                </Typography>
                <Grid container spacing={3}>
                  {medicalRecords && medicalRecords.length > 0 ? (
                    medicalRecords.map((record) => (
                      <Grid item xs={12} md={6} key={record._id}>
                        <Card>
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 2,
                              }}
                            >
                              <Typography variant="h6" gutterBottom>
                                Record {record._id.substring(0, 8) || "N/A"}
                              </Typography>
                              <Chip
                                label={formatDate(record.createdAt)}
                                size="small"
                                color="secondary"
                                sx={{ fontWeight: 500 }}
                              />
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Person sx={{ mr: 1, color: "primary.main" }} />
                              <strong>Doctor:</strong> Dr.{" "}
                              {typeof record.Doctor_ID === "object"
                                ? record.Doctor_ID.name
                                : record.Doctor_ID || "N/A"}
                            </Typography>
                            {record.Diagnosis && (
                              <Typography sx={{ mt: 1 }}>
                                <strong>Diagnosis:</strong> {record.Diagnosis}
                              </Typography>
                            )}
                            <Button
                              variant="outlined"
                              color="primary"
                              sx={{ mt: 2 }}
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          py: 6,
                          flexDirection: "column",
                        }}
                      >
                        <MedicalServices
                          sx={{
                            fontSize: 60,
                            color: "secondary.main",
                            mb: 2,
                            opacity: 0.7,
                          }}
                        />
                        <Typography
                          align="center"
                          variant="h6"
                          color="text.secondary"
                        >
                          No medical records found
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </TabPanel>

              {/* Test Reports Tab */}
              <TabPanel value={tabValue} index={1}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ mb: 3, display: "flex", alignItems: "center" }}
                >
                  <Assignment sx={{ mr: 1 }} /> Lab Reports & Test Results
                </Typography>
                <Grid container spacing={3}>
                  {medicalRecords &&
                  medicalRecords.some(
                    (record) =>
                      record.Test_Reports && record.Test_Reports.length > 0
                  ) ? (
                    medicalRecords.map((record) => {
                      console.log("Processing record:", record);
                      return record.Test_Reports &&
                        record.Test_Reports.length > 0
                        ? record.Test_Reports.map((report) => (
                            <Grid item xs={12} sm={6} lg={4} key={report._id}>
                              <Card>
                                <CardContent>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      mb: 2,
                                      alignItems: "center",
                                    }}
                                  >
                                    <PictureAsPdf
                                      sx={{ mr: 1, color: "primary.main" }}
                                    />
                                    <Typography variant="h6">
                                      Test Report
                                    </Typography>
                                  </Box>
                                  <Divider sx={{ mb: 2 }} />
                                  <Box sx={{ mb: 3 }}>
                                    {report.Test_Name && (
                                      <Typography variant="body1" gutterBottom>
                                        <strong>Test:</strong>{" "}
                                        {report.Test_Name}
                                      </Typography>
                                    )}
                                    {report.Test_Date && (
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        <DateRange
                                          sx={{
                                            fontSize: "0.9rem",
                                            mr: 0.5,
                                            verticalAlign: "middle",
                                          }}
                                        />
                                        {formatDate(report.Test_Date)}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => viewPDF(report)}
                                    startIcon={<PictureAsPdf />}
                                  >
                                    View Report
                                  </Button>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))
                        : null;
                    })
                  ) : (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          py: 6,
                          flexDirection: "column",
                        }}
                      >
                        <Assignment
                          sx={{
                            fontSize: 60,
                            color: "secondary.main",
                            mb: 2,
                            opacity: 0.7,
                          }}
                        />
                        <Typography
                          align="center"
                          variant="h6"
                          color="text.secondary"
                        >
                          No test reports found
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </TabPanel>

              {/* Bills Tab */}
              <TabPanel value={tabValue} index={2}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ mb: 3, display: "flex", alignItems: "center" }}
                >
                  <Receipt sx={{ mr: 1 }} /> Payment History
                </Typography>
                <Grid container spacing={3}>
                  {bills && bills.length > 0 ? (
                    bills.map((bill) => (
                      <Grid item xs={12} sm={6} key={bill._id}>
                        <Card>
                          <CardContent>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={2}
                            >
                              <Typography variant="h6">
                                Invoice #{bill._id?.substring(0, 6)}
                              </Typography>
                              <Chip
                                label={bill.Payment_Status || "Unknown"}
                                color={getPaymentStatusColor(
                                  bill.Payment_Status
                                )}
                                sx={{ fontWeight: 500 }}
                              />
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ mb: 3 }}>
                              <Typography
                                color="text.secondary"
                                gutterBottom
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <DateRange
                                  sx={{ fontSize: "0.9rem", mr: 0.5 }}
                                />
                                Date: {formatDate(bill.Billing_Date)}
                              </Typography>
                              <Typography
                                variant="h5"
                                component="div"
                                sx={{
                                  my: 2,
                                  color: "primary.main",
                                  fontWeight: 600,
                                }}
                              >
                                <Paid
                                  sx={{ verticalAlign: "middle", mr: 0.5 }}
                                />
                                ₹{bill.Total_Amount?.toLocaleString() || "0"}
                              </Typography>
                              <Typography color="text.secondary">
                                {bill.Description || "No description"}
                              </Typography>
                            </Box>
                            {(!bill.Payment_Status ||
                              bill.Payment_Status.toLowerCase() !== "paid") && (
                              <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                // TODO: Implement payment gateway integration
                                onClick={() =>
                                  alert("Payment gateway integration pending")
                                }
                                startIcon={<Paid />}
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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          py: 6,
                          flexDirection: "column",
                        }}
                      >
                        <Receipt
                          sx={{
                            fontSize: 60,
                            color: "secondary.main",
                            mb: 2,
                            opacity: 0.7,
                          }}
                        />
                        <Typography
                          align="center"
                          variant="h6"
                          color="text.secondary"
                        >
                          No bills found
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </TabPanel>
            </Paper>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default UserDashboard;
