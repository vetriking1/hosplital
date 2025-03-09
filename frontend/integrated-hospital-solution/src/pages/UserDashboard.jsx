import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
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

    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/patients/user/${user._id}`
        );

        if (response.data) {
          setPatientData(response.data);
          setMedicalRecords(response.data.Medical_History || []);
          setBills(response.data.Bills || []);
        } else {
          setError("User is not a patient. Access denied.");
        }
      } catch (error) {
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

  const insuranceProviders = [
    "LIC of India",
    "ICICI Lombard",
    "Bajaj Allianz",
    "HDFC Ergo",
    "Max Bupa",
    "Star Health"
  ];

  const governmentSchemes = [
    "Ayushman Bharat Yojana",
    "Pradhan Mantri Suraksha Bima Yojana",
    "Rashtriya Swasthya Bima Yojana"
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Navbar></Navbar>
      <Paper elevation={3} sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f5f5f5" }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Medical Records" sx={{ fontWeight: tabValue === 0 ? "bold" : "normal" }} />
            <Tab label="Test Reports" sx={{ fontWeight: tabValue === 1 ? "bold" : "normal" }} />
            <Tab label="Bills" sx={{ fontWeight: tabValue === 2 ? "bold" : "normal" }} />
            <Tab label="Insurance Providers" sx={{ fontWeight: tabValue === 3 ? "bold" : "normal" }} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            {medicalRecords.length > 0 ? (
              medicalRecords.map((record) => (
                <Grid item xs={12} key={record._id}>
                  <Card sx={{ bgcolor: "#e3f2fd" }}>
                    <CardContent>
                      <Typography variant="h6">Record ID: {record.Record_ID || "N/A"}</Typography>
                      <Typography><strong>Doctor:</strong> {record.Doctor_ID || "N/A"}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography align="center">No medical records found</Typography>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ color: "#1565c0" }}>Private Insurance Providers</Typography>
          <List>
            {insuranceProviders.map((provider, index) => (
              <ListItem key={index}>
                <ListItemText primary={provider} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" sx={{ color: "#1565c0" }}>Government Schemes</Typography>
          <List>
            {governmentSchemes.map((scheme, index) => (
              <ListItem key={index}>
                <ListItemText primary={scheme} />
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default UserDashboard;
