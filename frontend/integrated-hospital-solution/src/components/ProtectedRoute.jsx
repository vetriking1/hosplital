import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { user } = useAuth();

  if (!user) {
    console.log("User is not authenticated, redirecting to login.");
    return <Navigate to="/login" />;
  }

  if (adminRequired && !user.is_admin) {
    console.log("User is not an admin, redirecting to user dashboard.");
    return <Navigate to="/dashboard" />;
  }

  return children;
};
