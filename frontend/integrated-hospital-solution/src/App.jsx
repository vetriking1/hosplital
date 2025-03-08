import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import PatientsPage from "./pages/PatientsPage";
import LoginPage from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import DoctorsPage from "./pages/DoctorDashbord";
import AdminDashboard from "./pages/AdminPage";
import DoctorDashboard from "./pages/DoctorDashbord";
import NurseDashboard from "./pages/NurseDashboard";
import LabDashboard from "./pages/LabDashboard";
import UserDashboard from "./pages/UserDashboard";
import Billing from "./pages/Billing";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/nurse" element={<NurseDashboard />} />
          <Route path="/lab" element={<LabDashboard />} />
          <Route path="/billing" element={<Billing />} />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patientdashboard"
            element={
              <ProtectedRoute>
                <PatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctordashboard"
            element={
              <ProtectedRoute>
                <DoctorsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
