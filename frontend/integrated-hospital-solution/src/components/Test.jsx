import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Alert,
  Paper,
  Typography,
} from "@mui/material";

const TestPdfViewer = () => {
  const [reportId, setReportId] = useState("67ccf0889f9f53299c212a24"); // Default to the ID in your screenshot
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const API_BASE_URL = "http://localhost:3000";

  const viewPDF = async () => {
    if (!reportId) {
      setError("Please enter a report ID");
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      console.log("Viewing PDF for report ID:", reportId);
      const response = await axios.get(
        `${API_BASE_URL}/user-dashboard/report-pdf/${reportId}`,
        {
          responseType: "blob",
        }
      );

      setSuccess("PDF retrieved successfully!");
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

  const testFetchReportDetails = async () => {
    if (!reportId) {
      setError("Please enter a report ID");
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      console.log("Fetching details for report ID:", reportId);
      const response = await axios.get(
        `${API_BASE_URL}/user-dashboard/report/${reportId}`
      );
      console.log("Report details:", response.data);
      setSuccess(
        "Report details retrieved successfully! Check console for data."
      );
    } catch (error) {
      console.error("Error fetching report details:", error);
      setError(
        "Failed to fetch report details: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, margin: "20px auto" }}>
      <Typography variant="h5" gutterBottom>
        PDF Viewer Test
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Use this tool to test the PDF viewing functionality directly using a
        report ID.
      </Typography>

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

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Report ID"
          variant="outlined"
          fullWidth
          value={reportId}
          onChange={(e) => setReportId(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={viewPDF}>
            View PDF
          </Button>
          <Button variant="outlined" onClick={testFetchReportDetails}>
            Get Report Details
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TestPdfViewer;
