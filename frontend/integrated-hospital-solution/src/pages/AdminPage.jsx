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
import { styled, alpha } from "@mui/material/styles";
import Navbar from "../components/Navbar";

// Custom styled components
const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#E8F6FC", // Alice Blue for a clean background
  padding: theme.spacing(4),
  minHeight: "100vh",
  fontFamily: "'Roboto', sans-serif", // Professional font
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#FFFFFF", // White for crisp cards
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // Subtle shadow
  border: "1px solid #D0EAF4", // Columbia Blue border
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)", // Lift on hover
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: "#404E7C", // YInMn Blue for tab indicator
  },
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 500,
    color: "#404E7C",
    "&.Mui-selected": {
      color: "#404E7C",
      fontWeight: 600,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#404E7C", // YInMn Blue for primary actions
  color: "#FFFFFF",
  padding: theme.spacing(1, 3),
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: alpha("#404E7C", 0.85), // Slightly lighter on hover
    boxShadow: "0 2px 8px rgba(64, 78, 124, 0.2)",
  },
  "&:disabled": {
    backgroundColor: "#D0EAF4", // Columbia Blue for disabled
    color: "#666",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    backgroundColor: "#F9FBFD", // Light background for inputs
    "& fieldset": {
      borderColor: "#D0EAF4", // Columbia Blue
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

  const API_BASE_URL = "http://localhost:3000";

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
    <div className="min-h-screen bg-[#E8F6FC]">
      <Navbar />
      <StyledContainer sx={{ maxWidth: 900, margin: "auto" }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ color: "#404E7C", fontWeight: 600, mb: 4 }}
        >
          Admin Dashboard
        </Typography>

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

        <StyledPaper sx={{ width: "100%", mb: 4 }}>
          <StyledTabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Add Patient" />
            <Tab label="Add Doctor" />
            <Tab label="Add Staff" />
          </StyledTabs>

          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <form onSubmit={handlePatientSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={patientData.name}
                      onChange={handlePatientInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Login ID"
                      name="loginId"
                      value={patientData.loginId}
                      onChange={handlePatientInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={patientData.password}
                      onChange={handlePatientInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
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
                      <InputLabel sx={{ color: "#404E7C", fontWeight: 500 }}>
                        Gender
                      </InputLabel>
                      <StyledSelect
                        name="gender"
                        value={patientData.gender}
                        onChange={handlePatientInputChange}
                        label="Gender"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Contact Number"
                      name="contact_number"
                      value={patientData.contact_number}
                      onChange={handlePatientInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
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
                      <InputLabel sx={{ color: "#404E7C", fontWeight: 500 }}>
                        Blood Group
                      </InputLabel>
                      <StyledSelect
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
                      </StyledSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: "#404E7C", fontWeight: 500 }}>
                        Admission Status
                      </InputLabel>
                      <StyledSelect
                        name="admission_status"
                        value={patientData.admission_status}
                        onChange={handlePatientInputChange}
                        label="Admission Status"
                      >
                        <MenuItem value="In-Patient">In-Patient</MenuItem>
                        <MenuItem value="Out-Patient">Out-Patient</MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledButton
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ mt: 3 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "#FFF" }} />
                      ) : (
                        "Add Patient"
                      )}
                    </StyledButton>
                  </Grid>
                </Grid>
              </form>
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <form onSubmit={handleDoctorSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={doctorData.name}
                      onChange={handleDoctorInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Login ID"
                      name="loginId"
                      value={doctorData.loginId}
                      onChange={handleDoctorInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={doctorData.password}
                      onChange={handleDoctorInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
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
                      <InputLabel sx={{ color: "#404E7C", fontWeight: 500 }}>
                        Gender
                      </InputLabel>
                      <StyledSelect
                        name="gender"
                        value={doctorData.gender}
                        onChange={handleDoctorInputChange}
                        label="Gender"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Contact Number"
                      name="contact_number"
                      value={doctorData.contact_number}
                      onChange={handleDoctorInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
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
                    <StyledTextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={doctorData.department}
                      onChange={handleDoctorInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Specialization"
                      name="specialization"
                      value={doctorData.specialization}
                      onChange={handleDoctorInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Qualification"
                      name="qualification"
                      value={doctorData.qualification}
                      onChange={handleDoctorInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledButton
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ mt: 3 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "#FFF" }} />
                      ) : (
                        "Add Doctor"
                      )}
                    </StyledButton>
                  </Grid>
                </Grid>
              </form>
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <form onSubmit={handleStaffSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={staffData.name}
                      onChange={handleStaffInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Login ID"
                      name="loginId"
                      value={staffData.loginId}
                      onChange={handleStaffInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={staffData.password}
                      onChange={handleStaffInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
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
                      <InputLabel sx={{ color: "#404E7C", fontWeight: 500 }}>
                        Gender
                      </InputLabel>
                      <StyledSelect
                        name="gender"
                        value={staffData.gender}
                        onChange={handleStaffInputChange}
                        label="Gender"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Contact Number"
                      name="contact_number"
                      value={staffData.contact_number}
                      onChange={handleStaffInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
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
                      <InputLabel sx={{ color: "#404E7C", fontWeight: 500 }}>
                        Role
                      </InputLabel>
                      <StyledSelect
                        name="role"
                        value={staffData.role}
                        onChange={handleStaffInputChange}
                        label="Role"
                      >
                        <MenuItem value="Nurse">Nurse</MenuItem>
                        <MenuItem value="Receptionist">Receptionist</MenuItem>
                        <MenuItem value="Lab Technician">
                          Lab Technician
                        </MenuItem>
                        <MenuItem value="Administrative">
                          Administrative
                        </MenuItem>
                        
                      </StyledSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={staffData.department}
                      onChange={handleStaffInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledButton
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ mt: 3 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "#FFF" }} />
                      ) : (
                        "Add Staff"
                      )}
                    </StyledButton>
                  </Grid>
                </Grid>
              </form>
            </Box>
          )}
        </StyledPaper>
        <Box sx={{ mt: 4 }}>
          <DashboardRecords />
        </Box>
      </StyledContainer>
    </div>
  );
};

export default AdminDashboard;
