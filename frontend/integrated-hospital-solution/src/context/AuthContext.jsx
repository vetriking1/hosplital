import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on page reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    console.log("Token:", token);
    console.log("Stored User:", storedUser);

    // Check if token exists and has valid format
    if (
      token &&
      storedUser &&
      typeof token === "string" &&
      token.split(".").length === 3
    ) {
      try {
        const userData = JSON.parse(storedUser);
        const decodedToken = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < Date.now(); // Check if token is expired

        if (!isExpired) {
          console.log("Token is valid, setting user.");
          setUser(userData); // Restore user data

          // Normalize role to lowercase for consistent comparison
          const role = userData.role.toLowerCase();
          if (role === "patient") {
            navigate("/patientdashboard");
          } else if (role === "doctor") {
            navigate("/doctordashboard");
          }
        } else {
          console.log("Token is expired, redirecting to login.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error processing token:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  }, [navigate]); // Add navigate to dependency array

  const login = async (loginId, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("http://localhost:3000/auth/login", {
        loginId,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Store user details
      setUser(user);

      // Normalize role to lowercase for consistent comparison
      const role = user.role.toLowerCase();
      if (role === "patient") {
        navigate("/patientdashboard");
      } else if (role === "doctor") {
        navigate("/doctordashboard");
      } else if (role === "admin") {
        navigate("/admin");
      }
      // staff role 
      else if (role === "staff") {
        // get the staff role 
        
      }


    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Remove user data
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
