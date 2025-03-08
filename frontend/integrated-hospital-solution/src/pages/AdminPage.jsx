import { useState, useEffect } from "react";
import axios from "axios";
import DashboardRecords from "../components/RenderData";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [patientData, setPatientData] = useState({
    name: "",
    loginId: "",
    password: "",
    age: "",
    gender: "",
    contact_number: "",
    address: "",
    blood_group: "",
    admission_status: "Out-Patient",
  });

  const [doctorData, setDoctorData] = useState({
    name: "",
    loginId: "",
    password: "",
    age: "",
    gender: "",
    contact_number: "",
    address: "",
    department: "",
    specialization: "",
    qualification: "",
  });

  const [staffData, setStaffData] = useState({
    name: "",
    loginId: "",
    password: "",
    age: "",
    gender: "",
    contact_number: "",
    address: "",
    role: "",
    department: "",
  });

  const API_BASE_URL = "http://192.168.109.73:3000";

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
    setSuccess(null);
  };

  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDoctorInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStaffInputChange = (e) => {
    const { name, value } = e.target;
    setStaffData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePatientForm = () => {
    const requiredFields = {
      name: "Name",
      loginId: "Login ID",
      password: "Password",
      age: "Age",
      gender: "Gender",
      contact_number: "Contact Number",
      address: "Address",
      blood_group: "Blood Group",
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!patientData[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      setError(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    return true;
  };

  const validateDoctorForm = () => {
    const requiredFields = {
      name: "Name",
      loginId: "Login ID",
      password: "Password",
      age: "Age",
      gender: "Gender",
      contact_number: "Contact Number",
      address: "Address",
      department: "Department",
      specialization: "Specialization",
      qualification: "Qualification",
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!doctorData[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      setError(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    return true;
  };

  const validateStaffForm = () => {
    const requiredFields = {
      name: "Name",
      loginId: "Login ID",
      password: "Password",
      age: "Age",
      gender: "Gender",
      contact_number: "Contact Number",
      address: "Address",
      role: "Role",
      department: "Department",
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!staffData[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      setError(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    return true;
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();

    if (!validatePatientForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/addPatient`,
        patientData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSuccess(
        `Patient ${response.data.patient.name} created successfully with ID: ${response.data.patient.patientId}`
      );
      setPatientData({
        name: "",
        loginId: "",
        password: "",
        age: "",
        gender: "",
        contact_number: "",
        address: "",
        blood_group: "",
        admission_status: "Out-Patient",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to create patient";
      const missingFields = error.response?.data?.missingFields;

      if (missingFields) {
        setError(`Missing required fields: ${missingFields.join(", ")}`);
      } else if (error.response?.data?.field === "loginId") {
        setError("Login ID already exists. Please choose a different one.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();

    if (!validateDoctorForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/addDoctor`,
        doctorData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSuccess(
        `Doctor ${response.data.doctor.name} created successfully with ID: ${response.data.doctor.doctorId}`
      );
      setDoctorData({
        name: "",
        loginId: "",
        password: "",
        age: "",
        gender: "",
        contact_number: "",
        address: "",
        department: "",
        specialization: "",
        qualification: "",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to create doctor";
      const missingFields = error.response?.data?.missingFields;

      if (missingFields) {
        setError(`Missing required fields: ${missingFields.join(", ")}`);
      } else if (error.response?.data?.field === "loginId") {
        setError("Login ID already exists. Please choose a different one.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();

    if (!validateStaffForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/addStaff`,
        staffData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSuccess(
        `Staff ${response.data.staff.name} created successfully with ID: ${response.data.staff.staffId}`
      );
      setStaffData({
        name: "",
        loginId: "",
        password: "",
        age: "",
        gender: "",
        contact_number: "",
        address: "",
        role: "",
        department: "",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to create staff";
      const missingFields = error.response?.data?.missingFields;

      if (missingFields) {
        setError(`Missing required fields: ${missingFields.join(", ")}`);
      } else if (error.response?.data?.field === "loginId") {
        setError("Login ID already exists. Please choose a different one.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Admin Dashboard
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

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Add Patient" />
          <Tab label="Add Doctor" />
          <Tab label="Add Staff" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <form onSubmit={handlePatientSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={patientData.name}
                    onChange={handlePatientInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Login ID"
                    name="loginId"
                    value={patientData.loginId}
                    onChange={handlePatientInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={patientData.password}
                    onChange={handlePatientInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={patientData.age}
                    onChange={handlePatientInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={patientData.gender}
                      onChange={handlePatientInputChange}
                      label="Gender"
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="contact_number"
                    value={patientData.contact_number}
                    onChange={handlePatientInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={2}
                    value={patientData.address}
                    onChange={handlePatientInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Blood Group</InputLabel>
                    <Select
                      name="blood_group"
                      value={patientData.blood_group}
                      onChange={handlePatientInputChange}
                      label="Blood Group"
                    >
                      <MenuItem value="A+">A+</MenuItem>
                      <MenuItem value="A-">A-</MenuItem>
                      <MenuItem value="B+">B+</MenuItem>
                      <MenuItem value="B-">B-</MenuItem>
                      <MenuItem value="AB+">AB+</MenuItem>
                      <MenuItem value="AB-">AB-</MenuItem>
                      <MenuItem value="O+">O+</MenuItem>
                      <MenuItem value="O-">O-</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Admission Status</InputLabel>
                    <Select
                      name="admission_status"
                      value={patientData.admission_status}
                      onChange={handlePatientInputChange}
                      label="Admission Status"
                    >
                      <MenuItem value="In-Patient">In-Patient</MenuItem>
                      <MenuItem value="Out-Patient">Out-Patient</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Add Patient"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <form onSubmit={handleDoctorSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={doctorData.name}
                    onChange={handleDoctorInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Login ID"
                    name="loginId"
                    value={doctorData.loginId}
                    onChange={handleDoctorInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={doctorData.password}
                    onChange={handleDoctorInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={doctorData.age}
                    onChange={handleDoctorInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={doctorData.gender}
                      onChange={handleDoctorInputChange}
                      label="Gender"
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="contact_number"
                    value={doctorData.contact_number}
                    onChange={handleDoctorInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={2}
                    value={doctorData.address}
                    onChange={handleDoctorInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={doctorData.department}
                    onChange={handleDoctorInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Specialization"
                    name="specialization"
                    value={doctorData.specialization}
                    onChange={handleDoctorInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Qualification"
                    name="qualification"
                    value={doctorData.qualification}
                    onChange={handleDoctorInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Add Doctor"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <form onSubmit={handleStaffSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={staffData.name}
                    onChange={handleStaffInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Login ID"
                    name="loginId"
                    value={staffData.loginId}
                    onChange={handleStaffInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={staffData.password}
                    onChange={handleStaffInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={staffData.age}
                    onChange={handleStaffInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={staffData.gender}
                      onChange={handleStaffInputChange}
                      label="Gender"
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="contact_number"
                    value={staffData.contact_number}
                    onChange={handleStaffInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={2}
                    value={staffData.address}
                    onChange={handleStaffInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={staffData.role}
                      onChange={handleStaffInputChange}
                      label="Role"
                    >
                      <MenuItem value="Nurse">Nurse</MenuItem>
                      <MenuItem value="Receptionist">Receptionist</MenuItem>
                      <MenuItem value="Lab Technician">Lab Technician</MenuItem>
                      <MenuItem value="Pharmacist">Pharmacist</MenuItem>
                      <MenuItem value="Administrative">Administrative</MenuItem>
                      <MenuItem value="Maintenance">Maintenance</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={staffData.department}
                    onChange={handleStaffInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Add Staff"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}
      </Paper>
      <div>
        <DashboardRecords />
      </div>
    </Box>
  );
};

export default AdminDashboard;
