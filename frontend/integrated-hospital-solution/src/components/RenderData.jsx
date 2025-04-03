import { useState, useEffect } from "react";
import axios from "axios";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";

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
  padding: theme.spacing(1, 2),
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

const SecondaryButton = styled(Button)(({ theme }) => ({
  borderColor: "#A5D8F3", // Uranian Blue for secondary buttons
  color: "#404E7C", // YInMn Blue for text
  padding: theme.spacing(1, 2),
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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  border: "1px solid #D0EAF4", // Columbia Blue border
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#E8F6FC", // Alice Blue for table header
  "& .MuiTableCell-head": {
    color: "#404E7C", // YInMn Blue for text
    fontWeight: 600,
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 500,
  "&.MuiChip-colorPrimary": {
    backgroundColor: "#A5D8F3", // Uranian Blue for In-Patient/Available
    color: "#404E7C",
  },
  "&.MuiChip-colorSuccess": {
    backgroundColor: "#E8F5E9", // Light green for Out-Patient/Present
    color: "#2E7D32",
  },
  "&.MuiChip-colorError": {
    backgroundColor: "#FFF1F1", // Light red for Not Available/Absent
    color: "#D32F2F",
  },
}));

const DashboardRecords = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data states
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);

  // Filter states
  const [patientFilters, setPatientFilters] = useState({
    search: "",
    status: "",
  });

  const [doctorFilters, setDoctorFilters] = useState({
    search: "",
    department: "",
  });

  const [staffFilters, setStaffFilters] = useState({
    search: "",
    role: "",
    department: "",
  });

  const API_BASE_URL = "http://localhost:3000";

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
    fetchData(newValue);
  };

  // Fetch data based on active tab
  const fetchData = async (tabIndex) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      switch (tabIndex) {
        case 0: // Patients
          response = await axios.get(`${API_BASE_URL}/users/patients`, {
            params: patientFilters,
          });
          setPatients(response.data);
          break;
        case 1: // Doctors
          response = await axios.get(`${API_BASE_URL}/users/doctors`, {
            params: doctorFilters,
          });
          setDoctors(response.data);
          break;
        case 2: // Staff
          response = await axios.get(`${API_BASE_URL}/users/staff`, {
            params: staffFilters,
          });
          setStaffMembers(response.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        `Failed to fetch data: ${error.response?.data?.error || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle patient filter changes
  const handlePatientFilterChange = (e) => {
    const { name, value } = e.target;
    setPatientFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle doctor filter changes
  const handleDoctorFilterChange = (e) => {
    const { name, value } = e.target;
    setDoctorFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle staff filter changes
  const handleStaffFilterChange = (e) => {
    const { name, value } = e.target;
    setStaffFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters
  const applyPatientFilters = () => {
    fetchData(0);
  };

  const applyDoctorFilters = () => {
    fetchData(1);
  };

  const applyStaffFilters = () => {
    fetchData(2);
  };

  // Reset filters
  const resetPatientFilters = () => {
    setPatientFilters({
      search: "",
      status: "",
    });
    setTimeout(() => fetchData(0), 0);
  };

  const resetDoctorFilters = () => {
    setDoctorFilters({
      search: "",
      department: "",
    });
    setTimeout(() => fetchData(1), 0);
  };

  const resetStaffFilters = () => {
    setStaffFilters({
      search: "",
      role: "",
      department: "",
    });
    setTimeout(() => fetchData(2), 0);
  };

  // Load initial data on component mount
  useEffect(() => {
    fetchData(activeTab);
  }, []);

  return (
    <StyledContainer sx={{ maxWidth: 1200, margin: "auto" }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: "#404E7C", fontWeight: 600, mb: 4 }}
      >
        Hospital Records
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

      <StyledPaper sx={{ width: "100%", mb: 4 }}>
        <StyledTabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Patients" />
          <Tab label="Doctors" />
          <Tab label="Staff" />
        </StyledTabs>

        {/* Patients Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Card sx={{ mb: 3, borderRadius: 2, border: "1px solid #D0EAF4" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#404E7C", fontWeight: 600 }}
                >
                  <FilterListIcon
                    sx={{ mr: 1, verticalAlign: "middle", color: "#404E7C" }}
                  />
                  Filter Patients
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <StyledTextField
                      fullWidth
                      label="Search by Name or Blood Group"
                      name="search"
                      value={patientFilters.search}
                      onChange={handlePatientFilterChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: "#404E7C", fontWeight: 500 }}>
                        Admission Status
                      </InputLabel>
                      <StyledSelect
                        name="status"
                        value={patientFilters.status}
                        onChange={handlePatientFilterChange}
                        label="Admission Status"
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="In-Patient">In-Patient</MenuItem>
                        <MenuItem value="Out-Patient">Out-Patient</MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <StyledButton
                      fullWidth
                      variant="contained"
                      onClick={applyPatientFilters}
                      startIcon={<SearchIcon />}
                    >
                      Filter
                    </StyledButton>
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <SecondaryButton
                      fullWidth
                      variant="outlined"
                      onClick={resetPatientFilters}
                      startIcon={<RefreshIcon />}
                    >
                      Reset
                    </SecondaryButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress sx={{ color: "#404E7C" }} />
              </Box>
            ) : (
              <StyledTableContainer>
                <Table>
                  <StyledTableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Blood Group</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Admission Status</TableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {patients.length > 0 ? (
                      patients.map((patient) => (
                        <TableRow key={patient.Patient_ID}>
                          <TableCell>{patient.Patient_ID}</TableCell>
                          <TableCell>{patient.Name}</TableCell>
                          <TableCell>{patient.Age}</TableCell>
                          <TableCell>{patient.Gender}</TableCell>
                          <TableCell>{patient.Blood_Group}</TableCell>
                          <TableCell>{patient.Contact_Number}</TableCell>
                          <TableCell>
                            <StyledChip
                              label={patient.Admission_Status}
                              color={
                                patient.Admission_Status === "In-Patient"
                                  ? "primary"
                                  : "success"
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography
                            sx={{ color: "#404E7C", fontWeight: 500 }}
                          >
                            No patients found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            )}
          </Box>
        )}

        {/* Doctors Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Card sx={{ mb: 3, borderRadius: 2, border: "1px solid #D0EAF4" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#404E7C", fontWeight: 600 }}
                >
                  <FilterListIcon
                    sx={{ mr: 1, verticalAlign: "middle", color: "#404E7C" }}
                  />
                  Filter Doctors
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <StyledTextField
                      fullWidth
                      label="Search by Name or Specialization"
                      name="search"
                      value={doctorFilters.search}
                      onChange={handleDoctorFilterChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <StyledTextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={doctorFilters.department}
                      onChange={handleDoctorFilterChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <StyledButton
                      fullWidth
                      variant="contained"
                      onClick={applyDoctorFilters}
                      startIcon={<SearchIcon />}
                    >
                      Filter
                    </StyledButton>
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <SecondaryButton
                      fullWidth
                      variant="outlined"
                      onClick={resetDoctorFilters}
                      startIcon={<RefreshIcon />}
                    >
                      Reset
                    </SecondaryButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress sx={{ color: "#404E7C" }} />
              </Box>
            ) : (
              <StyledTableContainer>
                <Table>
                  <StyledTableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Specialization</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {doctors.length > 0 ? (
                      doctors.map((doctor) => (
                        <TableRow key={doctor.Doctor_ID}>
                          <TableCell>{doctor.Doctor_ID}</TableCell>
                          <TableCell>{doctor.Name}</TableCell>
                          <TableCell>{doctor.Age}</TableCell>
                          <TableCell>{doctor.Gender}</TableCell>
                          <TableCell>{doctor.Department}</TableCell>
                          <TableCell>{doctor.Specialization}</TableCell>
                          <TableCell>{doctor.Contact_Number}</TableCell>
                          <TableCell>
                            <StyledChip
                              label={doctor.Availability_Status}
                              color={
                                doctor.Availability_Status === "Available"
                                  ? "success"
                                  : "error"
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography
                            sx={{ color: "#404E7C", fontWeight: 500 }}
                          >
                            No doctors found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            )}
          </Box>
        )}

        {/* Staff Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Card sx={{ mb: 3, borderRadius: 2, border: "1px solid #D0EAF4" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#404E7C", fontWeight: 600 }}
                >
                  <FilterListIcon
                    sx={{ mr: 1, verticalAlign: "middle", color: "#404E7C" }}
                  />
                  Filter Staff
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <StyledTextField
                      fullWidth
                      label="Search by Name"
                      name="search"
                      value={staffFilters.search}
                      onChange={handleStaffFilterChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: "#404E7C", fontWeight: 500 }}>
                        Role
                      </InputLabel>
                      <StyledSelect
                        name="role"
                        value={staffFilters.role}
                        onChange={handleStaffFilterChange}
                        label="Role"
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Nurse">Nurse</MenuItem>
                        <MenuItem value="Receptionist">Receptionist</MenuItem>
                        <MenuItem value="Lab Technician">
                          Lab Technician
                        </MenuItem>
                        <MenuItem value="Pharmacist">Pharmacist</MenuItem>
                        <MenuItem value="Administrative">
                          Administrative
                        </MenuItem>
                        <MenuItem value="Maintenance">Maintenance</MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <StyledTextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={staffFilters.department}
                      onChange={handleStaffFilterChange}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <StyledButton
                      fullWidth
                      variant="contained"
                      onClick={applyStaffFilters}
                      startIcon={<SearchIcon />}
                    >
                      Filter
                    </StyledButton>
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <SecondaryButton
                      fullWidth
                      variant="outlined"
                      onClick={resetStaffFilters}
                      startIcon={<RefreshIcon />}
                    >
                      Reset
                    </SecondaryButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress sx={{ color: "#404E7C" }} />
              </Box>
            ) : (
              <StyledTableContainer>
                <Table>
                  <StyledTableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {staffMembers.length > 0 ? (
                      staffMembers.map((staff) => (
                        <TableRow key={staff.Staff_ID}>
                          <TableCell>{staff.Staff_ID}</TableCell>
                          <TableCell>{staff.Name}</TableCell>
                          <TableCell>{staff.Age}</TableCell>
                          <TableCell>{staff.Gender}</TableCell>
                          <TableCell>{staff.Role}</TableCell>
                          <TableCell>{staff.Department}</TableCell>
                          <TableCell>{staff.Contact_Number}</TableCell>
                          <TableCell>
                            <StyledChip
                              label={staff.Attendance_Status}
                              color={
                                staff.Attendance_Status === "Present"
                                  ? "success"
                                  : "error"
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography
                            sx={{ color: "#404E7C", fontWeight: 500 }}
                          >
                            No staff members found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            )}
          </Box>
        )}
      </StyledPaper>
    </StyledContainer>
  );
};

export default DashboardRecords;
