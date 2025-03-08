import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout function from AuthContext
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">🏥 HealthCare</Link>
      </h1>
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
