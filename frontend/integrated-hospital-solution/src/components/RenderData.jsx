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
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";

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

  const API_BASE_URL = "http://192.168.109.73:3000";

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
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Hospital Records
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Patients" />
          <Tab label="Doctors" />
          <Tab label="Staff" />
        </Tabs>

        {/* Patients Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <FilterListIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Filter Patients
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <TextField
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
                      <InputLabel>Admission Status</InputLabel>
                      <Select
                        name="status"
                        value={patientFilters.status}
                        onChange={handlePatientFilterChange}
                        label="Admission Status"
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="In-Patient">In-Patient</MenuItem>
                        <MenuItem value="Out-Patient">Out-Patient</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={applyPatientFilters}
                      startIcon={<SearchIcon />}
                    >
                      Filter
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={resetPatientFilters}
                      startIcon={<RefreshIcon />}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Blood Group</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Admission Status</TableCell>
                    </TableRow>
                  </TableHead>
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
                            <Chip
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
                          No patients found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {/* Doctors Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <FilterListIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Filter Doctors
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <TextField
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
                    <TextField
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
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={applyDoctorFilters}
                      startIcon={<SearchIcon />}
                    >
                      Filter
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={resetDoctorFilters}
                      startIcon={<RefreshIcon />}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
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
                  </TableHead>
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
                            <Chip
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
                          No doctors found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {/* Staff Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <FilterListIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Filter Staff
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <TextField
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
                      <InputLabel>Role</InputLabel>
                      <Select
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
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
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
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={applyStaffFilters}
                      startIcon={<SearchIcon />}
                    >
                      Filter
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={1.5}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={resetStaffFilters}
                      startIcon={<RefreshIcon />}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
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
                  </TableHead>
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
                            <Chip
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
                          No staff members found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DashboardRecords;
